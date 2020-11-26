import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import "../styles/Trivia.css";

let timmy = null;
let triviaTimer = null;

class TriviaGame extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestion: 0,
            seconds: 60,
            scoring: false,
            gameOver: false,
        };
    }

    componentDidMount() {
        timmy = setInterval(() => {
            this.requestTriviaData();
        }, 1000);
    }

    requestTriviaData() {
        const { dispatch, triviaQuestions } = this.props;
        const { scoring } = this.state;

        if (triviaQuestions.length === 0) {
            dispatch({ type: 'FETCH_TRIVIA_QUESTIONS' });
        }
        if (!scoring) {
            dispatch({type: 'FETCH_TRIVIA_ANSWERS'});
        }
        dispatch({ type: 'FETCH_TRIVIA_STATE' });
    }

    triviaTimer() {
        const { seconds, scoring, currentQuestion } = this.state;
        const {
            dispatch,
            triviaQuestions: questions,
            triviaPaused,
        } = this.props;

        if (triviaPaused) {
            if (seconds !== 60) {
                this.setState({ seconds: 60 });
            }
        } else if (seconds === 0) {
            if (scoring) {
                dispatch({
                    type: 'CLEAR_TRIVIA_ANSWERS',
                });
                this.setState({
                    seconds: 60,
                    scoring: false,
                    currentQuestion: currentQuestion + 1,
                }, () => {
                    if (currentQuestion === questions.length) {
                        this.setState({ gameOver: true });
                    }
                });
            } else {
                this.setState({
                    seconds: 60,
                    scoring: true,
                });
            }
        } else {
            this.setState({ seconds: seconds - 1 });
        }
    }

    getQuestionCode() {
        const { currentQuestion, scoring, seconds } = this.state;
        const { triviaQuestions: questions } = this.props;
        const {
            question,
            option1,
            option2,
            option3,
            option4,
            correctAnswer,
        } = questions[currentQuestion];

        return (
            <>
                <div className="TriviaGame-question">
                    [{currentQuestion + 1} of {questions.length}] [{seconds}]<br />
                    {question}
                </div>
                <div className="TriviaGame-answers">
                    <div className={correctAnswer === "1" && scoring
                        ? "TriviaGame-answer right"
                        : "TriviaGame-answer"}>
                        [!t a]. {option1}
                    </div>
                    <div className={correctAnswer === "2" && scoring
                        ? "TriviaGame-answer right"
                        : "TriviaGame-answer"}>
                        [!t b]. {option2}
                    </div>
                    <div className={correctAnswer === "3" && scoring
                        ? "TriviaGame-answer right"
                        : "TriviaGame-answer"}>
                        [!t c]. {option3}
                    </div>
                    <div className={correctAnswer === "4" && scoring
                        ? "TriviaGame-answer right"
                        : "TriviaGame-answer"}>
                        [!t d]. {option4}
                    </div>
                </div>
            </>
        );
    }

    render() {
        const { scoring } = this.state;
        const {
            triviaQuestions: questions,
            triviaAnswers: answers,
            playingTrivia,
            triviaPaused,
            dispatch,
        } = this.props;

        const answersReact = answers.map((answer, id) => {
            return (
                <div key={id} className="TriviaGame-locked-in-answer">
                    {answer.params.answer.displayName}
                </div>
            );
        });

        if (scoring) {
            return (
                <div className="TriviaGame">
                    <div className="TriviaGame-question">
                        Scoring question
                    </div>
                    {this.getQuestionCode()}
                </div>
            );
        } else if (questions.length > 0 && playingTrivia && !triviaPaused) {
            if (triviaTimer === null) {
                triviaTimer = setInterval(() => this.triviaTimer(), 1000);
            }

            return (
                <>
                    <div className="TriviaGame">
                        {this.getQuestionCode()}
                    </div>
                    {answers.length > 0 && (
                        <div className="TriviaGame-locked-in">
                            {answersReact}
                        </div>
                    )}
                </>
            );
        } else if (triviaPaused) {
            if (answers.length > 0) {
                dispatch({
                    type: 'CLEAR_TRIVIA_ANSWERS',
                });
            }

            return (
                <div className="TriviaGame">
                    <div className="TriviaGame-question">
                        One moment. Trivia is currently paused.
                    </div>
                </div>
            );
        }

        if (triviaTimer) {
            clearInterval(triviaTimer);
        }

        return (
            <div className="TriviaGame">
                <div className="TriviaGame-question">
                    Hey everybody the next round of trivia is about to start!
                </div>
            </div>
        );
    }
}

TriviaGame.propTypes = {
    triviaQuestions: PropTypes.array.isRequired,
    triviaAnswers: PropTypes.array.isRequired,
    playingTrivia: PropTypes.bool.isRequired,
    triviaPaused: PropTypes.bool.isRequired,
};

export default connect((state, props) => {
    // there could be logic here one day so that is why
    return {
        ...state,
        ...props,
    };
})(TriviaGame);
