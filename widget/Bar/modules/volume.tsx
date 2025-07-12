import Wp from "gi://AstalWp";
import { Accessor, createBinding, createState } from "ags";
import { Astal, Gtk } from "ags/gtk3";

const audio = Wp.get_default()?.get_audio();

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
        <box class="barIcon">
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

interface RevealerProps {
    revealChild: boolean | Accessor<boolean>
}

function PercentBar({revealChild}: RevealerProps) {
    return (
        <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={revealChild}
        >
            <slider class="volBar"
            hexpand={true}
            drawValue={false}
            value={createBinding(audio!.get_default_speaker()!, "volume")}
            onDragged={(slider) => audio?.defaultSpeaker.set_volume(slider.get_value())}
            >

            </slider>
        </revealer>
    )
}

export default function Volume() {

    const [revealChild, setRevealChild] = createState(false);

    return (
        <eventbox
        class="volume"
        onHover={() => setRevealChild(true)}
        onHoverLost={(widget, event) => {
            const x = event.x;
            const y = event.y;
            const w = widget.get_allocation().width;
            const h = widget.get_allocation().height;
            if (x < 0 || x > w || y < 0 || y > h) {
                setRevealChild(false)
            }
        }}
        >
            <box>
                <VolumeIcon/>
                <PercentBar revealChild={revealChild}/>
            </box>
        </eventbox>
        
    )
}