import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import "../styles/Trivia.css";

let timmy = null;
let triviaTimer = null;
const TRIVIA_SECONDS = 60;

class TriviaGame extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestion: 0,
            seconds: TRIVIA_SECONDS,
            scoring: false,
            gameOver: false,
        };

        this.setScoringData( { scores: {} });
    }

    componentDidMount() {
        timmy = setInterval(() => {
            this.requestTriviaData();
        }, 100);
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

    getScoringData() {
        try {
            return JSON.parse(localStorage.getItem('scores'));
        } catch(e) {
            return { scores: {} };
        }
    }

    setScoringData(storedData) {
        localStorage.setItem('scores', JSON.stringify(storedData));
    }

    scoreTriviaQuestion() {
        const { triviaAnswers: answers, triviaQuestions: questions } = this.props;
        const { currentQuestion } = this.state;
        const storedData = this.getScoringData();
        const question = questions[currentQuestion];
        if (question) {
            const {correctAnswer} = question;

            answers.forEach((a) => {
                const {answer, displayName} = a.params.answer;
                const index = answers.findIndex((a) => a.params.answer.displayName === displayName);
                const answerPlacement = answers.length - index;
                let mappedAnswer = '';
                switch (answer.toLowerCase()) {
                    case 'a':
                        mappedAnswer = "1";
                        break;
                    case 'b':
                        mappedAnswer = "2";
                        break;
                    case 'c':
                        mappedAnswer = "3";
                        break;
                    case 'd':
                        mappedAnswer = "4";
                        break;
                    default:
                        mappedAnswer = "-1";
                }

                if (typeof storedData.scores[displayName] === 'undefined') {
                    storedData.scores[displayName] = 0;
                }

                if (Number(mappedAnswer) === Number(correctAnswer)) {
                    const multiplier = (answerPlacement / answers.length);
                    storedData.scores[displayName] += Math.ceil((multiplier > .25 ? multiplier : .25) * 1000);
                }
            });
            this.setScoringData(storedData);
        }
    }

    triviaTimer() {
        const {
            seconds,
            scoring,
            currentQuestion,
            gameOver,
        } = this.state;
        const {
            dispatch,
            triviaQuestions: questions,
            triviaPaused,
        } = this.props;

        if (gameOver) {
            this.setState({ scoring: false, seconds: TRIVIA_SECONDS });
            return;
        }

        if (triviaPaused) {
            if (seconds !== TRIVIA_SECONDS) {
                this.setState({ seconds: TRIVIA_SECONDS });
            }
        } else if (seconds === 0) {
            if (scoring) {
                dispatch({
                    type: 'CLEAR_TRIVIA_ANSWERS',
                });
                this.setState({
                    seconds: TRIVIA_SECONDS,
                    scoring: false,
                    currentQuestion: currentQuestion + 1,
                }, () => {
                    if (currentQuestion === questions.length) {
                        this.setState({ gameOver: true });
                    }
                });
            } else {
                this.setState({
                    seconds: Math.floor(TRIVIA_SECONDS / 2),
                    scoring: true,
                }, () => {
                    this.scoreTriviaQuestion();
                });
            }
        } else {
            this.setState({ seconds: seconds - 1 });
        }
    }

    getQuestionCode() {
        const { currentQuestion, scoring, seconds } = this.state;
        const { triviaQuestions: questions } = this.props;
        if (questions.length > 0 && currentQuestion < questions.length) {
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
                        [{currentQuestion + 1} of {questions.length}] [{seconds}]<br/>
                        {question}
                    </div>
                    <div className="TriviaGame-answers">
                        <div className={Number(correctAnswer) === 1 && scoring
                            ? "TriviaGame-answer right"
                            : "TriviaGame-answer"}>
                            [!t a]. {option1}
                        </div>
                        <div className={Number(correctAnswer) === 2 && scoring
                            ? "TriviaGame-answer right"
                            : "TriviaGame-answer"}>
                            [!t b]. {option2}
                        </div>
                        <div className={Number(correctAnswer) === 3 && scoring
                            ? "TriviaGame-answer right"
                            : "TriviaGame-answer"}>
                            [!t c]. {option3}
                        </div>
                        <div className={Number(correctAnswer) === 4 && scoring
                            ? "TriviaGame-answer right"
                            : "TriviaGame-answer"}>
                            [!t d]. {option4}
                        </div>
                    </div>
                </>
            );
        } else {
            return (<>There are no questions</>)
        }
    }

    getScoreTicker() {
        const scoringData = this.getScoringData();
        const keys = Object.keys(scoringData.scores);
        if (typeof keys !== 'undefined' && keys.length > 0) {
            const scores = keys.map((displayName) => ({ displayName, score: scoringData.scores[displayName] }))
                .sort((a, b) => {
                    if (a.score > b.score) {
                        return -1;
                    } else if (a.score < b.score) {
                        return 1;
                    }
                    return 0;
                }).map((score, place) => {
                    return (
                        <span>
                            {place + 1}. {score.displayName}: {score.score} |&nbsp;
                        </span>
                    );
                });
            return (
                <marquee direction="left" className="TriviaGame-marquee">
                    {scores}
                </marquee>
            );
        } else {
            return (
                <marquee direction="left" className="TriviaGame-marquee">
                    No scores yet...
                </marquee>
            )
        }
    }

    render() {
        const { scoring, gameOver } = this.state;
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

        let scores = '';
        if (gameOver) {
            const scoringData = this.getScoringData();
            const keys = Object.keys(scoringData.scores);
            if (typeof keys !== 'undefined' && keys.length > 0) {
                scores = keys.map((displayName) => ({displayName, score: scoringData.scores[displayName]}))
                    .sort((a, b) => {
                        if (a.score > b.score) {
                            return -1;
                        } else if (a.score < b.score) {
                            return 1;
                        }
                        return 0;
                    }).map((score, place) => {
                        return (
                            <div>
                                {place + 1}. {score.displayName}: {score.score}
                            </div>
                        );
                    });
            }
            return (
                <>
                    <div className="TriviaGame">
                        <div className="TriviaGame-question">
                            This game is over, here are the scores
                        </div>
                        <div className="TriviaGame-answers">
                            {scores}
                        </div>
                    </div>

                </>
            )
        } else if (scoring && questions.length > 0) {
            return (
                <>
                    <div className="TriviaGame">
                        <div className="TriviaGame-question">
                            Scoring question
                        </div>
                        {this.getQuestionCode()}
                    </div>
                    {this.getScoreTicker()}
                </>
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
                    {this.getScoreTicker()}
                </>
            );
        } else if (triviaPaused) {
            if (answers.length > 0) {
                dispatch({
                    type: 'CLEAR_TRIVIA_ANSWERS',
                });
            }

            return (
                <>
                    <div className="TriviaGame">
                        <div className="TriviaGame-question">
                            One moment. Trivia is currently paused.
                        </div>
                    </div>
                    {this.getScoreTicker()}
                </>
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
