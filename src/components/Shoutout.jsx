import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import '../styles/Shoutout.css';

export default class Shoutout extends PureComponent {
    render() {
        const { shoutOut } = this.props;

        return (
            <div className="ShoutOut">
                Please do me a huge favor! <br />
                Go and checkout {shoutOut}. <br />
                You can see them at <br />
                https://twitch.tv/{shoutOut} <br />
                Look for the link is in chat! <br />
            </div>
        )
    }
}

Shoutout.propTypes = {
    shoutOut: PropTypes.string.isRequired,
}
