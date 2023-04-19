import { Preferences } from "@capacitor/preferences";
import { StateStorage } from "zustand/middleware";

export const localStorage: StateStorage = {
    getItem: async (key) => {
        const { value } = await Preferences.get({ key });
        return value;
    },
    setItem: async (key, value) => {
        await Preferences.set({ key, value });
    },
    removeItem: async (key) => {
        await Preferences.remove({ key });
    },
};
