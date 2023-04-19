import { Filesystem } from "@capacitor/filesystem";
import { LocalNotifications } from "@capacitor/local-notifications";
import { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";

export const useCapacitorInit = () => {
    const permission = useRequestPermissionLocalNotifications();
    useRequestPermissionFileStorage();
    useSetupStatusBar();
};

const useRequestPermissionLocalNotifications = () => {
    const [permission, setPermission] = useState<boolean>(false);

    useEffect(() => {
        LocalNotifications.requestPermissions().then((permissionStatus) => {
            console.log(permissionStatus.display[0]);
            setPermission(true);
        });
    });

    return permission;
};

const useRequestPermissionFileStorage = () => {
    const [permission, setPermission] = useState<boolean>(false);

    useEffect(() => {
        Filesystem.requestPermissions().then((permissionStatus) => {
            console.log(permissionStatus.publicStorage);
            setPermission(true);
        });
    });

    return permission;
};

const useSetupStatusBar = () => {
    StatusBar.setStyle({ style: Style.Light });
    StatusBar.setBackgroundColor({ color: "#ffffff" });
};
