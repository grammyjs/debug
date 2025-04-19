import { context } from "./types.ts";
import { colorNs, selectColor } from "./colors.ts";
import { env } from "./env.ts";
import { Namespaces } from "./namespacing.ts";

const DEBUG: string = env("DEBUG");
const stderr = context.process?.stderr;
const useColor = stderr?.isTTY && !env("NO_COLOR");
const console = context.console.Console?.(stderr) ?? context.console;
const useAnsi = ["Node.js", "Bun"].includes(
	context.navigator.userAgent.split("/", 1)[0],
);

/**
 * The underlying namespace manager.
 */
const namespaces: Namespaces = new Namespaces(DEBUG);

/**
 * A debug logger instance.
 */
export interface DebugFn {
	(...data: unknown[]): void;
	/**
	 * Manually enable or disable logging for this namespace.
	 */
	enabled: boolean;
}

const ns = (n: string) => (n ? n + " " : "");

/**
 * Create a debug instance for a namespace.
 *
 * @example
 * ```ts
 * import { createDebug } from "@grammyjs/debug";
 * const log = createDebug("app");
 * log("hello");
 * ```
 *
 * Logging for given namespace is enabled when the `DEBUG` environment variable includes the namespace.
 * Multiple namespaces can be enabled by separating them with commas.
 *
 * ```sh
 * DEBUG=app:init,app:auth,server:* bun run app.ts
 * ```
 *
 * @param namespace - The namespace to debug.
 * @returns A debug instance.
 */
export function createDebug(namespace: string): DebugFn {
	const color = selectColor(namespace);
	const debugfn = (...data: unknown[]) => {
		if (!debugfn.enabled) return;
		const start = data.length ? data.shift() : "";
		if (useAnsi) {
			const name = useColor ? colorNs(namespace, color) : namespace;
			console.debug(ns(name) + start, ...data);
		} else {
			console.debug(
				`%c${ns(namespace)}%c${start}`,
				`color: #${color.toString(16)}`,
				"color: inherit",
				...data,
			);
		}
	};

	debugfn.enabled = namespaces.check(namespace);

	return debugfn;
}
