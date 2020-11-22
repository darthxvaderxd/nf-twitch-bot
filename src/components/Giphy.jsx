import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import '../styles/Giphy.css';

export const approvedGifs = [
    'catdance1',
    'catdance2',
    'madbro',
    'nailedit',
    'salty',
    'tableflip1',
    'tableflip2',
    'tilted',
];

export default class Giphy extends PureComponent {
    render() {
        const { displayName, rest } = this.props;
        const imageLink = `/images/giphy/${rest[0].toLowerCase()}.gif`;
        return (
            <div className="Giphy">
                {/*<div className="Giphy-text">*/}
                {/*    {displayName} has requested gif {rest[0].toLowerCase()}*/}
                {/*</div>*/}
                <div className="Giphy-container">
                    <img src={imageLink} alt="Image" />
                </div>
            </div>
        )
    }
}

Giphy.propTypes = {
    displayName: PropTypes.string.isRequired,
    rest: PropTypes.array.isRequired,
}
