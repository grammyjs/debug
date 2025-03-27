import { context } from "./types.ts";
import { colourNs, selectColour } from "./colours.ts";
import { getEnv } from "./env.ts";
import { Namespaces } from "./namespacing.ts";
const DEBUG = getEnv("DEBUG");
const stderr = context.process?.stderr;
const useColour = stderr?.isTTY && !getEnv("NO_COLOR");
const debug = context.console.Console?.(stderr)?.debug || context.console.debug;

export const namespaces = new Namespaces(DEBUG);

export interface DebugFn {
	(...args: unknown[]): void;
	enabled: boolean;
	logger: (...args: unknown[]) => void;
}

export const w = (namespace: string = ""): DebugFn => {
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
};
