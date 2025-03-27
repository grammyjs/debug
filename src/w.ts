import { context } from "./types.ts";
import { colourNs } from "./colours.ts";
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
			const ns = useColour ? colourNs(namespace) : namespace;
			const [p0, ...rest] = args;
			debugfn.logger(`${ns} ${p0}`, ...rest);
		}
	};

	debugfn.enabled = namespaces.check(namespace);
	debugfn.logger = debug;

	return debugfn;
};
