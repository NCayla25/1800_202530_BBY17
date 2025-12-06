import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    assetsInclude: ["images/se12-3.jpg","images/se12-4.jpg"],
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "login.html"),
                map: resolve(__dirname, "map.html"),
                profile: resolve(__dirname, "profile.html"),
                reviews: resolve(__dirname, "room-reviews.html"),
                settings: resolve(__dirname, "settings.html")
            }
        },
        chunkSizeWarningLimit: 2000
    }
});
