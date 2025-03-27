export type Namespace = { allowed: boolean; children: { [key: string]: Namespace } };

export class Namespaces {
	parsed: Namespace = { allowed: false, children: {} };

	constructor(debugspec: string) {
		this.update(debugspec);
	}

	update(debugspec: string) {
		const parsed = this.parsed;
		const debugs = debugspec.split(/[\s,]+/).map(each => each.trim());
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

	check(namespace: string) {
		const chain = namespace.split(":").map(part => part.trim());
		let current = this.parsed;
		let tentative = false;
		for (const part of chain) {
			let picked = current.children[part];
			if (!picked) return tentative ?? false;
			// tentatively allow unless explicitly disabled by a descendant
			tentative = picked.allowed;
			current = picked;
		}
		return current.allowed;
	}
}
