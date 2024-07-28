[**@wesp-up/health-reporter**](../README.md) • **Docs**

---

# Interface: HealthReporterConfig

## Extended by

- [`HealthReport`](HealthReport.md)

## Properties

### serviceId?

> `optional` **serviceId**: `string`

Service identifier. Defaults to using `process.env.APP_ID` when not
specified.

---

### releaseId?

> `optional` **releaseId**: `string`

Currently running version of the service. Should typically match the Git
commit SHA for the build of this service. Defaults to using
`process.env.BUILD_SHA` when not specified.
