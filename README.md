# Up

This project provides packages for Frontend and Backend JavaScript services to get started quickly without needing to reimplement boilerplate.

## Contributing

### Requirements

1. Install the LTS version of Node and npm: https://nodejs.org/en/download/
2. Install monorepo and package dependencies with `npm install`

### Making Changes

1. Make changes in the appropriate package(s)
2. Validate changes with `npm run ci`
3. Run `npm run docs` if API documentation has been updated for a package
4. Run `npm run changeset` for each change and package that was modified
5. Create a merge request, get approval, and get it merged
6. When ready to release, bump package versions with `npm run changeset:apply`
7. Review changes in `CHANGELOG.md` files and add the date next to the version number. For example, `1.3.2 (2021-05-21)`.
8. Commit changes with the message `Release: <package1 name>@<new version> <package2 name>@<new version> ...`
    - **Tip:** you can use [`.ci/release-commit.sh`](.ci/release-commit.sh) to copy the commit message format to your clipboard!
9. Create a merge request and use the `Release` template
10. Once merged, the main CI pipeline will publish packages
    - To publish manually, you can run `.ci/build.sh && .ci/publish.sh`

#### Creating a new package

1. Copy a package in the [./packages](./packages) directory.
2. Update the `package.json` with the package name and files to be included. Add any dependencies the package requires.
3. Update the `README.md` for the package.
4. Implement your new package and follow the steps under [Making changes](#making-changes) above! 🚀

### Sharing local packages

Local packages should be shared in the following ways:

1. As a version range for **production dependencies**. E.g. `^1.3.5` (minor) or `~1.3.5` (patch).
    - This allows for predictable versions while also reducing duplication of installed versions of transitive dependencies.
2. As a local package reference for **development dependencies**. E.g. `*`.
    - This ensures that the entire monorepo remains in a working state regardless of changes for build dependencies.

#### Test in a separate project

During development and before publishing, you can test the consumption of a package in a different project.

1. Run `npm run dev` from within the desired package (that supports the command) to bundle code on every change.
    - Can optionally run `npm run build` to get one-time-built assets.
2. Run `npm link` at the root of the package(s) you want to test. Or `npm link -w <package-name>`.
3. Run `npm link <package name> [<package name>...]` in the project you want to consume the package in.
    - Multiple packages may be linked at the same time. For example: `npm link @wesp-up/eslint-config @wesp-up/tsconfig`
4. Make updates and use them in the consuming project.

#### Publish beta versions

Another option for sharing the changes to a broader audience to test the changes is to publish beta versions.

1. Temporarily bump the version of a package to a beta version, such as `2.0.0-beta.0`. Do not commit this change.
2. Publish the package with the `beta` tag with
    ```shell
    npm publish --tag beta -w @wesp-up/eslint-config
    ```

#### Documentation

Each package that exports TypeScript values should use [TSDoc](https://tsdoc.org/) comments. We then use [TypeDoc](https://typedoc.org/) to generate markdown documentation for each package. The generated files should be committed to the codebase and updated whenever there is a change to the public API. For new packages, the following script should be added:

```json
{
  "scripts": {
    "docs": "cp ../../typedoc.json ./ && typedoc && rimraf typedoc.json"
  }
}
```

This copies the global [typedoc.json](./typedoc.json), generates markdown documentation, then removes the local package config file.

### Scripts

The root `package.json` comes with some helpful scripts that we will describe in detail. Execute a script with `npm run <script name>`.

- `changeset`: Add a changeset for the changes being made in the current commit.
- `changeset:apply`: Update package versions based on existing changesets and move changeset logs to the respective `CHANGELOG.md` files for each package.
- `ci`: Execute all tasks necessary for validating changes in continuous integration. It is useful to run this locally before committing changes.
- `clean`: Clean the current state of the repo and start fresh. This can be useful at times for a fresh installation of dependencies and to remove Turborepo caches.
- `lint`: Run the `lint` script in each package.
- `lint:fix`: Run the `lint:fix` script in each package.
- `release`: Publish any packages that have not been published with their current version.

## Tooling

### Monorepo - [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)

We use npm workspaces to manage dependencies. A single `package-lock.json` file is located at the root of the project. Development dependencies that are used for the projects should be at the root, while package-specific dependencies (including development dependencies) should be isolated to the consuming package.

### Monorepo - [Turborepo](https://turborepo.org/)

We use Turborepo to run tasks in parallel with caching. Pipelines are defined in [turbo.json](./turbo.json) and correspond to `scripts` in each package's `package.json` file.

### Changelog management - [changesets](https://github.com/changesets/changesets)

We use `changesets` to manage package versions, changelogs, and publishing. Versioning adheres to [semver](https://semver.org/). A changeset is created using the `npm run changeset` command.

- Not every change in the repo requires a changeset, except for when the change is meant to cause a semantic version change in a package.
- Provide as much detail about a change as you can that is appropriate for consumers and maintainers alike. You can edit the changeset files under [.changeset](.changeset) to provide additional details about your changes.
- Following practices from [keep a changelog](https://keepachangelog.com/en/1.0.0/), use one of the following prefixes in each changeset to describe the nature of the change. For example: `Added: Peanut butter bomb feature x.`.
    - `Added` for new features.
    - `Changed` for changes in existing functionality.
    - `Deprecated` for soon-to-be removed features.
    - `Removed` for now removed features.
    - `Fixed` for any bug fixes.
    - `Security` for vulnerability patches.

### Registry

You can find our packages under [npm-local/@wesp-up](https://www.npmjs.com/search?q=%40wesp-up).

### Documentation - [TypeDoc](https://typedoc.org/)

Each package that exports TypeScript values should use [TSDoc](https://tsdoc.org/) comments. We then use [TypeDoc](https://typedoc.org/) to generate markdown documentation for each package. The generated files should be committed to the codebase and updated whenever there is a change to the public API.

For new packages, follow the [example package](packages/example-package) as a guide for setting up `typedoc`. Things to include:

- Any relevant `typedoc` dependencies.
- A `docs` script to generate documentation.
- A `typedoc.json` file that extends the [base config](packages/typedoc-config/typedoc.json) when for consistent documentation style across packages.
