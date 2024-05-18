import process from "node:process";
import { isatty } from "node:tty";
import { colorNamespace } from "./colors.ts";

const noColor = !isatty(2) && (globalThis.Deno?.noColor ?? env("NO_COLOR"));

export function env(variable: string) {
  const perm = globalThis.Deno?.permissions.querySync?.({
    name: "env",
    variable,
  });
  if (perm == null || perm.state === "granted") {
    return process.env[variable] ?? "";
  }
  return "";
}

export function log(namespace: string, message: string) {
  if (!noColor) namespace = colorNamespace(namespace);
  process.stderr.write(`${namespace} ${message}\n`);
}
