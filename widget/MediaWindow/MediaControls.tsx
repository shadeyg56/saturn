import { createBinding } from "ags";
import { MediaWidgetProps } from "./Media";
import Mpris from "gi://AstalMpris";
import { Gtk } from "ags/gtk3";

function Play({player}: MediaWidgetProps) {
    return (
        <button class="play-button"
        onClick={() => player.play_pause()}
        >
            <icon
            icon={createBinding(player, "playbackStatus").as((status) => 
                status === Mpris.PlaybackStatus.PLAYING
                ? "media-playback-pause-symbolic"
                : "media-playback-start-symbolic"
            )}
            />
        </button>
    )
}

function Next({player}: MediaWidgetProps) {
    return (
        <button class="next-button"
        onClick={() => player.next()}
        visible={createBinding(player, "canGoNext")}
        >
            <icon
            icon="media-skip-backward-rtl-symbolic"
            />
        </button>
    )
}

function Previous({player}: MediaWidgetProps) {
    return (
        <button class="previous-button"
        onClick={() => player.previous()}
        visible={createBinding(player, "canGoPrevious")}
        >
            <icon
            icon="media-skip-backward-symbolic"
            />
        </button>
    )
}

function Shuffle({player}: MediaWidgetProps) {
    return (
        <button 
        class={createBinding(player, "shuffleStatus").as((status) =>
            status === Mpris.Shuffle.ON ? "shuffle-button active" : "shuffle-button"
        )}
        onClick={() => player.shuffle()}
        visible={createBinding(player, "shuffleStatus").as((status) => 
            status !== Mpris.Shuffle.UNSUPPORTED
        )}
        >
            <icon
            icon="media-playlist-shuffle-symbolic"
            />
        </button>
    )
}

function Loop({player}: MediaWidgetProps) {
    return (
        <button 
        class={createBinding(player, "loopStatus").as((status) =>
            status !== Mpris.Loop.NONE ? "loop-button active" : "loop-button"
        )}
        onClick={() => player.loop()}
        visible={createBinding(player, "loopStatus").as((status) => 
            status !== Mpris.Loop.UNSUPPORTED
        )}
        >
            <icon
            icon={createBinding(player, "loopStatus").as((status) => 
                status === Mpris.Loop.TRACK
                ? "media-playlist-repeat-song-symbolic"
                : "media-playlist-repeat-symbolic"
            )}
            />
        </button>
    )
}


export default function MediaControls({player}: MediaWidgetProps) {
    return (
        <box class="media-controls"
        hexpand={true}
        halign={Gtk.Align.CENTER}
        >
            <Shuffle player={player}/>
            <Previous player={player}/>
            <Play player={player}/>
            <Next player={player}/>
            <Loop player={player}/>
        </box>
    )
}