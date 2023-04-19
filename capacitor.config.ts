/// <reference types="@capacitor/local-notifications" />

import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.ironmanvim.days_tracker",
    appName: "days-tracker",
    webDir: "dist",
    bundledWebRuntime: false,
    // server: {
    //   url: "http://192.168.1.13:3000",
    //   cleartext: true,
    // },
    plugins: {
        LocalNotifications: {
            smallIcon: "notification_icon",
            iconColor: "#488AFF",
            sound: "beep_beep.wav",
        },
    },
};

export default config;
