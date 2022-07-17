import { differenceInCalendarDays, format, getDay } from "date-fns";
import { Button, Progress } from "flowbite-react";
import _ from "lodash";
import { useState } from "react";
import { HiCheck, HiTrash } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import TrackerUnit from "../components/TrackerUnit";
import { WarningModal } from "../components/WarningModal";
import { useStore } from "../store/useStore";

interface TrackerProps {}

const Tracker: React.FC<TrackerProps> = () => {
    const { id } = useParams<"id">();
    const navigate = useNavigate();

    const tracker = useStore((state) =>
        state.trackers.find((tracker) => tracker.id === Number(id))
    );

    const markTrack = useStore((state) => state.markTrack);
    const resetTrack = useStore((state) => state.resetTrack);
    const removeTracker = useStore((state) => state.removeTracker);

    if (!tracker) {
        return <div>Not Found</div>;
    }

    const currentDate = new Date();
    const dateStarted = new Date(tracker.dateStarted);

    const diff = differenceInCalendarDays(currentDate, dateStarted);

    const [deleteModal, setDeleteModal] = useState(false);
    const onDelete = () => {
        removeTracker(Number(id));
        setDeleteModal(false);
        navigate("/");
    };

    const [resetModal, setResetModal] = useState(false);
    const onReset = () => {
        resetTrack(Number(id));
        setResetModal(false);
        setFailedModal(false);
    };

    const [failedModal, setFailedModal] = useState(() =>
        tracker.failureAlert && diff - 1 >= 0 ? !tracker.track[diff - 1] : false
    );

    return (
        <div>
            <WarningModal
                description={
                    "You failed to follow the track.\nClick 'Yes I'm Sure' to reset the track.\nThis will reset your track to current date.\nIf you want to change it to another date use 'Edit Tracker' instead."
                }
                isOpen={failedModal}
                onSure={onReset}
                onClose={() => {
                    setFailedModal(false);
                }}
            />
            <WarningModal
                description="Are you sure you want to delete this track?"
                isOpen={deleteModal}
                onClose={() => {
                    setDeleteModal(false);
                }}
                onSure={onDelete}
            />
            <WarningModal
                description="Are you sure to reset the track?"
                isOpen={resetModal}
                onClose={() => {
                    setResetModal(false);
                }}
                onSure={onReset}
            />
            <div className="flex flex-col md:flex-row border-b p-2 px-4 md:items-center">
                <div className="text-2xl font-bold flex-1">
                    {tracker.name} (
                    {diff >= 0 &&
                        diff <= tracker.numberOfDays &&
                        `${tracker.numberOfDays - diff} days to finish`}
                    {diff < 0 && `${-diff} days to start`}
                    {diff > tracker.numberOfDays &&
                        `${tracker.numberOfDays} days finished`}
                    )
                </div>
                <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
                    <Button
                        pill
                        onClick={() => {
                            navigate(`/${id}/edit`);
                        }}
                    >
                        Edit Tracker
                    </Button>
                    <Button
                        pill
                        color={!tracker.track[diff] ? "success" : "failure"}
                        onClick={() => {
                            markTrack(Number(id), diff, !tracker.track[diff]);
                        }}
                    >
                        {!tracker.track[diff] ? "Mark" : "Unmark"} Today
                    </Button>
                    <Button
                        pill
                        color="failure"
                        onClick={() => {
                            setResetModal(true);
                        }}
                    >
                        Reset Track
                    </Button>
                    <Button
                        pill
                        color="failure"
                        onClick={() => {
                            setDeleteModal(true);
                        }}
                    >
                        <HiTrash className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="flex justify-center mt-4 text-gray-600">
                {format(dateStarted, "dd-MM-yyyy")}
            </div>
            <div className="mt-6 flex justify-center">
                <div className="grid grid-cols-7 gap-2 place-content-center">
                    <div className="col-span-7 mb-2">
                        {diff >= 0 && diff <= tracker.numberOfDays && (
                            <Progress
                                progress={Number(
                                    (
                                        (diff * 100) /
                                        tracker.numberOfDays
                                    ).toFixed(2)
                                )}
                                label={tracker.name}
                                labelPosition="outside"
                                labelProgress={true}
                            />
                        )}
                        {diff < 0 && (
                            <div className="flex py-2">
                                <div className="flex-1">{tracker.name}</div>
                                <div className="text-red-500">Not Started</div>
                            </div>
                        )}
                        {diff > tracker.numberOfDays && (
                            <div className="flex py-2">
                                <div className="flex-1">{tracker.name}</div>
                                <div className="flex items-center text-green-500">
                                    <HiCheck className="mr-1 h-5 w-5" />
                                    Finished
                                </div>
                            </div>
                        )}
                    </div>
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => {
                        return (
                            <div className="flex justify-center items-center text-xs">
                                {day}
                            </div>
                        )
                    })}
                    {_.range(0, getDay(tracker.dateStarted)).map(() => {
                        return <div />;
                    })}
                    {_.range(0, tracker.numberOfDays).map((index) => {
                        return (
                            <TrackerUnit
                                key={index}
                                id={Number(id)}
                                index={index}
                                selected={
                                    tracker.track[index]
                                        ? "completed"
                                        : diff > index
                                        ? "not-completed"
                                        : "not-started"
                                }
                                dateStarted={tracker.dateStarted}
                                strict={tracker.strict}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="mt-6 flex justify-center"></div>
        </div>
    );
};

export default Tracker;
