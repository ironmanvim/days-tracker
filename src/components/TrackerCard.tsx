import { Button, Card, Progress } from "flowbite-react";
import { HiOutlineBell, HiExternalLink, HiCheck, HiOutlineShieldExclamation } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { differenceInCalendarDays, format } from "date-fns";

interface TrackerCardProps {
    name: string;
    id: number;
    numberOfDays: number;
    dateStarted: number;
    failureAlert: boolean;
    track: boolean[];
}

const TrackerCard: React.FC<TrackerCardProps> = ({
    name,
    id,
    dateStarted,
    numberOfDays,
    failureAlert,
    track,
}) => {
    const navigate = useNavigate();

    const currentDate = new Date();
    const ds = new Date(dateStarted);

    const diff = differenceInCalendarDays(currentDate, ds);

    const alert = diff - 1 >= 0 ? !track[diff - 1] : false;

    return (
        <Card>
            <div className="flex flex-col">
                <div className="flex justify-end mb-2 text-xs text-gray-600">
                    {format(ds, "dd-MM-yyyy")}
                </div>
                <div className="mb-2">
                    {diff >= 0 && diff <= numberOfDays && (
                        <Progress
                            progress={Number(
                                ((diff * 100) / numberOfDays).toFixed(2)
                            )}
                            label={`${name} (${diff} / ${numberOfDays} days)`}
                            labelPosition="outside"
                            labelProgress={true}
                        />
                    )}
                    {diff < 0 && (
                        <div className="flex py-2">
                            <div className="flex-1">{`${name} (${numberOfDays} days)`}</div>
                            <div className="text-red-600">Not Started</div>
                        </div>
                    )}
                    {diff > numberOfDays && (
                        <div className="flex py-2">
                            <div className="flex-1">{`${name} (${numberOfDays} days)`}</div>
                            <div className="flex items-center text-green-600">
                                <HiCheck className="mr-1 h-5 w-5" />
                                Finished
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex mt-2 space-x-1 items-center">
                    <div className="flex-1">
                        <Button
                            color="gray"
                            onClick={() => {
                                navigate(`/${id}`);
                            }}
                        >
                            Open <HiExternalLink className="ml-1 h-6 w-6" />
                        </Button>
                    </div>
                    {failureAlert && (
                        <div>
                            <HiOutlineBell className="h-6 w-6" />
                        </div>
                    )}
                    {alert && (
                        <div>
                            <HiOutlineShieldExclamation className="h-6 w-6 text-red-600"/>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default TrackerCard;
