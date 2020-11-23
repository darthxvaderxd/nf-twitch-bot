import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../styles/YouTubePlr.css';

let timmy  = null;

class YouTubePlr extends PureComponent {
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

    render() {
        const { video } = this.props;
        return (
            <div className="YouTubePlr">
                <iframe
                    width="1280"
                    height="720"
                    src={`https://www.youtube.com/embed/${video}?autoplay=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen />
            </div>
        );
    }
}

YouTubePlr.propTypes = {
    video: PropTypes.object.isRequired,
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
})(YouTubePlr);
