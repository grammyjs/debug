import { colorNamespace, selectColor } from "./colors.ts";
declare const process: typeof import("node:process");

function deno() {
  const encoder = new TextEncoder();
  const env = (variable: string) =>
    Deno.permissions.querySync?.({ name: "env", variable })?.state === "prompt"
      ? ""
      : Deno.env.get(variable) ?? "";
  const useColor = !Deno.noColor && Deno.stderr?.isTerminal() !== false;
  const log = (namespace: string, message: string) => {
    if (useColor) namespace = colorNamespace(namespace);
    if (Deno.stderr) {
      Deno.stderr.writeSync(encoder.encode(`${namespace} ${message}\n`));
    } else { // Deno Deploy
      console.debug(namespace, message);
    }
  };
  const DEBUG = env("DEBUG");
  return { DEBUG, log };
}

function node() {
  const useColor = !process.env.NO_COLOR && process.stderr.isTTY;
  const log = (namespace: string, message: string) => {
    if (useColor) namespace = colorNamespace(namespace);
    process.stderr.write(`${namespace} ${message}\n`);
  };
  const { DEBUG = "" } = process.env;
  return { DEBUG, log };
}

function cfw() {
  const log = (namespace: string, message: string) => {
    const color = selectColor(namespace).toString(16);
    console.debug("%c%s", `color: #${color}`, namespace, message);
  };
  // @ts-ignore CFW
  const DEBUG: string = globalThis.env?.DEBUG ?? "";
  return { DEBUG, log };
}

// deno-fmt-ignore
export const { DEBUG, log } =
  "Deno" in globalThis ? deno()
  : "process" in globalThis ? node()
  : cfw();
