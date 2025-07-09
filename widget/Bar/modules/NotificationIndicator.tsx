import { bind } from "astal"
import Notifd from "gi://AstalNotifd?version=0.1"

const notifd = Notifd.get_default()

export default function NotificationIndicator() {

    return (
        <icon className="barIcon"
        icon="notifications-applet-symbolic"
        css={"font-size: 15px;"}
        visible={bind(notifd, "notifications").as((notifs) => notifs.length !== 0)}
        />
    )
}