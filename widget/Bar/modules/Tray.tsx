import { createBinding, For } from "ags";
import Tray from "gi://AstalTray";


export default function TrayContainer() {
    const AstalTray = Tray.get_default();
    const trayItems = createBinding(AstalTray, "items")

    return (
        <box class="trayBox">
            <For each={trayItems}>
                {(item) => (
                    <box class="barIcon">
                        <icon gicon={item.get_gicon()} />
                    </box>
                )}
            </For>
        </box>
    )
}