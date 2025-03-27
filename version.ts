export {};

const tag = process.env.GITHUB_REF;
const version = tag ? tag.slice(11) : process.env.VERSION;

if (!version)
	throw new Error("VERSION environment variable not found. Use similar to `VERSION=0.1.0 bun run version.ts`");

const pkg = JSON.parse(await Bun.file("./package.json").text());
pkg.version = version;

await Bun.write("./package.json", JSON.stringify(pkg, null, "\t") + "\n");

const jsr = JSON.parse(await Bun.file("./jsr.json").text());
jsr.version = version;

await Bun.write("./jsr.json", JSON.stringify(jsr, null, "\t") + "\n");
