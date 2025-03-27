import { context } from "./types.ts";

const getDenoEnv = (variable: string) => {
	const Deno = context.Deno;
	const state = Deno!.permissions.querySync?.({ name: "env", variable })?.state;
	if (state === "prompt") return "";
	return Deno!.env.get(variable) ?? "";
};

const deno = "Deno" in globalThis;

export const getEnv = (variable: string) => {
	if (deno) return getDenoEnv(variable);
	return context.process?.env[variable] || context.env?.[variable] || "";
};
