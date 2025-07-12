import App from "ags/gtk3/app";
import { toggleWindow } from "saturn/utils";


export default function ControlCenterButton() {

    const iconSetup = (icon: JSX.IntrinsicElements["icon"]) => {
        App.connect("window-toggled", (_, window) => {
            if (window.name === "controlcenter")
                icon.css = window.get_visible() ? '-gtk-icon-transform: rotate(90deg);' : '-gtk-icon-transform: rotate(0deg);'
        })
    }

    return (
        <button class="controlCenterButton"
        onClick={() => toggleWindow("controlcenter")}
        >
            <icon icon="pan-end-symbolic"
            class="controlCenterIcon"
            $={iconSetup}
            />
        </button>
    )
}