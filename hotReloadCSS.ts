import App from "ags/gtk3/app";
import { getFiles } from "saturn/utils";
import { monitorFile } from "ags/file";
import { execAsync } from "ags/process";

export default function hotReloadCSS() {
    print("CSS Hot-reload Enabled")

    const compileScss = () => {
        const outFile = "/tmp/saturn.css"
        const main = `${cssDir}/main.scss`
        execAsync(["sass", main, outFile])
        .then(() => {
            App.apply_css(outFile, true)
            print("CSS Reloaded")
        })
        .catch((error) => {
            print(`Failed to compile CSS: ${error}`)
        })
    }


    const cssDir = `${SRC}/style`


    const cssFiles = getFiles(cssDir).filter((file) => file.endsWith(".scss") || file.endsWith(".css"))

    cssFiles.forEach((file) => {
        monitorFile(file, compileScss)
    })

}