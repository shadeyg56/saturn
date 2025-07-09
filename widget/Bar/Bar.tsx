import { App, Astal, Gtk, Gdk } from "astal/gtk3"
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
import { toggleWindow } from "../../utils"

export default function Bar(gdkmonitor: Gdk.Monitor) {
    return <window
        name="bar"
        namespace="bar0"
        className="bar"
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.TOP
            | Astal.WindowAnchor.LEFT
            | Astal.WindowAnchor.RIGHT}
        marginBottom={5}
        application={App}>
        <centerbox>
            <box>
                <Workspaces/>
                <FocusedWindow/>
            </box>
            <box className="centerBox">
                <Clock/>
                <MediaIndicator/>
                <Cava/>
            </box>
            <box halign={Gtk.Align.END}>
                <ControlCenterButton/>
                <eventbox
                    className="rightBox"
                    onClick={() => toggleWindow("controlcenter")}
                    child={
                        <box>
                            <NotificationIndicator/>
                            <Volume/>
                            <BatteryWidget/>
                            <NetworkIndicator/>
                            <PowerButton/>
                        </box>
                    }
                ></eventbox>
            </box>
        </centerbox>
    </window>
}
