import Network from "gi://AstalNetwork";
import { createBinding } from "ags";

export default function NetworkIndicator() {

    const network = Network.get_default();

    const primaryNetwork = createBinding(network, "primary");

    const enumMap = new Map<number, string>([
        [Network.Primary.UNKNOWN, "disconnected"],
        [Network.Primary.WIFI, "wifi"],
        [Network.Primary.WIRED, "wired"]
    ])

    return (
        <stack class="barIcon"
        visibleChildName={primaryNetwork.as((p) => enumMap.get(p) ?? "disconnected")}
        >   
            <icon $type="named" name="wifi"
            icon="network-wireless-symbolic"
            />
            <icon $type="named" name="wired"
            icon="network-wired-symbolic"
            />
            <icon $type="named" name="disconnected"
            icon="network-wireless-offline-symbolic"
            />
        </stack>
    )
}