import type { ComponentChecker } from './checker.js';
import type { HealthReport, HealthReporterConfig } from './health.schema.js';
import { STATUS } from './status.js';

/**
 * Health reporter that follows [this health
 * RFC](https://inadarei.github.io/rfc-healthcheck/). Intended to be used as a
 * deep health check of a service to gather a fast report of the health of
 * downstream dependencies. Most useful during an outage or degraded service.
 * Recommended to also be used with API tests and OmniCanary/AoM.
 *
 * The health reporter is **not** intended to be used as a diagnostic tool, as
 * shown in the RFC for metrics such as database connections, CPU and memory
 * usage. Prefer to use standard tooling such as Grafana for those
 * purposes. Because this health reporter is intended to be used as a publicly
 * accessible deep health check route, you should be careful about what
 * information you expose.
 */
export class HealthReporter {
  private checker: ComponentChecker[] = [];

  private readonly config: HealthReporterConfig;

  constructor(config?: HealthReporterConfig) {
    this.config = {
      serviceId: process.env.APP_ID,
      releaseId: process.env.BUILD_SHA,
      ...config,
    };
  }

  add(checker: ComponentChecker) {
    this.checker.push(checker);
    return this;
  }

  async report(): Promise<HealthReport> {
    const health: HealthReport = {
      status: STATUS.PASS,
      serviceId: this.config.serviceId,
      releaseId: this.config.releaseId,
      checks: {},
    };

    await Promise.allSettled(
      this.checker.map(async (check) => {
        const result = await check.report({
          serviceId: this.config.serviceId,
        });
        if (result.status === STATUS.FAIL) {
          health.status = STATUS.FAIL;
        }

        // Purposefully support singleton checks for now since we don't
        // use the concept of multiple nodes.
        health.checks[`${check.config.componentName}:${check.config.measurementName}`] = [result];
      }),
    );

    return health;
  }
}
