import { ArrowToggleButton, Menu } from "./ToggleButton";
import Network from "gi://AstalNetwork";
import Pango from "gi://Pango";
import { createBinding, createComputed, For, With } from "ags";
import { execAsync } from "ags/process";
import { Gtk } from "ags/gtk3";

const network = Network.get_default();

export function NetworkToggle(): Gtk.Widget {

    if (network.wifi) {
        return <WifiToggle></WifiToggle> as Gtk.Widget
    }
    else if (network.wired) {
        return <Ethernet></Ethernet> as Gtk.Widget;
    }
    return (<box></box>) as Gtk.Widget;
    
}

function Ethernet() {

    const label = <label
        ellipsize={Pango.EllipsizeMode.END}
        label={createBinding(network.wired, "internet").as((state) => 
            state === Network.Internet.CONNECTED ? "Connected": "Not Connected")
        }
    />

    return <box class="toggle-button active">
        <button>
            <box class="label-box-horizontal" hexpand={true}>
                <icon
                    icon={createBinding(network.wired, "iconName")}
                />
                {label}
            </box>
        </button>
    </box> as Gtk.Widget;
}

function WifiToggle() {
    const toggleIcon = <icon
        icon={createBinding(network.wifi, "iconName")}
    />

    const label = <label
        ellipsize={Pango.EllipsizeMode.END}
        label={createComputed([createBinding(network.wifi, "ssid"), createBinding(network.wifi, "enabled")], (ssid, enabled) => 
            enabled ? ssid : "Not Connected")
        }
    />

    return (
        <ArrowToggleButton
        name="network"
        icon={toggleIcon}
        label={label}
        condition={createBinding(network.wifi, "enabled")}
        deactivate={() => network.wifi.set_enabled(false)}
        activate={() => {
            network.wifi.set_enabled(true)
            network.wifi.scan();
        }}
        />
    ) as Gtk.Widget;
}

export function WifiMenu() {

    if (!network.wifi) {
        return <box></box> as Gtk.Widget;
    }

    const accessPoints = createBinding(network.wifi, "accessPoints").as((aps) => 
        aps.filter((ap, index, array) => 
            array.findIndex(obj => obj.ssid === ap.ssid) === index
            && ap.ssid !== null
        )
    )

    const menuItems = createComputed([accessPoints, createBinding(network.wifi, "activeAccessPoint")], (aps, active) => 
        aps.map((ap) => 
            <button class="menu-item"
                onClick={() => {
                    if (active !== null && active.ssid === ap.ssid)
                        execAsync(`nmcli c down ${ap.ssid}`)
                    else
                        execAsync(`nmcli d wifi connect ${ap.ssid}`)
                }}
            >
                <box>
                    {active != null && active.ssid === ap.ssid
                        ? <icon icon={"object-select-symbolic"}
                            css={"font-size: 20px;"}
                        />
                        : ""
                    }
                    <label label={ap.ssid}
                        maxWidthChars={25}
                        ellipsize={Pango.EllipsizeMode.END}
                    />
                    <icon icon={ap.iconName}
                        halign={Gtk.Align.END}
                        hexpand={true}
                        css={"font-size: 20px;"}
                    />
                </box>
            </button>
        )
    );


    return (
        <Menu
            $type="named"
            name="network"
            title="Wifi Network"
            child={
                <box vertical={true}>
                    <For each={menuItems}>
                        {(item) => item}
                    </For>
                </box>
            }
        />
    ) as Gtk.Widget;
}