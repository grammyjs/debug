import { colorNamespace } from "./colors.ts";
declare const process: typeof import("node:process");

function deno() {
  const encoder = new TextEncoder();
  const env = (variable: string) =>
    Deno.permissions.querySync?.({ name: "env", variable })?.state === "prompt"
      ? ""
      : Deno.env.get(variable) ?? "";
  const noColor = Deno.noColor && !Deno.stderr.isTerminal();
  const log = (namespace: string, message: string) => {
    if (!noColor) namespace = colorNamespace(namespace);
    Deno.stderr.writeSync(encoder.encode(`${namespace} ${message}\n`));
  };
  const DEBUG = env("DEBUG");
  return { DEBUG, log };
}

function node() {
  const noColor = !process.stderr.isTTY && !!process.env.NO_COLOR;
  const log = (namespace: string, message: string) => {
    if (!noColor) namespace = colorNamespace(namespace);
    process.stderr.write(`${namespace} ${message}\n`);
  };
  const { DEBUG = "" } = process.env;
  return { DEBUG, log };
}

function web() {
  const log = (namespace: string, message: string) => {
    console.debug(colorNamespace(namespace), message);
  };
  const DEBUG = "*";
  return { DEBUG, log };
}

// deno-fmt-ignore
export const { DEBUG, log } =
  "Deno" in globalThis ? deno()
  : "process" in globalThis ? node()
  : web();
