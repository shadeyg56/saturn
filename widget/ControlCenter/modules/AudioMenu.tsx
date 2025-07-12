import Wp from "gi://AstalWp";
import { Menu } from "./ToggleButton";
import { SimpleToggleButton } from "../modules/ToggleButton";
import Pango from "gi://Pango";
import { createBinding, For } from "ags";

const audio = Wp.get_default()?.audio!;


export default function AudioMenu() {

    const sinks = createBinding(audio, "speakers");

    return (
        <Menu
            $type="named"
            name="audio"
            title="Audio Devices"
            child={
                <box vertical={true} class="audio-box">
                    <For each={sinks}>
                        {(sink) => (
                            <box class="menu-item">
                                <SimpleToggleButton
                                    condition={createBinding(sink, 'isDefault')}
                                    toggle={() => sink.set_is_default(true)}
                                    child={
                                        <box>
                                            <icon icon={createBinding(sink, 'isDefault').as((isDefault => isDefault ? "radio-checked-symbolic" : "radio-symbolic"))}/>
                                            <label label={sink.name ? sink.name : sink.description}
                                                maxWidthChars={25}
                                                ellipsize={Pango.EllipsizeMode.END}
                                            />
                                        </box>
                                    }
                                />
                            </box>
                        )}
                    </For>
                </box>
            }
        />
    )
}
