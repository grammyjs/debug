import { context } from "./types.ts";
import { colourNs, selectColour } from "./colours.ts";
import { getEnv } from "./env.ts";
import { Namespaces } from "./namespacing.ts";

const DEBUG: string = getEnv("DEBUG");
const stderr = context.process?.stderr;
const useColour = stderr?.isTTY && !getEnv("NO_COLOR");
const debug = context.console.Console?.(stderr)?.debug || context.console.debug;

/**
 * The underlying namespace manager.
 */
export const namespaces: Namespaces = new Namespaces(DEBUG);

/**
 * A debug logger instance.
 */
export interface DebugFn {
	(...args: unknown[]): void;
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
	const debugfn = (...args: unknown[]) => {
		if (debugfn.enabled) {
			const [p0, ...rest] = args;
			if (context.document) {
				debugfn.logger(
					`%c${namespace}%c ${p0}`,
					`color: #${selectColour(namespace).toString(16)}`,
					"color: inherit",
					...rest,
				);
			} else {
				let ns = useColour ? colourNs(namespace) : namespace;
				debugfn.logger(`${ns} ${p0}`, ...rest);
			}
		}
	};

	debugfn.enabled = namespaces.check(namespace);
	debugfn.logger = debug;

	return debugfn;
}
