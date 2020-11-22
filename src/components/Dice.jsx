import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import '../styles/Dice.css';

export default class Dice extends PureComponent {
    render() {
        const { displayName, numberOfDice, rolls } = this.props;
        const word = numberOfDice === 1 ? 'die' : 'dice';
        const sum = rolls.reduce((a, b) => a + b);
        const extra = numberOfDice === 1 ? '' : `totalling ${sum}`
        return (
            <div className="Dice">
                <div className="Dice-message">
                    {displayName} has rolled {numberOfDice} {word} {extra}
                </div>
                <div className="Dice-container">
                    {rolls.map((roll, i) =>  (
                        <div className="Dice-die">
                            <img className="Dice-die-img" src={`/images/dice/${roll}.png`}  alt={roll} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

Dice.propTypes = {
    displayName: PropTypes.string.isRequired,
    numberOfDice: PropTypes.number.isRequired,
    rolls: PropTypes.array.isRequired,
};
