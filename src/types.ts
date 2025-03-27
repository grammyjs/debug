// type-safe way to access global values that may not be available in all runtimes

export const context = globalThis as unknown as {
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
		env: { get: (variable: string) => string };
	};
	console: {
		// everywhere
		debug: (...args: any[]) => void;
		// Node, Deno, Bun
		Console?: (stderr: any) => { debug: (...args: any[]) => void };
	};
};
