import App from "ags/gtk3/app";
import { Astal, Gtk, Gdk } from "ags/gtk3"
import Clock from "./modules/Clock"
import Workspaces from "./modules/Workspaces"
import FocusedWindow from "./modules/focusedWindow"
import Volume from "./modules/volume"
import BatteryWidget from "./modules/battery"
import NetworkIndicator from "./modules/Network"
import PowerButton from "./modules/PowerButton"
import MediaIndicator from "./modules/Media"
import ControlCenterButton from "./modules/ControlCenterButton"
import Cava from "./modules/Cava"
import NotificationIndicator from "./modules/NotificationIndicator"
import { toggleWindow } from "saturn/utils"
import TrayContainer from "./modules/Tray";

export default function Bar(gdkmonitor: Gdk.Monitor) {
    return <window
        name="bar"
        namespace="bar0"
        class="bar"
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.TOP
            | Astal.WindowAnchor.LEFT
            | Astal.WindowAnchor.RIGHT}
        marginBottom={5}
        application={App}>
        <centerbox>
            <box $type="start">
                <Workspaces/>
                <FocusedWindow/>
            </box>
            <box $type="center">
                <Clock/>
                <MediaIndicator/>
                <Cava/>
            </box>
            <box halign={Gtk.Align.END}
            $type="end"
            >
                <ControlCenterButton/>
                <eventbox
                class="rightBox"
                onClick={() => toggleWindow("controlcenter")}
                >
                    <box>
                        <NotificationIndicator/>
                        <TrayContainer/>
                        <Volume/>
                        <BatteryWidget/>
                        <NetworkIndicator/>
                        <PowerButton/>
                    </box>
                </eventbox>
            </box>
        </centerbox>
    </window>
}
