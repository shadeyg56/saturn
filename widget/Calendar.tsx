import { createPoll } from "ags/time";
import App from "ags/gtk3/app";
import { Astal, Gdk, Gtk } from "ags/gtk3";


function DateAndTime() {

    const date = createPoll("", 100, ['date', '+%A, %B %d, %Y'])
    const time = createPoll("", 100, ['date', '+%k:%M:%S'])


    return (
        <box class="date-and-time"
        vertical={true}
        >
            <label class="date"
            label={date}
            />
            <label class="big-clock"
            label={(time)}
            />
        </box>
    )
}

function CalendarContainer() {
    return (
        <box class="calendar-container" vertical={true}>
            <DateAndTime/>
            <Gtk.Calendar class="calendar"
            showDayNames={true}
            showDetails={true}
            showHeading={true}
            />
        </box>
    )
}

export default function CalendarWindow(gdkmonitor: Gdk.Monitor) {
    return (
        <window
        name="calendar"
        namespace="calendar"
        gdkmonitor={gdkmonitor}
        anchor={ Astal.WindowAnchor.TOP }
        visible={false}
        application={App}
        >
            <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            >
                <CalendarContainer/>
            </revealer>
        </window>
    )
}