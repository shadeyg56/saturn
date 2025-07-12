import { Gtk } from "ags/gtk3";
import { createBinding } from "ags";
import cairo from "cairo";
import Cava from "gi://AstalCava";
import { activePlayer } from "./Media";

const cava = Cava.get_default()!;

export default function Visualizer() {

    const values = createBinding(cava, "values");

    const setup = (self: Gtk.DrawingArea) => {

        self.connect("draw", (_, cr: cairo.Context) => {
            
            cr.setSourceRGB(198/255, 160/255, 246/255);
            const width = self.get_allocated_width()/cava.bars;
            const height = self.get_allocated_height()-15;
            let currentX = 0;
            let currentValues = values.get();
            if (cava.get_stereo()) {
                const right = currentValues.splice(0, cava.bars/2);
                currentValues.reverse();
                currentValues = currentValues.concat(right);
            }
            currentValues.forEach((value) => {
                cr.rectangle(currentX, 32, width, value*-1*height);
                cr.fill();
                currentX += width;
            })
            cr.stroke();

        })


        cava.connect("notify::values", () => self.queue_draw());
        cava.set_stereo(true);
        
    }



    return (
        <box class={"cava"} expand={true} visible={activePlayer}>
            <drawingarea expand={true} $={setup}/>
        </box>
    )
}