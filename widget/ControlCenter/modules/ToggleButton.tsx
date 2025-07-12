import { Astal, Gtk } from "ags/gtk3";
import { setControlCenterStackWidget } from "../ControlCenter";
import { Accessor, createState } from "ags";
import { timeout } from "ags/time";

interface SimpleToggleProps {
    child?: MenuChild,
    toggle: () => void,
    condition: Accessor<boolean>,
}

interface ArrowButtonProps {
    name: string
    icon: JSX.Element,
    label: JSX.Element,
    activate: () => void,
    deactivate: () => void,
    activateOnArrow?: boolean,
    condition: Accessor<boolean>
}

type MenuChild = Gtk.Widget | Accessor<Gtk.Widget> | Object | Accessor<Object>;

interface MenuProps {
    name: string,
    title: string,
    child?: MenuChild
}

const [opened, setOpened] = createState("");

export function Arrow(name: string, activate: () => void) {
    let deg = 0;
    let iconOpened = false;

    const iconSetup = (icon: JSX.IntrinsicElements["icon"]) => {
        opened.subscribe(() => {
            const openedValue = opened.get();
            if (openedValue === name && !iconOpened || openedValue !== name && iconOpened) {
                const step = openedValue === name ? 10 : -10;
                iconOpened = !iconOpened;
                for (let i = 0; i < 9; ++i) {
                    timeout(15 * i, () => {
                        deg += step;
                        icon.css = (`-gtk-icon-transform: rotate(${deg}deg);`);
                    });
                }
            }
        })
    }

    
    return (
        <button
        onClick={() => {
            setOpened(opened.get() === name ? "" : name)
            activate();
        }}
        >
            <icon icon="pan-end-symbolic"
            $={iconSetup}
            />
        </button>
    )
}

export function ArrowToggleButton({
    name,
    icon,
    label,
    activate,
    deactivate,
    activateOnArrow = true,
    condition
}: ArrowButtonProps) {

    return (
        <box class={condition.as((c) => {
            let name = "toggle-button";
            if (c)
                name += " active";
            return name;
        })}> 
            <button
            onClick={(_, event) => {
                if (event.button === Astal.MouseButton.PRIMARY) {
                    setControlCenterStackWidget(name)

                }
                else if (event.button === Astal.MouseButton.SECONDARY) {
                    if (condition.get()) {
                        deactivate();
                        if (opened.get() === name)
                            setOpened("");
                    } else {
                        activate();
                    }
                }

            }}
            >
                <box class="label-box-horizontal"
                hexpand={true}
                >
                    {icon}
                    {label}
                </box>
            </button>
        </box>
    )
}

export function Menu({name, title, child}: MenuProps) {
    return (
        <box name={name} vertical={true} class="menu">
                <button
                onClick={() => setControlCenterStackWidget("controlcenter")}
                halign={Gtk.Align.START}
                class="menu-back"
                >
                    <icon icon="go-previous-symbolic"/>
                </button>
                <label class="menu-title" label={title}
                halign={Gtk.Align.START}
                />
                <scrollable vexpand={true}>
                    {child instanceof Accessor ? child.get() : child}
                </scrollable>
        </box>
    )
}



export function SimpleToggleButton({
    child,
    toggle,
    condition,
}: SimpleToggleProps) {


    return (
        <button class={condition.as((c) => {
            let name = "simple-toggle";
            if (c)
                name += " active";
            return name;
        })}
        onClick={toggle}
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        >
            {child instanceof Accessor ? child.get() : child}
        </button>
    )
}