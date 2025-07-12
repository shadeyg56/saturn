import { createBinding } from "ags"
import Notifd from "gi://AstalNotifd?version=0.1"

const notifd = Notifd.get_default()

export default function NotificationIndicator() {

    return (
        <icon class="barIcon"
        icon="notifications-applet-symbolic"
        css={"font-size: 15px;"}
        visible={createBinding(notifd, "notifications").as((notifs) => notifs.length !== 0)}
        />
    )
}