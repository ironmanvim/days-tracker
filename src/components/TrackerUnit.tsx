import { addDays, format } from "date-fns";
import { Button, Tooltip } from "flowbite-react";
import { useStore } from "../store/useStore";

interface TrackerUnitProps {
    id: number;
    index: number;
    selected: "completed" | "not-completed" | "not-started";
    dateStarted: number;
    strict: boolean;
}

const TrackerUnit: React.FC<TrackerUnitProps> = ({
    id,
    index,
    selected,
    dateStarted,
    strict,
}) => {
    const markTrack = useStore((state) => state.markTrack);

    const ds = addDays(new Date(dateStarted), index);

    return (
        <Tooltip
            content={
                <div className="space-y-1 w-32">
                    <div className="border-b">{format(ds, "dd-MM-yyyy")}</div>
                    <div>
                        {selected === "completed"
                            ? "Completed"
                            : selected === "not-completed"
                            ? "Not Completed"
                            : "Not Started"}
                    </div>
                    {!strict &&
                        (selected === "completed" ||
                            selected === "not-completed") && (
                            <div>
                                <Button
                                    size="xs"
                                    color={
                                        selected === "completed"
                                            ? "failure"
                                            : undefined
                                    }
                                    onClick={() => {
                                        markTrack(
                                            id,
                                            index,
                                            selected === "completed"
                                                ? false
                                                : true
                                        );
                                    }}
                                >
                                    {selected === "completed"
                                        ? "Unmark"
                                        : "Mark"}
                                </Button>
                            </div>
                        )}
                </div>
            }
            trigger="click"
            placement="bottom"
        >
            <button
                className={`text-xs border border-black w-8 h-8 ${
                    selected === "completed"
                        ? "bg-lime-600"
                        : selected === "not-completed"
                        ? "bg-red-600"
                        : ""
                }`}
            >
                {index + 1}
            </button>
        </Tooltip>
    );
};

export default TrackerUnit;
