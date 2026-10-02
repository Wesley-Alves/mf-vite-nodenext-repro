import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { shared } from "../shared.mjs";

export default defineConfig({
	base: "http://localhost:4174/",
	plugins: [
		react(),
		federation({
			name: "remote",
			filename: "remoteEntry.js",
			exposes: { "./Widget": "./src/Widget.jsx" },
			shared,
			dts: false,
		}),
	],
	preview: { cors: true },
	build: { target: "esnext" },
});
