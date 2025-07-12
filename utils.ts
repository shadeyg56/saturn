import App from "ags/gtk3/app";
import { exec } from "ags/process";
import { timeout, createPoll } from "ags/time";
import { Gtk } from "ags/gtk3"


export const uptime = createPoll("0:00", 60_000, "cat /proc/uptime", (out, _) => {
    const uptime = Number.parseInt(out.split('.')[0]) / 60;
        if (uptime > 18 * 60)
            return 'Go Sleep';

        const h = Math.floor(uptime / 60);
        const s = Math.floor(uptime % 60);
        return `${h}:${s < 10 ? '0' + s : s}`;
});

export function toggleWindow(windowName: string, delay: number=300) {
    const window = App.get_window(windowName);
    if (window === null)
        return
    if (window.is_visible()) {
        (window.get_child() as Gtk.Revealer).revealChild = false;
        timeout(delay, () => window.hide());
    }
    else {
        window.show();
        (window.get_child() as Gtk.Revealer).revealChild = true;
    }
}

export function hideWindow(windowName: string, delay: number=300) {
    const window = App.get_window(windowName);
        if (window === null)
        return
    if (window.is_visible()) {
        (window.get_child() as Gtk.Revealer).revealChild = false;
        timeout(delay, () => window.hide());
    }
}

export function getFiles(folderName: string) {
    const out = exec(["find", folderName, "-type", "f"])
    return out.split("\n")
}

export function lookupIcon(iconName: string){
    const theme = Gtk.IconTheme.get_default();
    const iconInfo = theme.lookup_icon(iconName, 12, null);
    if (iconInfo == null) {
        return null;
    }
    return iconInfo.get_filename();
}