// Prints the canLiveRebind flag the plugin generated for every share of the remote build.
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("./packages/remote/dist/", import.meta.url);
const files = readdirSync(dir, { recursive: true }).filter((file) =>
	String(file).includes("localSharedImportMap"),
);
for (const file of files) {
	const code = readFileSync(new URL(String(file), dir), "utf8");
	for (const [, name, flag] of code.matchAll(
		/name:\s*["'`]([^"'`]+)["'`],[^}]*?canLiveRebind:\s*(!0|!1|true|false)/g,
	)) {
		console.log(`${name.padEnd(14)} canLiveRebind: ${flag === "!0" || flag === "true"}`);
	}
}
