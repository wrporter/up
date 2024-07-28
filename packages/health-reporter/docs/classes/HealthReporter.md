[**@wesp-up/health-reporter**](../README.md) • **Docs**

---

# Class: HealthReporter

Health reporter that follows [this health
RFC](https://inadarei.github.io/rfc-healthcheck/). Intended to be used as a
deep health check of a service to gather a fast report of the health of
downstream dependencies. Most useful during an outage or degraded service.
Recommended to also be used with API tests and OmniCanary/AoM.

The health reporter is **not** intended to be used as a diagnostic tool, as
shown in the RFC for metrics such as database connections, CPU and memory
usage. Prefer to use standard tooling such as Grafana for those
purposes. Because this health reporter is intended to be used as a publicly
accessible deep health check route, you should be careful about what
information you expose.

## Constructors

### new HealthReporter()

> **new HealthReporter**(`config`?): [`HealthReporter`](HealthReporter.md)

#### Parameters

• **config?**: [`HealthReporterConfig`](../interfaces/HealthReporterConfig.md)

#### Returns

[`HealthReporter`](HealthReporter.md)

## Methods

### add()

> **add**(`checker`): [`HealthReporter`](HealthReporter.md)

#### Parameters

• **checker**: [`ComponentChecker`](ComponentChecker.md)

#### Returns

[`HealthReporter`](HealthReporter.md)

---

### report()

> **report**(): `Promise`\<[`HealthReport`](../interfaces/HealthReport.md)\>

#### Returns

`Promise`\<[`HealthReport`](../interfaces/HealthReport.md)\>
