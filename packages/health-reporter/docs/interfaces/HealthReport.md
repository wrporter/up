[**@wesp-up/health-reporter**](../README.md) • **Docs**

***

# Interface: HealthReport

## Extends

- [`HealthReporterConfig`](HealthReporterConfig.md)

## Properties

### status

> **status**: `string`

Overall health status. If the status of a check fails, so does the
overall status.

***

### checks

> **checks**: `object`

Checks to perform against Component dependencies to assess overall
service health.

#### Index Signature

 \[`key`: `string`\]: [`ComponentCheckReport`](ComponentCheckReport.md)[]

***

### serviceId?

> `optional` **serviceId**: `string`

Service identifier. Defaults to using `process.env.APP_ID` when not
specified.

#### Inherited from

[`HealthReporterConfig`](HealthReporterConfig.md).[`serviceId`](HealthReporterConfig.md#serviceid)

***

### releaseId?

> `optional` **releaseId**: `string`

Currently running version of the service. Should typically match the Git
commit SHA for the build of this service. Defaults to using
`process.env.BUILD_SHA` when not specified.

#### Inherited from

[`HealthReporterConfig`](HealthReporterConfig.md).[`releaseId`](HealthReporterConfig.md#releaseid)
