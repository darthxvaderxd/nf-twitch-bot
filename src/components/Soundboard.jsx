import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import '../styles/Soundboard.css';

export const approvedSounds = [
    'boo1',
    'crybaby',
    'doh',
    'doit',
    'fart1',
    'fart2',
    'fart3',
    'odd',
    'oops',
    'scream1',
    'tilted1',
];

export default class Soundboard extends PureComponent {
    constructor(props) {
        super(props);

        const { rest } = props;
        const soundUrl = `/sounds/${rest[0].toLowerCase()}.mp3`;

        this.state = {
            audio: false,
            playing: false,
            soundUrl,
        }
    }

    componentDidMount() {
        const { playing } = this.state;
        this.setState({ audio : document.getElementById('sound') }, () => {
            if (!playing) {
                this.play();
            }
        });
    }

    play() {
        const { audio } = this.state;
        console.log('audio => ', audio);
        audio.play();
        this.setState({ playing: true });
    }

    render() {
        const { soundUrl } = this.state;
        const { rest, displayName } = this.props;
        const sounder = rest[0].toLowerCase();
        return (
            <div className="Soundboard">
                {displayName} has played {sounder}
                <audio id="sound">
                    <source src={soundUrl} />
                </audio>
            </div>
        );
    }
}

Soundboard.propTypes = {
    subscriber: PropTypes.bool.isRequired,
    isMod: PropTypes.bool.isRequired,
    rest: PropTypes.array.isRequired,
    displayName: PropTypes.string.isRequired,
}
