import assert from "node:assert/strict";
import test from "node:test";
import { Namespaces } from "./namespacing.ts";

test("negation", () => {
	const namespaces = new Namespaces(`app:*,-app:auth,app:auth:warning`);
	assert(namespaces.check("app"));
	assert(!namespaces.check("app:auth"));
	assert(namespaces.check("app:auth:warning"));
});
