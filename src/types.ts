// type-safe way to access global values that may not be available in all runtimes

export const context = globalThis as unknown as {
	// browsers
	document?: unknown;
	// Node, Deno, Bun
	process?: {
		env: { [key: string]: string };
		stderr: { isTTY: boolean };
	};
	// Web, Deno Workers, Cloudflare Workers
	env?: { [key: string]: string };
	Deno?: {
		permissions: {
			querySync: (options: { name: string; variable: string }) => {
				state: string;
			};
		};
	};
	console: {
		// everywhere
		debug: (...args: unknown[]) => void;
		// Node, Deno, Bun
		Console?: (stderr: unknown) => { debug: (...args: unknown[]) => void };
	};
};
