import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { shared } from "../shared.mjs";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "host",
			remotes: {
				remote: {
					type: "module",
					name: "remote",
					entry: "http://localhost:4174/remoteEntry.js",
				},
			},
			shared,
			dts: false,
		}),
	],
	build: { target: "esnext" },
});
