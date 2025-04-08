import { context } from "./types.ts";
import { colourNs, selectColour } from "./colours.ts";
import { env, noColor } from "./env.ts";
import { Namespaces } from "./namespacing.ts";

const DEBUG: string = env("DEBUG");
const stderr = context.process?.stderr;
const useColour = stderr?.isTTY && !noColor;
const { debug } = context.console.Console?.(stderr) ?? context.console;
const useAnsi = ["Node.js", "Bun"].includes(
	context.navigator.userAgent.split("/", 1)[0],
);

/**
 * The underlying namespace manager.
 */
export const namespaces: Namespaces = new Namespaces(DEBUG);

/**
 * A debug logger instance.
 */
export interface DebugFn {
	(...data: unknown[]): void;
	/**
	 * Manually enable or disable logging for this namespace.
	 */
	enabled: boolean;
	/**
	 * The underlying logger function. By default, this writes to `stderr`.
	 * To customise, assign a different logger function.
	 *
	 * @example
	 * ```ts
	 * const log = w("app");
	 * log.logger = console.log.bind(console);
	 * ```
	 */
	logger: (...args: unknown[]) => void;
}

const ns = (n: string) => (n ? n + " " : "");

/**
 * Create a debug instance for a namespace.
 *
 * @example
 * ```ts
 * import { w } from "w";
 * const log = w("app");
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
export function w(namespace: string = ""): DebugFn {
	const debugfn = (...data: unknown[]) => {
		const start = data.length ? data.shift() : "";
		if (!debugfn.enabled) return;
		if (!useAnsi) {
			debugfn.logger(
				`%c${ns(namespace)}%c${start}`,
				`color: #${selectColour(namespace).toString(16)}`,
				"color: inherit",
				...data,
			);
		} else {
			const name = useColour ? colourNs(namespace) : namespace;
			debugfn.logger(ns(name) + start, ...data);
		}
	};

	debugfn.enabled = namespaces.check(namespace);
	debugfn.logger = debug;

	return debugfn;
}
