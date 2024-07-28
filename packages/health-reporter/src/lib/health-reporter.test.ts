import { ComponentChecker } from './checker.js';
import { HealthReporter } from './health-reporter.js';

const { env } = process;
beforeEach(() => {
  process.env = { ...env };
});
afterEach(() => {
  process.env = env;
});

it('returns a bare report when no checks are provided', async () => {
  process.env.APP_ID = 'TestService';
  process.env.BUILD_SHA = 'abc123';
  const reporter = new HealthReporter();

  await expect(reporter.report()).resolves.toEqual({
    status: 'pass',
    serviceId: 'TestService',
    releaseId: 'abc123',
    checks: {},
  });
});

it('returns a bare report with provided app info', async () => {
  process.env.APP_ID = 'TestService';
  process.env.BUILD_SHA = 'abc123';
  const reporter = new HealthReporter({
    serviceId: 'OverrideTestService',
    releaseId: 'override-abc123',
  });

  await expect(reporter.report()).resolves.toEqual({
    status: 'pass',
    serviceId: 'OverrideTestService',
    releaseId: 'override-abc123',
    checks: {},
  });
});

it('returns a report for a single passing check', async () => {
  const reporter = new HealthReporter().add(
    new ComponentChecker({
      componentName: 'TestComponent',
      measurementName: 'TestMeasurement',
      observedUnit: 'string',
      check: () => Promise.resolve('TestObservedValue'),
    }),
  );

  await expect(reporter.report()).resolves.toEqual({
    status: 'pass',
    checks: {
      'TestComponent:TestMeasurement': [
        {
          status: 'pass',
          observedValue: 'TestObservedValue',
          observedUnit: 'string',
        },
      ],
    },
  });
});

it('returns a report for a single failed check', async () => {
  const reporter = new HealthReporter().add(
    new ComponentChecker({
      componentName: 'TestComponent',
      measurementName: 'TestMeasurement',
      observedUnit: 'ms',
      check: () => Promise.reject(new Error('TestError')),
    }),
  );

  await expect(reporter.report()).resolves.toEqual({
    status: 'fail',
    checks: {
      'TestComponent:TestMeasurement': [
        {
          status: 'fail',
          output: 'TestError',
          observedUnit: 'ms',
        },
      ],
    },
  });
});
