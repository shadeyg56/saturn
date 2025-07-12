import Mpris from "gi://AstalMpris";
import { createBinding, createComputed, createState, With } from "ags";
import { Gtk } from "ags/gtk3";
import Pango from "gi://Pango";
import { toggleWindow, lookupIcon } from "saturn/utils";

const media = Mpris.get_default();

export const [activePlayer, setActivePlayer] = createState(false);


function PlayerIcon(player: Mpris.Player, { symbolic = true, ...props } = {}) {
    
    const iconName = createBinding(player, "entry").as((entry) => {
        let name = `${entry}${symbolic ? "-symbolic" : ""}`;
        name = lookupIcon(name) ? name : "emblem-music-symbolic";
        return name;
    })
    
    return (
        <icon class="player-icon" icon={iconName}/>
    )
}

function NowPlaying(player: Mpris.Player) {

    const [currentTrack, setCurrentTrack] = createState("");

    const setup = (revealer: Gtk.Revealer) => {
        const titleBinding = createBinding(player, "title");
        titleBinding.subscribe(() => {
            const title = titleBinding.get();
            setCurrentTrack(title);
            revealer.revealChild = true;
            const timeoutTrack = currentTrack.get();
            setTimeout(() => {
                if (timeoutTrack === currentTrack.get())
                    if (revealer)
                        revealer.revealChild = false;
            }, 3000)
        })
    }

    // const titleBind = Variable.derive([bind(player, "title"), bind(player, "artist")], (title, artist) =>
    //     `${artist} - ${title}`
    // )
    const titleBind = createComputed(
        [createBinding(player, "title"), createBinding(player, "artist")],
        (title, artist) => `${artist} - ${title}`
    );

    return (
        <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        $={setup}
        >
            <label class="now-playing"
            ellipsize={Pango.EllipsizeMode.END}
            maxWidthChars={25}
            label={titleBind}
            />
        </revealer>
    )
}

export default function MediaIndicator() {

    const mediaPlayers = createBinding(media, "players");

    return (
        <eventbox
        onHover={() => toggleWindow("media")}
        onHoverLost={(widget, event) => {
            const x = event.x;
            const y = event.y;
            const w = widget.get_allocation().width;
            const h = widget.get_allocation().height;
            if ((x < 0 && y < h/2)|| (x > w && y < h/2) || y < 5) {
                toggleWindow("media")
            }
        }}
        >
            <box>
                <With value={mediaPlayers}>
                    {(players) => {
                        const player = players.find((p) => p.get_entry() === "spotify") ?? players[0];

                        if (!player) {
                            setActivePlayer(false);
                            return "";
                        }

                        setActivePlayer(true);

                        return (
                            <box>
                                {PlayerIcon(player)}
                                {NowPlaying(player)}
                            </box>
                        );
                    }}
                </With>
            </box>
         </eventbox>
    )
}