import type { STATUS } from './status.js';

export interface ComponentCheckReport extends Pick<HealthReport, 'status'> {
  /** Value returned from the check. */

  observedValue: string | number | unknown;
  /** Unit of the `observedValue`. */
  observedUnit: string;
  /**
   * Failure output when the `status` is `"fail"`. Is usually the result of
   * an error message.
   */

  output?: string | unknown;
}

export interface HealthReporterConfig {
  /**
   * Service identifier. Defaults to using `process.env.APP_ID` when not
   * specified.
   */
  serviceId?: string;
  /**
   * Currently running version of the service. Should typically match the Git
   * commit SHA for the build of this service. Defaults to using
   * `process.env.BUILD_SHA` when not specified.
   */
  releaseId?: string;
}

export interface HealthReport extends HealthReporterConfig {
  /**
   * Overall health status. If the status of a check fails, so does the
   * overall status.
   */
  status: (typeof STATUS)[keyof typeof STATUS];
  /**
   * Checks to perform against Component dependencies to assess overall
   * service health.
   */
  checks: { [key: string]: ComponentCheckReport[] };
}
