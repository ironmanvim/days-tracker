import { Button } from "flowbite-react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import TrackerCard from "./components/TrackerCard";
import { useStore } from "./store/useStore";

function App() {
    const navigate = useNavigate();
    const trackers = useStore((state) => state.trackers);

    return (
        <div className="">
            <div className="flex border-b p-2 px-4 items-center">
                <div className="text-2xl font-bold flex-1">Days Tracker</div>
                <div>
                    <Button
                        pill
                        onClick={() => {
                            navigate("/add");
                        }}
                    >
                        <HiPlus className="h-6 w-6 pr-1" />
                        Create Tracker
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 p-2">
                {trackers.map((tracker) => {
                    return (
                        <TrackerCard
                            key={tracker.id}
                            id={tracker.id}
                            name={tracker.name}
                            dateStarted={tracker.dateStarted}
                            numberOfDays={tracker.numberOfDays}
                            failureAlert={tracker.failureAlert}
                            track={tracker.track}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default App;
