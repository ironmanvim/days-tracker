import { LocalNotifications, Channel } from "@capacitor/local-notifications";
import { useEffect } from "react";

export const useNotificationChannel = (channel: Channel) => {
    useEffect(() => {
        LocalNotifications.createChannel(channel);

        // return () => {
        //     LocalNotifications.deleteChannel(channel);
        // };
    }, []);
};
