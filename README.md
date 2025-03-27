<div align="center">
<img src="w.png" alt="logo" width="100" />
</div>

<div align="center">
<h1><code>w</code>iretap</h1>
</div>

Extremely tiny debug logging utility for all JavaScript runtimes.

Inspired by [`debug`](https://npmjs.com/package/debug), but very small and portable.

## Installation

```sh
# npm
npm install w

# yarn
yarn add w

# pnpm
pnpm add w

# bun
bun add w
```

## Quick Start

```ts
import { w } from "w";
```

```ts
const log = w("app:main");
log("Creating new user", { email: req.body.email });
```

```ts
const log = w("app:auth");
log("User authentication failed", { email: req.body.email });
```

If you're a library author, we recommend using your library's name as part of your namespace.

## Usage

All debug logs are disabled by default, and can be enabled by setting the `DEBUG` environment variable.

```sh
> DEBUG=app:main node index.js
app:main Creating new user { email: 'a@test.com' }
```

To enable all logs at any level, use `*`. Naturally `DEBUG=*` will enable all logs at all levels.

```sh
> DEBUG=app:* node index.js
app:main Creating new user { email: 'a@test.com' }
app:auth User authentication failed { email: 'b@test.com' }
```

Multiple namespaces can be specified by separating them with commas:

```sh
> DEBUG=app:main,app:auth node index.js
app:main Creating new user { email: 'a@test.com' }
app:auth User authentication failed { email: 'b@test.com' }
```

To disable a specific level, prefix the spec with a `-`:

```sh
# all "app" enabled except "app:auth"
> DEBUG=app:*,-app:auth node index.js
app:main Creating new user { email: 'a@test.com' }
```

> 🔔 The most specific rule always wins.
>
> Example: `app:*,-app:auth,app:auth:warning`
>
> Explanation:
>
> -   all namespaces under app are enabled
> -   but app:auth is disabled
> -   but app:auth:warning is enabled
>
> ```sh
> # notice that we didn't get app:auth, but we did get app:auth:warning
> > DEBUG=app:*,-app:auth,app:auth:warning node index.js
> app:main Creating new user { email: 'a@test.com' }
> app:auth:warning User authentication failed { email: 'b@test.com' }
> ```

### Programmatic Control

An individual logger instance can also be enabled or disabled programmatically:

```ts
const log = w("app:feature");

// Enable this logger regardless of DEBUG environment
log.enabled = true;

// Disable this logger regardless of DEBUG environment
log.enabled = false;
```

By default, `w`iretap will log to stderr. You can customise the logger function used:

```ts
const log = w("app:custom");
// Replace the default logger with your own
log.logger = (...args) => console.log("[CUSTOM]", ...args);
```

## Supported Environments:

-   Node.js
-   Bun
-   Deno
-   Cloudflare Workers
-   Browsers
