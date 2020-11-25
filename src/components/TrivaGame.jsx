import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import "../styles/Trivia.css";

class TriviaGame extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestion: 0,
        };
    }

    render() {
        const { currentQuestion } = this.state;
        const { triviaQuestions: questions } = this.props;
        const {
            question,
            option1,
            option2,
            option3,
            option4,
        } = questions[currentQuestion];

        return (
            <div className="TriviaGame">
                <div className="TrivaGame-question">
                    {question}
                </div>
                <div className="TrivaGame-answers">
                    <div className="TrivaGame-answer">
                        a. {option1}
                    </div>
                    <div className="TrivaGame-answer">
                        b. {option2}
                    </div>
                    <div className="TrivaGame-answer">
                        c. {option3}
                    </div>
                    <div className="TrivaGame-answer">
                        d. {option4}
                    </div>
                </div>
            </div>
        );
    }
}

TriviaGame.propTypes = {
    triviaQuestions: PropTypes.array.isRequired,
    triviaAnswers: PropTypes.array.isRequired,
};

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(TriviaGame);
