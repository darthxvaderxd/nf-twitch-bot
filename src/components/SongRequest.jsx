import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import '../styles/YouTubePlr.css';

let player = null;
let playing = false;
let timmy = null;
let currentVideo = null;
let playingPL = false;

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
            dispatch({
                type: 'FETCH_SHOULD_SKIP_SONG',
            });
        }, 1000);
    }

    componentDidMount() {
        setTimeout(this.playNextSong, 1000);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch, skipSong } = this.props;
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
        }
    }

    playNextSong() {
        const {
            defaultPlaylist,
            dispatch,
            videos,
        } = this.props;
        if (videos.length > 0 && playing === false) {
            currentVideo = videos[0].params;
            playingPL = false;
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
        } else if (player && playingPL === false) {
            playingPL = true;
            player.loadPlaylist({ list: defaultPlaylist });
            player.setLoop(true)
            playing = true;
        } else if (player && playingPL) {
            player.nextVideo();
            playing = true;
        }
    }

    render() {
        return (
            <div className="YouTubePlr" id="yt-player" />
        );
    }
}

SongRequest.propTypes = {
    defaultPlaylist: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    videos: PropTypes.array.isRequired,
    skipSong: PropTypes.array.isRequired,
};

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(SongRequest);
