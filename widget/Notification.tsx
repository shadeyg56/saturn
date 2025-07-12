import Notifd from "gi://AstalNotifd"
import NotifiationMap from "../objects/NotificationMap";
import Pango from "gi://Pango?version=1.0";
import { Astal, Gdk, Gtk } from "ags/gtk3";
import App from "ags/gtk3/app";

type NotificationProps = {
    notification: Notifd.Notification
    setup: () => void
}

export function Notification(props: NotificationProps) {
    const notif = props.notification;
    const setup = props.setup;

    const time = new Date(0)
    time.setUTCSeconds(notif.get_time())
    const timeString = `${time.getHours()}:${time.getMinutes()}`

    return (
        <box class={"notification"}
        $={setup}
        >
            <box vertical>
                <box class="notif-header">
                    <label label={notif.get_app_name()}/>
                    <label label={timeString}
                    halign={Gtk.Align.END}
                    hexpand
                    css={"font-size: 12px;"}
                    />
                    <button class="notif-close"
                    onClick={() => notif.dismiss()}
                    valign={Gtk.Align.START}
                    halign={Gtk.Align.END}
                    >
                        <icon icon="window-close-symbolic"/>
                    </button>
                </box>
                <box class="notif-main">
                    <box class={"notif-img"}
                    css={`background-image: url("${notif.get_image()}");`}
                    visible={notif.get_image() !== null}
                    />
                    <box vertical>
                        <label class={"notif-summary"} 
                        label={notif.get_summary()}
                        halign={Gtk.Align.START}
                        />
                        <label class={"notif-body"} 
                        label={notif.get_body()}
                        halign={Gtk.Align.START}
                        wrapMode={Pango.WrapMode.CHAR}
                        wrap
                        />
                    </box>
                </box>
                <box
                visible={notif.get_actions().length !== 0}
                spacing={5}
                >
                    {notif.get_actions().map((action) => 
                        <button class="notif-action"
                        onClick={() => notif.invoke(action.id)}
                        hexpand={true}
                        >
                            <label label={action.label}/>
                        </button>
                    )}
                </box>
            </box>
        </box>
    ) as Gtk.Widget
}

export default function NofificationPopups(gdkmonitor: Gdk.Monitor) {

    const notifs = new NotifiationMap({timeout: 5000, dismissOnTimeout: false})

    return (
        <window
        name="notifications"
        namespace="notifications"
        anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP}
        visible={true}
        gdkmonitor={gdkmonitor}
        application={App}
        marginRight={25}
        >
            {/* <revealer
            revealChild={false}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
            >    */}
            <box class="notifications-popup"
            vertical
            //@ts-ignore
            //noImplicitDestroy
            >
                {notifs.get()}

            </box>
            {/* </revealer> */}
        </window>
    )
}