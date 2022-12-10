import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 8000,
	},
	define: {
		"process.env": {
			REACT_APP_SECRET: "CONCERTBOOKINGAPP",
			REACT_APP_EXPIRESIN: "10h",
			REACT_APP_BACKEND_URL: "https://task-manager-three-tau.vercel.app",
		},
	},
});
