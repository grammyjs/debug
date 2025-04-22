# `@grammyjs/debug`

Tiny debug logging utility for all JavaScript runtimes, inspired by
[`debug`](https://github.com/debug-js/debug).

<img src="https://raw.githubusercontent.com/feathers-studio/wiretap/master/docs/example.png" alt="example" width="400" />

## Quick Start

```ts
import { createDebug } from "@grammyjs/debug";
```

```ts
const debug = createDebug("app:main");
debug("Creating new user", { email: req.body.email });
```

```ts
const debug = createDebug("app:auth");
debug("User authentication failed", { email: req.body.email });
```

If you're a library author, we recommend using your library's name as part of your namespace.

## Usage

All debug logs are disabled by default, and can be enabled by setting the `DEBUG` environment variable.

```sh
> DEBUG=app:main node index.js
app:main Creating new user { email: 'a@test.com' }
```

```html
<script>
  const env = {
    DEBUG: "app:main",
  };
</script>
<script>
  // Your code
</script>
```

To enable all logs at any level, use `*`. Naturally `DEBUG=*` will enable all
logs at all levels.

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
const log = createDebug("app:feature");

// Enable this logger regardless of DEBUG environment
log.enabled = true;

// Disable this logger regardless of DEBUG environment
log.enabled = false;
```

## Supported Environments:

-   Node.js
-   Bun
-   Deno
-   Cloudflare Workers
-   Browsers (by default, you _may_ need to turn on the "debug", "verbose", or similar setting in the console to see the logs in your browser to see debug logs)
