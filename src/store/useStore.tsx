import _ from "lodash";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "../config/immerZustandMiddleware";
import { LocalNotifications, Schedule } from "@capacitor/local-notifications";
import { generateId } from "../utils/generateId";
import { localStorage } from "../lib/localStorage";

type TStore = {
    idTracker: number;
    trackers: {
        id: number;
        name: string;
        numberOfDays: number;
        dateStarted: number;
        track: boolean[];
        failureAlert: boolean;
        strict: boolean;
        remindMe: boolean;
        remindMeTime: string;
        notificationId: number;
    }[];
    addTracker: (
        tracker: Omit<TStore["trackers"][0], "id" | "track" | "notificationId">
    ) => void;
    removeTracker: (id: number) => void;
    editTracker: (
        tracker: Omit<TStore["trackers"][0], "track" | "notificationId">
    ) => void;
    resetTrack: (id: number) => void;
    markTrack: (id: number, index: number, mark: boolean) => void;
};

export const useStore = create<TStore>(
    persist(
        immer((set) => ({
            idTracker: 1,
            trackers: [],
            async addTracker(tracker) {
                const notificationId = createNotification({
                    title: `${tracker.name} (${tracker.numberOfDays} days)`,
                    body: `Let's finish the Tracker. You can do it!`,
                    hasSchedule: tracker.remindMe,
                    scheduleTime: tracker.remindMeTime,
                });

                set((state) => {
                    const { numberOfDays } = tracker;

                    state.trackers.push({
                        id: state.idTracker++,
                        track: Array(numberOfDays).fill(false),
                        notificationId,
                        ...tracker,
                    });
                });
            },
            removeTracker(id) {
                set((state) => {
                    const trackerIndex = state.trackers.findIndex(
                        (tracker) => tracker.id === id
                    );
                    if (trackerIndex !== -1) {
                        state.trackers.splice(trackerIndex, 1);
                    }

                    removeNotification(
                        state.trackers[trackerIndex].notificationId
                    );
                });
            },
            async editTracker({
                id,
                name,
                numberOfDays,
                dateStarted,
                failureAlert,
                strict,
                remindMe,
                remindMeTime,
            }) {
                set((state) => {
                    const tracker = state.trackers.find(
                        (tracker) => tracker.id === id
                    );

                    if (tracker) {
                        removeNotification(tracker.notificationId);
                        
                        const notificationId = createNotification({
                            title: `${name} (${numberOfDays} days)`,
                            body: `Let's finish the Tracker. You can do it!`,
                            hasSchedule: remindMe,
                            scheduleTime: remindMeTime,
                        });

                        tracker.name = name;
                        const extraDays = numberOfDays - tracker.numberOfDays;
                        if (extraDays > 0) {
                            tracker.track.push(...Array(extraDays).fill(false));
                        }
                        if (extraDays < 0) {
                            tracker.track.splice(numberOfDays);
                        }
                        tracker.numberOfDays = numberOfDays;
                        tracker.dateStarted = dateStarted;
                        tracker.failureAlert = failureAlert;
                        tracker.strict = strict;
                        tracker.remindMe = remindMe;
                        tracker.remindMeTime = remindMeTime;
                        tracker.notificationId = notificationId;
                    }
                });
            },
            resetTrack(id) {
                set((state) => {
                    const tracker = state.trackers.find(
                        (tracker) => tracker.id === id
                    );

                    if (tracker) {
                        tracker.dateStarted = Date.now();
                        tracker.track = Array(tracker.numberOfDays).fill(false);
                    }
                });
            },
            markTrack(id, index, mark) {
                set((state) => {
                    const tracker = state.trackers.find(
                        (tracker) => tracker.id === id
                    );
                    if (tracker) {
                        tracker.track[index] = mark;
                    }
                });
            },
        })),
        {
            name: "storage",
            getStorage: () => localStorage,
        }
    )
);

const removeNotification = (id: number) => {
    return LocalNotifications.cancel({
        notifications: [{ id }],
    });
};

const createNotification = (props: {
    title: string;
    body: string;
    hasSchedule?: boolean;
    scheduleTime?: string;
    extra?: any;
}) => {
    const { title, body, extra } = props;
    let { scheduleTime, hasSchedule } = props;
    hasSchedule ??= false;
    scheduleTime ??= ":";

    const notificationId = parseInt(generateId());
    const [hour, minute] = scheduleTime.split(":");
    const schedule: Schedule | undefined =
        (hasSchedule && {
            on: {
                hour: parseInt(hour),
                minute: parseInt(minute),
            },
        }) ||
        undefined;
    LocalNotifications.schedule({
        notifications: [
            {
                id: notificationId,
                title,
                body,
                schedule,
                channelId: "reminder",
                extra,
            },
        ],
    });

    return notificationId;
};
