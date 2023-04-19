import { format } from "date-fns";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import produce from "immer";
import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";

export interface EditTrackerProps {}

const EditTracker: React.FC<EditTrackerProps> = () => {
    const { id } = useParams<"id">();
    const navigate = useNavigate();

    const [startToday, setStartToday] = useState(false);
    const editTracker = useStore((state) => state.editTracker);

    const tracker = useStore((state) =>
        state.trackers.find((tracker) => tracker.id === Number(id))
    );

    if (!tracker) {
        return <div>Not Found</div>;
    }

    const [form, setForm] = useState({
        name: tracker.name,
        numberOfDays: tracker.numberOfDays,
        dateStarted: tracker.dateStarted,
        failureAlert: tracker.failureAlert,
        strict: tracker.strict,
        remindMe: tracker.remindMe,
        remindMeTime: tracker.remindMeTime,
    });

    const fullDate = format(new Date(form.dateStarted), "yyyy-MM-dd");

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        editTracker({
            id: Number(id),
            name: form.name,
            numberOfDays: form.numberOfDays,
            dateStarted: !startToday ? form.dateStarted : Date.now(),
            failureAlert: form.failureAlert,
            strict: form.strict,
            remindMe: form.remindMe,
            remindMeTime: form.remindMeTime,
        });

        navigate(`/${id}`);
    };
    return (
        <div>
            <div className="flex border-b p-2 px-4 items-center">
                <div className="text-2xl font-bold flex-1">Edit Tracker</div>
            </div>
            <form className="flex flex-col gap-4 p-2 px-4" onSubmit={onSubmit}>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="tracker-name" value="Tracker Name" />
                    </div>
                    <TextInput
                        id="tracker-name"
                        type="text"
                        placeholder="Yoga"
                        required={true}
                        value={form.name}
                        onChange={(e) => {
                            setForm(
                                produce((draft) => {
                                    draft.name = e.target.value;
                                })
                            );
                        }}
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="tracker-name" value="No of days" />
                    </div>
                    <TextInput
                        id="tracker-days"
                        type="number"
                        placeholder="100"
                        required={true}
                        value={String(form.numberOfDays)}
                        onChange={(e) => {
                            setForm(
                                produce((draft) => {
                                    draft.numberOfDays = Number(e.target.value);
                                })
                            );
                        }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="today"
                        checked={startToday}
                        onChange={(e) => {
                            setStartToday(e.target.checked);
                        }}
                    />
                    <Label htmlFor="today">Start from Today</Label>
                </div>
                {!startToday && (
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="tracker-date" value="Date" />
                        </div>
                        <TextInput
                            id="tracker-date"
                            type="date"
                            placeholder="100"
                            required={true}
                            value={fullDate}
                            onChange={(e) => {
                                setForm(
                                    produce((draft) => {
                                        draft.dateStarted = new Date(
                                            e.target.value
                                        ).getTime();
                                    })
                                );
                            }}
                        />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="failure-alert"
                        checked={form.failureAlert}
                        onChange={(e) => {
                            setForm(
                                produce((draft) => {
                                    draft.failureAlert = e.target.checked;
                                })
                            );
                        }}
                    />
                    <Label htmlFor="failure-alert">
                        Alert when failed to follow the track
                    </Label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="remind-me"
                        checked={form.remindMe}
                        onChange={(e) => {
                            setForm(
                                produce((draft) => {
                                    draft.remindMe = e.target.checked;
                                })
                            );
                        }}
                    />
                    <Label htmlFor="remind-me">Remind Me</Label>
                </div>
                {form.remindMe && (
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="remind-me-time" value="Date" />
                        </div>
                        <TextInput
                            id="remind-me-time"
                            type="time"
                            placeholder="100"
                            required={true}
                            value={form.remindMeTime}
                            onChange={(e) => {
                                setForm(
                                    produce((draft) => {
                                        draft.remindMeTime = e.target.value;
                                    })
                                );
                            }}
                        />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="strict"
                        checked={form.strict}
                        onChange={(e) => {
                            setForm(
                                produce((draft) => {
                                    draft.strict = e.target.checked;
                                })
                            );
                        }}
                    />
                    <Label htmlFor="strict">Enable strict mode</Label>
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default EditTracker;
