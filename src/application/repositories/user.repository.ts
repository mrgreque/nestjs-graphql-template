import {
  CreateUser,
  FindUser,
  FindUserById,
  FindUserByEmail,
  IUserRepository,
  UpdateUser,
  DeleteUser,
} from '@/core/contracts/repositories';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from '../mongoose';
import { UserEntity } from '@/core/entites';
import { IUser } from '@/core/types';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  private parse(user: UserDocument): UserEntity {
    const payload: IUser = {
      id: user._id.toString(),
      password: user.password,
      role: user.role,
      email: user.email,
      session: user.session,
    };

    return UserEntity.restore(payload);
  }

  private async save(user: UserEntity, $set?: Partial<User>): Promise<void> {
    await this.userModel.updateOne(
      { _id: user.id },
      {
        $set: $set ?? user.props,
      },
      { upsert: true },
    );
  }

  async insert(user: CreateUser.Input): Promise<CreateUser.Output> {
    await this.save(user);
  }

  async findAll(pagination: FindUser.Input): Promise<FindUser.Output> {
    const totalRecords = await this.userModel.countDocuments();
    const users = await this.userModel
      .find()
      .skip(pagination.page * pagination.limit)
      .limit(pagination.limit);

    return {
      records: totalRecords,
      hasNext: totalRecords > (pagination.page + 1) * pagination.limit,
      users: !!users.length ? users.map(this.parse) : [],
    };
  }

  async findById({ id }: FindUserById.Input): Promise<FindUserById.Output> {
    const user = await this.userModel.findById(id);
    if (!user) return;
    return this.parse(user);
  }

  async findByEmail({ email }: FindUserByEmail.Input): Promise<FindUserByEmail.Output> {
    const user = await this.userModel.findOne({ email });
    if (!user) return;
    return this.parse(user);
  }

  async update(user: UpdateUser.Input): Promise<UpdateUser.Output> {
    const setData = {
      email: user.props.email,
      password: user.props.password,
      role: user.props.role,
      session: user.props.session ?? null,
    };

    await this.save(user, setData);
  }

  async delete({ id }: DeleteUser.Input): Promise<DeleteUser.Output> {
    await this.userModel.deleteById(id);
  }
}
