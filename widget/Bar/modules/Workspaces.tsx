import { createBinding, createComputed } from "ags";
import { Gtk } from "ags/gtk3";
import Hyprland from "gi://AstalHyprland"

function Workspaces() {

    const hyprland = Hyprland.get_default();

    const getButtonClass = (i: number) => {
        const className = createComputed([createBinding(hyprland, "focusedWorkspace"), createBinding(hyprland, "workspaces")], (currentWorkspace, workspaces) => {
            if (currentWorkspace === null)
                return ""

            if (currentWorkspace.id === i) {
                return "focused";
            } else {
                const workspaceIDs = workspaces.map((w) => w.id);
                if (workspaceIDs.includes(i)) {
                    return "active"
                }
                else {
                    return "";
                }
            }
        })
        return className;
    }

    return (
        <box class="workspaces">
            {Array.from({length: 10}, (_, i) => 
            <button class={getButtonClass(i+1)}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            onClick={() => hyprland.dispatch("workspace", (i+1).toString())}
            >
                <label 
                    label={''}
                    css={createBinding(hyprland, "focusedWorkspace").as((currentWorkspace) => (i+1) === currentWorkspace.id ? "min-width: 20px;" : "min-width: 1px;")}
                />
            </button>)}
        </box>
    )
}

export default Workspaces;