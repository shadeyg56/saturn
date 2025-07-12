import Battery from "gi://AstalBattery"
import { createComputed, createBinding, createState, Accessor } from "ags";
import { Gtk } from "ags/gtk3";

const battery = Battery.get_default();

function BatteryIcon() {
    //Variable.derive([bind(battery, "percentage"), bind(battery, "charging")
    const batteryBind = createComputed([createBinding(battery, "percentage"), createBinding(battery, "charging")], 
        (percent, isCharging) => {
            percent = Math.floor(percent * 10) * 10;
            return `battery-level-${percent}${isCharging && percent !== 100 ? "-charging" : ""}-symbolic`})

    return (
        <icon 
        class="barIcon"
        icon={batteryBind}
        />
    )
}

interface RevealerProps {
    revealChild: boolean | Accessor<boolean>
}

function PercentLabel({revealChild}: RevealerProps) {

    const percent = createBinding(battery, "percentage");

    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
            revealChild={revealChild}
        >
            <label
            class="batPercent"
            label={percent.as((p) => `${Math.round(p*100)}%`)}
            />
        </revealer>
    )
}

export default function BatteryWidget() {

    const [revealChild, setRevealChild] = createState(false)

    return (
        <button class="battery"
        onHover={() => {setRevealChild(true)}}
        onHoverLost={() => setRevealChild(false)}
        visible={createBinding(battery, "isPresent")}
        >
            <box>
                <BatteryIcon/>
                <PercentLabel revealChild={revealChild}/>
            </box>
        </button>
    )
}