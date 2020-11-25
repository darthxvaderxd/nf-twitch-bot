import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import '../styles/YouTubePlr.css';

let player = null;
let playing = false;
let paused = false;
let timmy = null;
let currentVideo = null;

class SongRequest extends PureComponent {
    constructor(props) {
        const { dispatch } = props;
        super(props);

        dispatch({
            type: 'FETCH_SONG_QUEUE',
        });
        dispatch({
            type: 'FETCH_SHOULD_SKIP_SONG',
        });

        timmy = setInterval(() => {
            dispatch({
                type: 'FETCH_SONG_QUEUE',
            });
        }, 1000);
    }

    componentDidMount() {
        setTimeout(this.playNextSong, 1000);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch, skipSong, pauseSong } = this.props;
        if (paused && pauseSong === false) {
            player.playVideo();
            paused = false;
        }
        if (skipSong) {
            dispatch({type: 'SHOULD_NOT_SKIP_SONG'});
            dispatch({
                type: 'REMOVE_SONG_FROM_QUEUE',
                video: currentVideo,
            });
            playing = false;
            setTimeout(this.playNextSong, 500);
        } else if (playing === false) {
            this.playNextSong();
        } else if (pauseSong) {
            paused = true;
            player.pauseVideo();
        }
    }

    playNextSong() {
        const {
            dispatch,
            videos,
        } = this.props;
        if (videos.length > 0 && playing === false) {
            currentVideo = videos[0].params;
            if (player === null) {
                player = new window.YT.Player('yt-player', {
                    width: 1280,
                    height: 720,
                    videoId: currentVideo.videoId,
                    events: {
                        onReady: (event) => {
                            event.target.playVideo();
                            playing = true;
                        },
                        onStateChange: (event) => {
                            if (event.data === 0) {
                                dispatch({
                                    type: 'REMOVE_SONG_FROM_QUEUE',
                                    video: currentVideo,
                                });
                                playing = false;
                                window.setTimeout(() => {
                                    this.playNextSong();
                                }, 500)
                            }
                        }
                    }
                });
            } else {
                player.loadVideoById({'videoId': currentVideo.videoId});
                playing = true;
            }
        }
    }

    render() {
        return (
            <div className="YouTubePlr" id="yt-player" />
        );
    }
}

SongRequest.propTypes = {
    dispatch: PropTypes.func.isRequired,
    videos: PropTypes.array.isRequired,
    skipSong: PropTypes.bool.isRequired,
    pauseSong: PropTypes.bool.isRequired,
};

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(SongRequest);
