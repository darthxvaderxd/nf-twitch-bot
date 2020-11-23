import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import '../styles/Shoutout.css';

export default class Shoutout extends PureComponent {
    render() {
        const { shoutOut, stream, user } = this.props;
        console.log(
            'shoutOut => ', shoutOut,
            'stream => ', stream,
            'user => ', user,
        );
        let picture = '';
        if (user) {
            picture = (
                <>
                    <img className="ShoutOut-image" src={user.profile_image_url} alt="image" />
                    <br />
                </>
            );
        }


        let extra = '';
        if (stream) {
            extra = `Last seen playing ${stream.game_name}`;
        }

        return (
            <div className="ShoutOut">
                {picture}
                Please Go and checkout {shoutOut}. <br />
                You can see them at when they are live <br />
                https://twitch.tv/{shoutOut} <br />
                {extra}
            </div>
        )
    }
}

Shoutout.propTypes = {
    shoutOut: PropTypes.string.isRequired,
    user: PropTypes.object,
    stream: PropTypes.object,
};

Shoutout.defaultProps = {
    user: undefined,
    stream: undefined,
};
