[**@wesp-up/express-remix**](../README.md) • **Docs**

***

# Interface: VersionMeta

Service version information.

If values are not provided, the following are taken from environment
variables. Otherwise, the values are empty strings.

- **APP_ID:** The identifier for the service. Commonly matches the Nomad job
ID.
- **BUILD_BRANCH:** The version control branch of the source code this build
was created from.
- **BUILD_SHA:** The SHA1 hash of the source code this build was created
from. For git repos, this hash is conventionally the git commit.
- **BUILD_DATE:** The date this app was built in RFC3339 format.
- **BUILD_VERSION:** _[Optional]_ A semantic version of the app.

## Properties

### id?

> `optional` **id**: `string`

The name of this service.

***

### branch?

> `optional` **branch**: `string`

The version control branch of the source code this build was created
from.

***

### sha?

> `optional` **sha**: `string`

The SHA1 hash of the source code this build was created from. For git
repos, this hash is conventionally the git commit.

***

### version?

> `optional` **version**: `string`

The semantic version of the current build.

***

### buildDate?

> `optional` **buildDate**: `string`

The date this app was built in RFC3339 format.
