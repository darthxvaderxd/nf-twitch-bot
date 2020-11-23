import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dice from "./Dice";
import Shoutout from "./Shoutout";
import Soundboard, { approvedSounds } from "./Soundboard";
import Giphy, {approvedGifs} from "./Giphy";
import Hangman from "./Hangman";

const timeout = 10;

class Messages extends PureComponent {
    componentDidMount() {
        const { dispatch, queue } = this.props;
        if (queue.length === 0) {
            dispatch({
                type: 'FETCH_QUEUE',
            });
        }
    }

    removeFromQueue(message) {
        const { dispatch } = this.props;
        const tim = setTimeout(() => {
            if (!window.queueLocked) {
                dispatch({
                    type: 'REMOVE_FROM_QUEUE',
                    id: message.id,
                });
                // memory issues clear it, bad tim
            }
            clearTimeout(tim);
        }, timeout * 1000);
    }

    getComponentForMessage(message) {
        switch (message.params.command) {
            case '!roll':
                return (
                    <Dice
                        displayName={message.params.displayName}
                        numberOfDice={message.params.numberOfDice}
                        rolls={message.params.rolls}
                    />
                );
            case '!so':
                return (
                    <Shoutout {...message.params} />
                )
            case '!sound':
                if (message.params.rest.length > 0 && approvedSounds.includes(message.params.rest[0].toLowerCase())) {
                    return (
                        <Soundboard {...message.params} />
                    );
                }
                break;
            case '!gif':
                if (message.params.rest.length > 0 && approvedGifs.includes(message.params.rest[0].toLowerCase())) {
                    return (
                        <Giphy {...message.params} />
                    );
                }
                break;
            case '!hangman':
                return (
                    <Hangman {...this.props} {...message} />
                );
            default:
                // uh now what, do nothing
                break;
        }
    }

    fetchList() {
        const { dispatch, queue } = this.props;
        if (queue.length === 0) {
            const tim = setTimeout(() => {
                dispatch({
                    type: 'FETCH_QUEUE',
                });
                // memory issues clear it, bad tim
                clearTimeout(tim);
            }, 1000);
        }
    }

    render() {
        const { queue } = this.props;
        if (queue.length > 0) {
            const message = queue[0];
            this.removeFromQueue(message);
            return this.getComponentForMessage(message);
        } else {
            this.fetchList();
        }
        return '';
    }
}

Messages.propTypes = {
    queue: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
}

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(Messages);
