import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
	plugins: [
		react(),
		compression({
			verbose: true,
			algorithm: "gzip",
			ext: ".gz",
			threshold: 10240,
			deleteOriginFile: false,
		}),
	],
});
