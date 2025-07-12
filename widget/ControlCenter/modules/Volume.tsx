import Wp from "gi://AstalWp";
import { setControlCenterStackWidget } from "../ControlCenter";
import { createBinding } from "ags";
import { Astal } from "ags/gtk3";

const audio = Wp.get_default()!.audio;


function VolumeSlider() {
    return (
        <slider
        drawValue={false}
        hexpand={true}
        onDragged={(slider) => audio?.defaultSpeaker.set_volume(slider.get_value())}
        value={createBinding(audio.get_default_speaker()!, "volume")}
        />
    )
}

function VolumeIcon() {
    const volumeThresholds = [101, 67, 34, 1, 0];

    const setupStack = (stack: Astal.Stack) => {
        if (!audio)
            return
        audio.get_default_speaker()?.connect("notify", ((speaker) => {
            if (speaker.get_mute()) {
                stack.shown = "0";
                return;
            }

            stack.visibleChildName = volumeThresholds.find((threshold) => threshold <= speaker.volume * 100)!.toString();
        }))
    }


    return (
        <box>
            <stack $={(setupStack)}>
                <icon $type="named" name="101" icon="audio-volume-overamplified-symbolic"/>
                <icon $type="named" name="67" icon="audio-volume-high-symbolic"/>
                <icon $type="named" name="34" icon="audio-volume-medium-symbolic"/>
                <icon $type="named" name="1" icon="audio-volume-low-symbolic"/>
                <icon $type="named" name="0" icon="audio-volume-muted-symbolic"/>
            </stack>
        </box>
    )
}

export default function Volume() {
    return (
        <box>
            <button
            tooltipText={createBinding(audio.get_default_speaker()!, "volume").as(v => `Volume: ${Math.floor(v * 100)}%`)}
            onClick={() => setControlCenterStackWidget.set("audio")}
            >
                <VolumeIcon/>
            </button>
            <VolumeSlider/>
        </box>
    )
}