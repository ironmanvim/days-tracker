import _ from "lodash";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "../config/immerZustandMiddleware";

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
    }[];
    addTracker: (
        name: string,
        numberOfDays: number,
        dateStarted: number,
        failureAlert: boolean,
        strict: boolean
    ) => void;
    removeTracker: (id: number) => void;
    editTracker: (
        id: number,
        name: string,
        numberOfDays: number,
        dateStarted: number,
        failureAlert: boolean,
        strict: boolean
    ) => void;
    resetTrack: (id: number) => void;
    markTrack: (id: number, index: number, mark: boolean) => void;
};

export const useStore = create<TStore>(
    persist(
        immer((set) => ({
            idTracker: 1,
            trackers: [],
            addTracker(name, numberOfDays, dateStarted, failureAlert, strict) {
                set((state) => {
                    state.trackers.push({
                        id: state.idTracker++,
                        dateStarted,
                        numberOfDays,
                        name,
                        track: Array(numberOfDays).fill(false),
                        failureAlert,
                        strict,
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
                });
            },
            editTracker(
                id,
                name,
                numberOfDays,
                dateStarted,
                failureAlert,
                strict
            ) {
                set((state) => {
                    const tracker = state.trackers.find(
                        (tracker) => tracker.id === id
                    );

                    if (tracker) {
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
