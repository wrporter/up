# @wesp-up/express-remix

Creates an express/remix server with all logging and routes in place. Consumes `@wesp-up/express` under the covers and exports everything from its package, so you do not need to install it separately.

## Installation

```shell
npm install --save @wesp-up/express-remix
```

## Usage

```typescript
import { createRemixServer } from '@wesp-up/express-remix';

createRemixServer().start(3000); // specify port if desired, defaults to 80
```
