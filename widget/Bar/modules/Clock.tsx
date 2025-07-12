import { createPoll } from "ags/time";
import { toggleWindow } from "saturn/utils";

const time = createPoll("", 1000, "date +%H:%M");

export default function Clock() {
    return (
        <button onClick={() => toggleWindow("calendar")}>
            <label class="clock" label={time}></label>
        </button>
    )
}