import { createBinding, createComputed, For } from "ags";
import { ArrowToggleButton, Menu } from "./ToggleButton";
import Bluetooth from "gi://AstalBluetooth";
import Pango from "gi://Pango";
import { Gtk } from "ags/gtk3";

const bluetooth = Bluetooth.get_default();

export default function BluetoothToggle() {
    
    const isPowered = createBinding(bluetooth, "isPowered");
    const isConnected = createBinding(bluetooth, "isConnected")

    const icon = <icon
    icon={isPowered.as((enabled) => 
        enabled ? "bluetooth-active-symbolic" 
        : "bluetooth-disabled-symbolic"
    )}/>

    const labelBind = createComputed([isPowered, isConnected], 
    (enabled, connected) => {
        if (!enabled)
            return "Disabled";

        if (!connected) {
            return "Not Connected";
        }

        const connectedDevices = bluetooth.get_devices().filter((device) => device.get_connected());

        if (connectedDevices.length === 1)
            return connectedDevices[0].alias;

        return `${connectedDevices.length} Devices Connected`;
    })

    const label = <label
    label={labelBind}
    ellipsize={Pango.EllipsizeMode.END}
    />

    return (
        <ArrowToggleButton
        name="bluetooth"
        icon={icon}
        label={label}
        activate={() => bluetooth.get_adapter()?.set_powered(true)}
        deactivate={() => bluetooth.get_adapter()?.set_powered(false)}
        condition={isPowered}
        />
    ) as Gtk.Widget;
}

export function BluetoothMenu() {

    const getDeviceIcon = (device: Bluetooth.Device) => {
        if (device.connected) {
            return "spinner-symbolic"
        } else if (device.connecting) {
            return "spinner-symbolic"
        }
        return "";
    }

    const devices = createBinding(bluetooth, "devices");

    return (
        <Menu
            $type="named"
            name="bluetooth"
            title="Bluetooth Devices"
            child={
                <box vertical={true}>
                    <For each={devices}>
                        {(device) => (
                            <button class="menu-item"
                            onClick={() => {
                                if (!bluetooth.isPowered)
                                    bluetooth.get_adapter()?.set_powered(true);
                                if (device.connected)
                                    device.disconnect_device(() => {});
                                else
                                    device.connect_device(() => {});
                            }}
                            >
                                <box>
                                    <icon icon={createComputed([createBinding(device, "connected"), createBinding(device, "connecting")], (connected, connecting) => 
                                        connected ? "object-select-symbolic" 
                                        : (connecting ? "content-loading-symbolic" : "")
                                    )}
                                    css={"font-size: 20px;"}
                                    />
                                    <label label={device.alias}
                                    maxWidthChars={25}
                                    ellipsize={Pango.EllipsizeMode.END
                                    }
                                    />
                                </box>
                            </button>
                        )}
                    </For>
                </box>
            }
        />
)
}