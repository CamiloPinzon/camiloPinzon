import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
			},
		}),
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
			treeshake: {
				moduleSideEffects: true,
				preset: "recommended",
			},
			output: {
				manualChunks: {
					"react-core": ["react"],
					"react-dom": ["react-dom"],
					"ui-components": ["lucide-react"],
					analytics: ["@analytics/google-tag-manager"],
				},
				chunkFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash][extname]",
			},
		},
		target: "esnext",
		minify: "esbuild",
		sourcemap: process.env.NODE_ENV === "development",
		chunkSizeWarningLimit: 1000,
		cssCodeSplit: true,
		assetsInlineLimit: 4096,
		reportCompressedSize: false,
	},
	optimizeDeps: {
		exclude: ["lucide-react"],
		include: ["react", "react-dom"],
		esbuildOptions: {
			target: "esnext",
			supported: {
				"top-level-await": true,
			},
		},
	},
	server: {
		hmr: {
			overlay: true,
		},
	},
	preview: {
		port: 4173,
	},
});
