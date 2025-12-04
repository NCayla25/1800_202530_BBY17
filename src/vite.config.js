import { defineConfig } from "vite";
import { resolve } from "path";
import _default from "@popperjs/core/lib/modifiers/popperOffsets";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "login.html"),
                map: resolve(__dirname, "map.html"),
                profile: resolve(__dirname, "profile.html"),
                settings: resolve(__dirname, "settings.html")
            }
        }
    }
});