import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import "../styles/Trivia.css";

class TriviaGame extends PureComponent {
    render() {
        return (
            <h1>test</h1>
        );
    }
}

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(TriviaGame);
