import { execAsync } from "ags/process";


export default function PowerButton() {

    const handleClick = () => {
        execAsync(["adios", "--systemd"]);
    }

    return (
        <button class="powerButton barIcon"
        onClick={handleClick}
        >
            <icon icon="system-shutdown-symbolic"/>
        </button>
    )
}