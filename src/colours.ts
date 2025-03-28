export type Colour = [r: number, g: number, b: number, hex: string];

const genColors = (n = 72): Colour[] => {
	const colors: Colour[] = [];
	for (let i = 0; i < n; i++) {
		const h = (i * 137.5) % 360;
		const r = Math.round(Math.sin((h * Math.PI) / 180) * 105 + 105);
		const g = Math.round(Math.sin(((h + 120) * Math.PI) / 180) * 105 + 105);
		const b = Math.round(Math.sin(((h + 240) * Math.PI) / 180) * 105 + 105);
		// store rgb values as numbers for server runtimes
		// precompute all hex strings so browser runtimes are faster
		colors.push([r, g, b, [r, g, b].map(c => c.toString(16).padStart(2, "0")).join("")]);
	}
	return colors;
};

const colors = genColors();

const hash = (str: string): number => {
	let h = 5381;
	for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
	return h >>> 0; // Convert to unsigned 32-bit integer
};

export function selectColour(ns: string): Colour {
	return colors[Math.abs(hash(ns)) % colors.length];
}

export const colourNs = (ns: string): string => {
	const [r, g, b] = selectColour(ns);
	return `\x1b[38;2;${r};${g};${b}m${ns}\x1b[1;0m`;
};
