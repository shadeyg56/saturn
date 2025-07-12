import { monitorFile } from "ags/file";
import GObject, { getter, register, setter } from "ags/gobject";
import { exec, execAsync } from "ags/process";

@register({GTypeName: "Brightness"})
class Brightness extends GObject.Object {

    static instance: Brightness
    static get_default() {
        if (!this.instance)
            this.instance = new Brightness();

        return this.instance;
    }

    #screen = 0;

    #interface = exec("sh -c 'ls -w1 /sys/class/backlight | head -1'");
    #max = Number(exec('brightnessctl max'));

    @getter(Number)
    get screen() { return this.#screen; }

    @setter(Number)
    set screen(percent) {
        if (percent < 0)
            percent = 0;

        if (percent > 1)
            percent = 1;

        execAsync(`brightnessctl s ${percent * 100}% -q`)
            .then(() => {
                this.#screen = percent;
                this.notify('screen');
            })
            .catch(console.error);
    }

    constructor() {
        super();
        const brightness = `/sys/class/backlight/${this.#interface}/brightness`;
        monitorFile(brightness, () => this.#onChange());

        // initialize
        this.#onChange();
    }

    #onChange() {
        this.#screen = Number(exec('brightnessctl get')) / this.#max;
        this.notify('screen');
    }
}

export default Brightness;