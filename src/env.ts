import { context } from "./types.ts";

const prompts = (variable: string) =>
	context.Deno?.permissions.querySync?.({ name: "env", variable })?.state === "prompt";

export const env = (variable: string): string =>
	(!prompts(variable) && (context.process?.env ?? context.env)?.[variable]) || "";

export const noColor = context.Deno?.noColor ?? Boolean(env("NO_COLOR"));
