import produce, { Immutable, enableMapSet } from "immer";
import { State, StateCreator } from "zustand";

enableMapSet();

export const immer = <T extends State>(
    config: StateCreator<T, (fn: (state: T) => void) => void>
): StateCreator<T> => (set, get, api) =>
    config((fn) => set(produce(fn) as (state: Immutable<T>) => T), get, api);
