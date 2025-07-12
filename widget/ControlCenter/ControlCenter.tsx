import Header from "./modules/Header";
import Volume from "./modules/Volume";
import BrightnessWidget from "./modules/Brightness";
import { NetworkToggle, WifiMenu } from "./modules/Network";
import BluetoothToggle, { BluetoothMenu } from "./modules/Bluetooth";
import Governors from "./modules/Governors";
import AudioMenu from "./modules/AudioMenu";
import { NotificationMenu, RecentNotifications } from "./modules/Notifications";
import { Astal, Gdk, Gtk } from "ags/gtk3";
import { createState } from "ags";
import App from "ags/gtk3/app";

function Row(toggles: Gtk.Widget[]=[], menus: Gtk.Widget[]=[]) {
    return (
        <box vertical={true}>
            <box class="row horizontal">
                {toggles}
            </box>
            {menus}
        </box>
    ) as Gtk.Widget;
}

function Homogeneous(toggles: Gtk.Widget[], horizontal=false) {
    return (
        <box
        homogeneous={true}
        vertical={!horizontal}
        >
            {toggles}
        </box>
    ) as Gtk.Widget;
}

function MainContainer() {
    return (
        <box class="controlcenter"
        vertical={true}
        $type="named"
        name="controlcenter"
        >
            <Header></Header>
            <box class="sliders-box"
            vertical={true}
            >
                <Volume/>
                <BrightnessWidget/>
            </box>
            <box class="toggles">
                {
                    Row([Homogeneous([Row([Homogeneous([NetworkToggle(), BluetoothToggle()], true)]), Governors()])])
                }
            </box>
            <RecentNotifications/>
        </box>
    )
}

export const [controlCenterStackWidget, setControlCenterStackWidget] = createState("controlcenter");

export default function ControlCenter(monitor: Gdk.Monitor) {

    return (
        <window
        name="controlcenter"
        namespace="controlcenter"
        gdkmonitor={monitor}
        anchor={ Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        visible={false}
        application={App}
        >
            <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            >

                <Gtk.Stack visibleChildName={controlCenterStackWidget}
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
                >
                    <MainContainer></MainContainer>
                    <WifiMenu/>
                    <BluetoothMenu/>
                    <AudioMenu/>
                    <NotificationMenu/>
                </Gtk.Stack>
            </revealer>
        </window>
    )
}