import React, { PureComponent } from 'react';

export default class PokerHandRandomGen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            number: 0,
            color: 'red',
        };
    }

    generateNumber() {
        const number = Math.floor(Math.random() * 100);
        let color = 'red';
        if (number >= 75) {
            color = 'green';
        } else if (number >= 50) {
            color = 'orange';
        }

        this.setState({
            number,
            color,
        });
    }

    render() {
        const {
            color,
            number
        } = this.state;
        return (
            <div style={{
                backgroundColor: color,
                border: '1px solid #222',
                color: 'white',
                textAlign: 'center',
            }}
            >
                <h1>{number}</h1>
                <input
                    type="button"
                    value="Generate"
                    onClick={() => this.generateNumber()} />
            </div>
        );
    }
}