import Battery from "gi://AstalBattery"
import { uptime } from "saturn/utils";
import { createBinding } from "ags";
import { Gtk } from "ags/gtk3";
import { exec, execAsync } from "ags/process";

function BatteryProgress() {

    const battery = Battery.get_default();

    const percentage = createBinding(battery, "percentage");

    const labelOverlay = <label
        label={percentage.as(p => `${Math.round(p*100)}%`)}
    />

    return (
        <box class="battery-progress"
        vexpand={true}
        hexpand={true}
        visible={createBinding(battery, "isPresent")}
        >
         <overlay
         vexpand={true}
         overlays={[labelOverlay as Gtk.Widget]}
         >
            <levelbar
            hexpand={true}
            vexpand={true}
            value={percentage}
            />
         </overlay>
        </box>
    )
}


export default function Header() {

    const userName = exec("whoami");
    
    return (
        <box class="header horizontal">
            <box class="system-box"
            hexpand={true}
            >
                <box>
                    <box class={"profile-picture"}
                    css={`background-image: url("${SRC}/assets/icon.png");`}
                    />
                    <box
                    vertical={true}
                    >
                        <label class={"username"}
                        label={userName}
                        />
                        <label class="uptime"
                        hexpand={false}
                        valign={Gtk.Align.CENTER}
                        vexpand={true}
                        visible={false}
                        label={uptime.as((uptime) => `uptime: ${uptime}`)}
                        />
                    </box>
                    
                    <button class={"powerButton-CC"}
                    valign={Gtk.Align.CENTER}
                    hexpand={true}
                    halign={Gtk.Align.END}
                    onClick={() => execAsync(["adios", "--systemd"])}
                    >
                        <icon icon="system-shutdown-symbolic"/>
                    </button>
                </box>
            </box>
        </box>
    )
}