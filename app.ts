import App from "ags/gtk3/app"
import style from "./style/main.scss"
import Bar from "./widget/Bar/Bar"
import ControlCenter from "./widget/ControlCenter/ControlCenter"
import MediaWindow from "./widget/MediaWindow/Media"
import CalendarWindow from "./widget/Calendar"
import OSDWindow from "./widget/OSD"
import NotificationPopups from "./widget/Notification"
import GLib from "gi://GLib"
import hotReloadCSS from "./hotReloadCSS"

const SATURN_ENV = GLib.getenv("SATURN_ENV")

App.start({
    css: style,
    main() {

        if (SATURN_ENV === "development") {
            hotReloadCSS()
        }

        const mainMonitor = App.get_monitors()[0]

        Bar(mainMonitor)
        ControlCenter(mainMonitor)
        MediaWindow(mainMonitor)
        CalendarWindow(mainMonitor)
        OSDWindow(mainMonitor)
        NotificationPopups(mainMonitor)
    }
})
