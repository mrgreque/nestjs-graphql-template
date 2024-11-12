module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/**',
    '!src/main.(t|j)s',
    '!src/**/*.spec.(t|j)s',
    '!src/**/index.(t|j)s',
    '!src/core/config/*',
  ],
  modulePaths: ['<rootDir>'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
    '@/application/(.*)$': '<rootDir>/src/application/$1',
    '@/core/(.*)$': '<rootDir>/src/core/$1',
    '@/test/(.*)$': '<rootDir>/test/$1',
  },
};
