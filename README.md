<div align="center">
<img src="./w.png" alt="logo" width="100" />
</div>

<div align="center">
<h1><code>w</code>riter</h1>
</div>

Extremely tiny debug logging utility for all JavaScript runtimes.

Inspired by [`debug`](https://npmjs.com/package/debug), but very small and portable.

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

All debug logs are disabled by default, and can be enabled by setting the `DEBUG` environment variable.

```sh
DEBUG=app:main node index.js
```

To enable all logs at any level, use `*`. Naturally `DEBUG=*` will enable all logs at all levels.

```sh
DEBUG=app:* node index.js
```

Multiple namespaces can be specified by separating them with commas:

```sh
DEBUG=app:main,app:auth node index.js
```

An individual logger instance can also be enabled by setting `log.enabled = true` (or disabled by setting `false`).

### Supported:

-   Node.js
-   Bun
-   Deno
-   Cloudflare Workers
-   Bun
-   Browsers
