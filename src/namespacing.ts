export type Namespace = {
	allowed: boolean;
	children: { [key: string]: Namespace };
};

export class Namespaces {
	parsed: Namespace = { allowed: false, children: {} };

	constructor(debugspec: string) {
		this.update(debugspec);
	}

	update(debugspec: string): void {
		const parsed = this.parsed;
		const debugs = debugspec.split(/[\s,]+/);
		for (const item of debugs) {
			const negative = item.startsWith("-");
			const chain = item.slice(negative ? 1 : 0).split(":");
			let current = parsed;
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
		this.parsed = parsed;
	}

	check(namespace: string): boolean {
		if (namespace === "") return this.parsed.allowed;
		const chain = namespace.split(":");
		let current = this.parsed;
		let tentative = current.allowed;
		for (const part of chain) {
			const picked = current.children[part];
			if (!picked) return tentative ?? false;
			// tentatively allow unless explicitly disabled by a descendant
			tentative = picked.allowed;
			current = picked;
		}
		return current.allowed;
	}
}
