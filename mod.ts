import { format } from "node:util";
import { env, log } from "./io.ts";

const enabled = env("DEBUG").split(/[\s,]+/);

export const createDebug = (namespace: string) => {
  const debug = (...args: unknown[]) => {
    if (debug.enabled) log(namespace, format(...args));
  };

  debug.enabled = enabled.some((s) =>
    s.endsWith("*") ? namespace.startsWith(s.slice(0, -1)) : namespace === s
  );

  return debug;
};
