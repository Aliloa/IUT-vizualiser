import { useEffect, useState } from "react";
import s from "./Player.module.scss";
import audioController from "../../utils/AudioController";

const Player = ({ track }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!track) return;

        if (audioController.audio.src !== track.src) {
            audioController.play(track.src);
            setIsPlaying(true);
        }
    }, [track]);

    const togglePlay = () => {
        // Lecture et stop
        if (isPlaying) {
            audioController.audio.pause();
        } else {
            audioController.play(track.src);
        }
        setIsPlaying(!isPlaying);
    };

    if (!track) return null;

    return (
        <div className={s.player}>
            <div className={s.title}>
                <img src={track.cover} alt="" className={s.cover} />
                <div className={s.details}>
                    <span className={s.trackName}>{track.title}</span>
                </div>
                <button onClick={togglePlay}>
                {isPlaying ? "STOP" : "RESTART"}
            </button>
            </div>
        </div>
    );
};

export default Player;
