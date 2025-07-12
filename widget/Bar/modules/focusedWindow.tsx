import Hyprland from "gi://AstalHyprland"
import { createBinding, createComputed, With} from "ags";
import Pango from "gi://Pango";

function FocusedWindow() {

    const hyprland = Hyprland.get_default();

    const client = createBinding(hyprland, "focusedClient")

    return (
        <box 
        class="focusedTitle"
        visible={client.as((client) => client ? true : false)}
        >
            <With value={client}>
                {(c) => {
                    const title = (client != null) ? c.title : "";
                    return (
                        <label
                        maxWidthChars={40}
                        ellipsize={Pango.EllipsizeMode.MIDDLE}
                        label={title}
                        />
                    )
                }}
            </With>

        </box>
    )
}

export default FocusedWindow;