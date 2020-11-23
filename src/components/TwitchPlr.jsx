import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../styles/TwitchPlr.css';

let timmy  = null;

class TwitchPlr extends PureComponent {
    constructor(props) {
        window.queueLocked = true;
        const { dispatch } = props;
        super(props);

        dispatch({
            type: 'SHOULD_START_WATCH',
        });

        timmy = setInterval(() => {
            dispatch({
                type: 'FETCH_SHOULD_STOP_WATCH',
            });
        }, 1000);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            id,
            dispatch,
            stopWatchStream = false
        } = this.props;

        if (stopWatchStream === true) {
            window.queueLocked = false;
            dispatch({
                type: 'REMOVE_FROM_QUEUE',
                id,
            });
            if (timmy) {
                clearInterval(timmy);
            }
        }
    }

    componentDidMount() {
        new window.Twitch.Embed("twitch-embed", {
            width: 1400,
            height: 600,
            channel: window.stream,
        });
        const tim = setTimeout(() => {
            const list = document.getElementsByClassName('tw-core-button--primary');
            if (list.length > 0) {
                list.forEach((button) => {
                    button.click();
                });
            }
            clearTimeout(tim);
        }, 1500);
    }

    render() {
        const {
            streamer,
            stopWatchStream = false,
            stream,
        } = this.props;
        console.log('stream => ', streamer, 'stopWatchStream => ', stopWatchStream, 'stream => ', stream);
        window.stream = streamer;
        return (
            <div className="TwitchPlr">
                <div className="TwitchPlr-streamer">
                    {streamer}
                </div>
                <div id="twitch-embed" />
                <div className="TwitchPlr-title">
                    Playing:
                    <span className="TwitchPlr-game">{stream.game_name}</span>
                    - {stream.title}
                </div>
            </div>
        );
    }
}

TwitchPlr.propTypes = {
    streamer: PropTypes.string.isRequired,
    stream: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    stopWatchStream: PropTypes.bool.isRequired,
};

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(TwitchPlr);
