import { createBinding } from "ags";
import Autocpufreq from "../../../objects/Autocpufreq";
import { Gtk } from "ags/gtk3";

interface GovernorButtonProps {
    name: string,
    icon: string
}

const auto_cpufreq = Autocpufreq.get_default();

function GovernorButton({name, icon}: GovernorButtonProps) {
    
    const activeBind = createBinding(auto_cpufreq, "governor")
        .as((governor) => governor.toLowerCase() === name.toLowerCase())
    
    return (
        <button class={activeBind.as((active) => "governor-button" + (active ? " active" : ""))}
        onClick={() => auto_cpufreq.governor = (activeBind.get() ? "Default" : name)}
        >
            <box>
                <icon icon={icon}/>
                <label label={name}/>
            </box>
        </button>
    )
}

export default function Governors() {
    return (
        <box class="toggle-button"
        homogeneous={true}
        visible={createBinding(auto_cpufreq, "available")}
        >  
            <GovernorButton name="Powersave"
            icon="power-profile-power-saver-symbolic"
            />
            <GovernorButton name="Performance"
            icon="power-profile-performance-symbolic"
            />
        </box>
    ) as Gtk.Widget;
}

