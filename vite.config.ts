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
					// Separate node_modules code into a vendor chunk
					if (id.includes("node_modules")) {
						return "vendor";
					}
					// You can add more specific chunks here if needed
				},
			},
		},
		// Additional build optimizations
		target: "esnext",
		minify: "esbuild",
		sourcemap: false,
		// Improve chunk loading strategy
		chunkSizeWarningLimit: 1000,
		cssCodeSplit: true,
	},
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
});
