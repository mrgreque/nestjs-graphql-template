import {
  CreateApplication,
  DeleteApplication,
  FindApplicationById,
  FindApplicationByName,
  FindApplications,
  IApplicationRepository,
  UpdateApplication,
} from '@/core/contracts';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApplicationDocument, Application as ApplicationModel } from '../mongoose';
import { ApplicationEntity } from '@/core/entites';
import { IApplication } from '@/core/types';
import { SoftDeleteModel } from 'mongoose-delete';
import { makeSetToUpdate } from '@/core/helpers';

@Injectable()
export class ApplicationRepository implements IApplicationRepository {
  constructor(
    @InjectModel(ApplicationModel.name)
    private readonly applicationModel: SoftDeleteModel<ApplicationDocument>,
  ) {}

  private parse(application: ApplicationDocument): ApplicationEntity {
    const payload: IApplication = {
      id: application._id.toString(),
      name: application.name,
    };

    return ApplicationEntity.restore(payload);
  }

  private async save(application: ApplicationEntity): Promise<void> {
    await this.applicationModel.updateOne(
      { _id: application.id },
      {
        $set: application.props,
      },
      { upsert: true },
    );
  }

  async insert(application: CreateApplication.Input): Promise<CreateApplication.Output> {
    await this.save(application);
  }

  async findAll(pagination: FindApplications.Input): Promise<FindApplications.Output> {
    const totalRecords = await this.applicationModel.countDocuments();

    const applications = await this.applicationModel
      .find()
      .skip(pagination.page * pagination.limit)
      .limit(pagination.limit);

    return {
      records: totalRecords,
      hasNext: totalRecords > (pagination.page + 1) * pagination.limit,
      applications: !!applications.length ? applications.map(this.parse) : [],
    };
  }

  async findById({ id }: FindApplicationById.Input): Promise<FindApplicationById.Output> {
    const application = await this.applicationModel.findById(id);
    if (!application) return null;
    return this.parse(application);
  }

  async findByName({ name }: FindApplicationByName.Input): Promise<FindApplicationByName.Output> {
    const application = await this.applicationModel.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!application) return null;
    return this.parse(application);
  }

  async update({ application, keysToUpdate }: UpdateApplication.Input): Promise<UpdateApplication.Output> {
    const $set = makeSetToUpdate(application, keysToUpdate);

    await this.applicationModel.updateOne(
      { _id: application.id },
      {
        $set,
      },
    );
  }

  async delete({ id }: DeleteApplication.Input): Promise<DeleteApplication.Output> {
    await this.applicationModel.delete({ _id: id });
  }
}
