import { context } from "./types.ts";
import { colourNs } from "./colours.ts";

const getDenoEnv = (variable: string) => {
	const Deno = context.Deno;
	const state = Deno!.permissions.querySync?.({ name: "env", variable })?.state;
	if (state === "prompt") return "";
	return Deno!.env.get(variable) ?? "";
};

const deno = "Deno" in globalThis;

const getEnv = (variable: string) => {
	if (deno) return getDenoEnv(variable);
	return context.process?.env[variable] || context.env?.[variable] || "";
};

const DEBUG = getEnv("DEBUG");
const stderr = context.process?.stderr;
const useColour = stderr?.isTTY && !getEnv("NO_COLOR");
const debug = context.console.Console?.(stderr)?.debug || context.console.debug;
const log = (namespace: string, message: string) => {
	const color = useColour ? colourNs(namespace) : namespace;
	debug(`${color} ${message}`);
};

export namespace DebugUtil {
	type Namespace = { allowed: boolean; children: { [key: string]: Namespace } };

	export const parseSpec = (debugspec: string) => {
		const enabled: Namespace = { allowed: false, children: {} };
		const debugs = debugspec.split(/[\s,]+/).map(each => each.trim());
		for (const item of debugs) {
			const negative = item.startsWith("-");
			const chain = item.slice(negative ? 1 : 0).split(":");
			let current = enabled;
			for (const part of chain) {
				if (part === "*") break;
				const picked = current.children[part] ?? {
					allowed: false,
					children: {},
				};
				current.children[part] = picked;
				current = picked;
			}
			current.allowed = !negative;
		}
		return enabled;
	};

	export const isEnabled = (enabled: Namespace, namespace: string) => {
		const chain = namespace.split(":").map(part => part.trim());
		let current = enabled;
		for (const part of chain) {
			let picked = current.children[part];
			if (!picked) return false;
			// if namespace is enabled, all children are enabled, no need to check further
			if (picked.allowed) return true;
			current = picked;
		}
		return current.allowed;
	};
}

export const enabled = DebugUtil.parseSpec(DEBUG);

export interface DebugFn {
	(...args: unknown[]): void;
	enabled: boolean;
}

export const createDebug = (namespace: string = ""): DebugFn => {
	const debug = (...args: unknown[]) => {
		if (debug.enabled) log(namespace, args.join(" "));
	};

	debug.enabled = DebugUtil.isEnabled(enabled, namespace);

	return debug;
};
