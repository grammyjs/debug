import { format } from "node:util";
import { DEBUG, log } from "./io.ts";

const enabled = DEBUG.split(/[\s,]+/);

export interface DebugFn {
  (...args: unknown[]): void;
  enabled: boolean;
}

export const createDebug = (namespace: string): DebugFn => {
  const debug = (...args: unknown[]) => {
    if (debug.enabled) log(namespace, format(...args));
  };

  debug.enabled = enabled.some((s) =>
    s.endsWith("*") ? namespace.startsWith(s.slice(0, -1)) : namespace === s
  );

  return debug;
};
