import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import "../styles/Trivia.css";

class TriviaAdmin extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctAnswer: 1,
        };
    }

    clearQuestion() {
        this.setState({
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctAnswer: 1,
        });
    }

    saveQuestion() {
        const { dispatch } = this.props;
        dispatch({
            type: 'SAVE_TRIVIA_QUESTION',
            question: { ...this.state },
        });
        this.clearQuestion();
    }

    render () {
        const {
            correctAnswer,
            question,
            option1,
            option2,
            option3,
            option4,
        } = this.state;
        return (
            <div className="TriviaAdmin">
                <div className="TriviaAdmin-label">
                    Next Question
                </div>
                <div className="TriviaAdmin-input">
                    <textarea
                        id="question-text"
                        value={question}
                        onBlur={(e) => {
                            this.setState({ question: e.target.value });
                        }}
                        onChange={(e) => {
                            this.setState({ question: e.target.value });
                        }}
                    />
                </div>
                <div className="TriviaAdmin-label">
                    Option 1
                </div>
                <div className="TriviaAdmin-input">
                    <input
                        type="text"
                        id="option1"
                        value={option1}
                        onBlur={(e) => {
                            this.setState({ option1: e.target.value });
                        }}
                        onChange={(e) => {
                            this.setState({ option1: e.target.value });
                        }}
                    />
                </div>
                <div className="TriviaAdmin-label">
                    Option 2
                </div>
                <div className="TriviaAdmin-input">
                    <input
                        type="text"
                        id="option2"
                        value={option2}
                        onBlur={(e) => {
                            this.setState({ option2: e.target.value });
                        }}
                        onChange={(e) => {
                            this.setState({ option2: e.target.value });
                        }}
                    />
                </div>
                <div className="TriviaAdmin-label">
                    Option 3
                </div>
                <div className="TriviaAdmin-input">
                    <input
                        type="text"
                        id="option3"
                        value={option3}
                        onBlur={(e) => {
                            this.setState({ option3: e.target.value });
                        }}
                        onChange={(e) => {
                            this.setState({ option3: e.target.value });
                        }}
                    />
                </div>
                <div className="TriviaAdmin-label">
                    Option 4
                </div>
                <div className="TriviaAdmin-input">
                    <input
                        type="text"
                        id="option4"
                        value={option4}
                        onBlur={(e) => {
                            this.setState({ option4: e.target.value });
                        }}
                        onChange={(e) => {
                            this.setState({ option4: e.target.value });
                        }}
                    />
                </div>
                <div className="TriviaAdmin-label">
                    Correct Answer
                </div>
                <div className="TriviaAdmin-input">
                    <select
                        id="select"
                        value={correctAnswer}
                        onChange={(e => {
                            this.setState({ correctAnswer: e.target.value });
                        })}>
                        <option value={1}>Option 1</option>
                        <option value={2}>Option 2</option>
                        <option value={3}>Option 3</option>
                        <option value={4}>Option 4</option>
                    </select>
                </div>
                <div className="TriviaAdmin-label">
                    <input
                        type="button"
                        value="Clear"
                        onClick={(e) => {
                            this.clearQuestion();
                        }}
                    />
                    <input
                        type="button"
                        value="Add Question"
                        onClick={(e) => {
                            this.saveQuestion();
                        }}
                    />
                </div>
            </div>
        );
    }
}

TriviaAdmin.propTypes = {
    dispatch: PropTypes.func.isRequired,
}

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(TriviaAdmin);
