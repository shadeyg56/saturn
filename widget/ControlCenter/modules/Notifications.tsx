import NotifictionMap from "../../../objects/NotificationMap"
import { Menu } from "./ToggleButton"
import { setControlCenterStackWidget } from "../ControlCenter"
import Notifd from "gi://AstalNotifd?version=0.1"
import { createBinding } from "ags"
import { Gtk } from "ags/gtk3"

const notifd = Notifd.get_default()

export function RecentNotifications() {

    const notifs = new NotifictionMap({timeout: 0, limit: 3, persist: true}) 

    return (

        <box vertical>
            <box class="notifs-recent-header">
                <label label="Notifications"/>
                <button
                halign={Gtk.Align.END}
                hexpand
                onClick={() => setControlCenterStackWidget("notifications")}
                >
                    <label label="View All"
                    css="font-size: 14px;"
                    />
                </button>
            </box>
            <label
            label="No Recent Notifications"
            visible={notifs.as((notifs) => notifs.length === 0)}
            halign={Gtk.Align.CENTER}
            hexpand
            css={"margin-top: 15px"}
            />
            <box class="notifs-recent"
            //@ts-ignore
            vertical //noImplicitDestroy
            >
                {notifs.get()}
            </box>
        </box>
    )

}

export function NotificationMenu() {

    const notifs = new NotifictionMap({timeout: 0, persist: true})

    return (
        <Menu
            $type="named"
            name="notifications"
            title="Notifications"
            child={
                <box vertical>
                    <box halign={Gtk.Align.END} hexpand>
                        <button class="dnd"
                        onClick={() => notifd.set_dont_disturb(!notifd.get_dont_disturb())}
                        >
                            <stack visibleChildName={createBinding(notifd, "dontDisturb").as((dnd) => dnd ? "dnd" : "ringer")}>
                                <icon $type="named" name="ringer" icon="notifications-applet-symbolic"/>
                                <icon $type="named" name="dnd" icon="notifications-disabled-symbolic"/>
                            </stack>
                        </button>
                        <button class="notifs-close-all"
                        onClick={() => notifs.disposeAll()}
                        >
                            <icon icon="window-close-symbolic"/>
                        </button>
                    </box>
                    <box class="notifs-recent"
                    //@ts-ignore
                    vertical //noImplicitDestroy
                    >
                        {notifs.get()}
                    </box>
                </box>
            }
        />
    )
}
