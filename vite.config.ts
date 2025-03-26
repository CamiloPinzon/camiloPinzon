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
			threshold: 1024,
			deleteOriginFile: false,
		}),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
		target: "esnext",
		minify: "esbuild",
		sourcemap: false,
		chunkSizeWarningLimit: 1000,
		cssCodeSplit: true,
	},
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
});
