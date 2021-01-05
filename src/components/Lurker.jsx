import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { PropTypes } from 'prop-types';
import '../styles/Lurker.css';

let timmy = null;

class Lurker extends PureComponent {
    constructor(props) {
        window.queueLocked = true;
        const { dispatch } = props;
        super(props);

        dispatch({
            type: 'FETCH_FRIENDS',
        });

        timmy = setInterval(() => {
            dispatch({
                type: 'FETCH_FRIENDS',
            });
        }, 1000 * 30);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { friends } = this.props;
        console.log('friends => ', friends);
        if (friends.length > 0) {
            const streams = [...friends].splice(0, 9);
            streams.forEach((friend) => {
                const servedFriends = window.streams || [];
                if (!servedFriends.includes(friend)) {
                    new window.Twitch.Embed(friend, {
                        width: 924,
                        height: 340,
                        channel: friend,
                        parent: [`http://${window.location.hostname}`]
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
            });

            window.streams = [...friends].splice(0, 9);
        }
    }

    render() {
        const { friends } = this.props;
        if (friends.length < 1) {
            return (
                <div className="Lurker">
                    There are no friends live.
                </div>
            );
        }

        const streams = [...friends].splice(0, 9)
            .map((friend) => {
                return (
                    <div className="Lurker-friend">
                        <div className="Lurker-title">
                            {friend}
                        </div>
                        <div
                            id={friend} />
                    </div>
                );
            });
        return (
            <div className="Lurker">
                {streams}
            </div>
        );
    }
}

Lurker.propTypes = {
    dispatch: PropTypes.func.isRequired,
    friends: PropTypes.array.isRequired,
};

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(Lurker);
