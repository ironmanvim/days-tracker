import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            include: "**/*.(png|jpg|svg)"
        }),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
            },
            includeAssets: [
                "/src/favicon.svg",
                "/src/apple-touch-icon.png",
                "/src/masked-icon.svg",
            ],
            manifest: {
                name: "Days Tracker",
                short_name: "Days Tracker",
                description: "Track your days efficiently",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "/assets/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/assets/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            strategies: "generateSW",
        }),
    ],
});
