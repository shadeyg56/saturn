import Wp from "gi://AstalWp";
import { hideWindow, toggleWindow } from "saturn/utils";
import Brightness from "../objects/Brightness";
import { Accessor, createBinding, createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk3";
import App from "ags/gtk3/app";
import { timeout } from "ags/time";

const audio = Wp.get_default()!;
const brightness = Brightness.get_default();

const [shown, setShown] = createState("");
const [hovering, setHovering] = createState(false);
const [lastChanged, setLastChanged] = createState(-1);

const OSD_TIMEOUT = 3000;

interface OSDItemProps{
    name: string
    icon: string,
    property: Accessor<number>,
    callback: (slider: Astal.Slider) => void
}

function showOSD(name: string, changed: number) {
    const window = App.get_window("osd");
    if (window === null)
        return;
    if (!window.visible)
        toggleWindow("osd");
    setShown(name);
    timeout(OSD_TIMEOUT, () => {
        if (!hovering.get() && changed == lastChanged.get()) {
            hideWindow("osd");
        }
    })
}

function OSDItem({name, icon, property, callback}: OSDItemProps) {

    const setup = () => {
        property.subscribe(() => {
            const time = Date.now();
            setLastChanged(time);
            showOSD(name, time);
        })
    }

    return (
        <box name={name} class="osd-container" 
        vertical={true} 
        $={setup}>
            <icon class="osd-icon" icon={icon}/>
            <slider class="osd-slider"
            vertical={true}
            inverted={true}
            value={property}
            onDragged={callback}
            hexpand={true}
            drawValue={false}
            />
        </box>
    )
}

export default function OSDWindow(gdkmonitor: Gdk.Monitor) {
    return (
        <window
        name="osd"
        namespace="osd"
        anchor={Astal.WindowAnchor.RIGHT}
        visible={false}
        gdkmonitor={gdkmonitor}
        application={App}
        marginRight={25}
        >
            <revealer
            revealChild={false}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
            >   
                <eventbox 
                onHover={() => setHovering(true)}
                onHoverLost={() => {
                    setHovering(false);
                    timeout(OSD_TIMEOUT, () => hideWindow("osd"))
                }}
                >
                    <stack visibleChildName={shown}
                    transitionType={Gtk.StackTransitionType.CROSSFADE}
                    transitionDuration={100}
                    >
                        <OSDItem $type="named" name="volume" icon={"audio-volume-medium-symbolic"} 
                        property={createBinding(audio.defaultSpeaker, "volume")}
                        callback={({value}) => audio.defaultSpeaker.volume = value}
                        />
                        <OSDItem $type="named" name="brightness" icon={"display-brightness-symbolic"} 
                        property={createBinding(brightness, "screen")}
                        callback={({value}) => brightness.screen = value}
                        />
                        <box $type="named" name=""/>
                    </stack>
                </eventbox>
            </revealer>
        </window>
    )
}