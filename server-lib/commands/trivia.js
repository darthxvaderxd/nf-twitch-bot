const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let playingTrivia = false;
let triviaPaused = false;

if (fs.existsSync(path.join(__dirname, '../../dist/trivia/_playing.json'))) {
    const data = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../../dist/trivia/_playing.json'), 'utf8')
    );
    playingTrivia = data.playingTrivia;
}

if (fs.existsSync(path.join(__dirname, '../../dist/trivia/_paused.json'))) {
    const data = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../../dist/trivia/_paused.json'), 'utf8')
    );
    triviaPaused = data.triviaPaused;
}

const startTrivia = (client, target, params) => {
    if (playingTrivia === false) {
        const allQuestions = [];

        // yes I know this is blocking.... but only one user should be needing it so idc
        fs.readdirSync(path.join(__dirname, '../../dist/trivia_questions')).forEach((file) => {
            const filePath = path.join(__dirname, `../../dist/trivia_questions/${file}`);
            allQuestions.push(require(filePath));
        });

        const shuffleArray = (array) => {
            array.sort(() => Math.random() - 0.5);
        };

        shuffleArray(allQuestions);
        const triviaQuestions = allQuestions.length < 10
            ? allQuestions
            : allQuestions.splice(0, 10);

        fs.writeFileSync(path.join(__dirname, '../../dist/trivia/game.json'), JSON.stringify({ triviaQuestions }));
        fs.writeFileSync(path.join(__dirname, '../../dist/trivia/_playing.json'), JSON.stringify({ playingTrivia: true }));
        fs.writeFileSync(path.join(__dirname, '../../dist/trivia/_paused.json'), JSON.stringify({ triviaPaused: false }));
        triviaPaused = false;

        client.say(target, "Trivia is starting. You will have one minute to answer each question. To answer !t <choice>");
    } else {
        client.say(target, "Trivia is already going on silly. To unpause do !trivia resume");
    }
};

const pauseTrivia = (client, target, params) => {
    triviaPaused = true;
    fs.writeFileSync(path.join(__dirname, '../../dist/trivia/_paused.json'), JSON.stringify({ triviaPaused: true }));
    client.say(target, "Trivia is Paused. Thank you all for playing and being patient while we wait!");
};

const stopTrivia = (client, target, params) => {
    fs.unlinkSync(path.join(__dirname, '../../dist/trivia/game.json'));

    fs.readdirSync(path.join(__dirname, '../../dist/trivia/answers')).forEach((file) => {
        const filePath = path.join(__dirname, `../../dist/trivia/answers/${file}`);
        fs.unlinkSync(filePath);
    });
    fs.writeFileSync(path.join(__dirname, '../../dist/trivia/_playing.json'), JSON.stringify({ playingTrivia: false }));
    client.say(target, "Trivia is Ending. Thank you all for playing!");
};

const resumeTrivia = (client, target, params) => {
    triviaPaused = false;
    fs.writeFileSync(path.join(__dirname, '../../dist/trivia/_paused.json'), JSON.stringify({ triviaPaused: false }));
    client.say(target, "Trivia has resumed. Thank you all for waiting! To answer !t <choice>");
};

const saveTriviaAnswers = (answer) => {
    const now = new Date();
    fs.writeFileSync(
        path.join(__dirname, `../../dist/trivia/answers/${now.valueOf()}-${uuidv4()}.json`),
        JSON.stringify({ answer }),
    );
}

module.exports = [
    {
        command: '!trivia',
        cb: (client, params, target) => {
            if (params.isMod) {
                const action = params.rest.length > 0
                    ? params.rest[0].toLowerCase()
                    : 'start';

                switch (action) {
                    case 'start':
                        startTrivia(client, target, params);
                        break;
                    case 'pause':
                        pauseTrivia(client, target, params);
                        break;
                    case 'stop':
                        stopTrivia(client, target, params);
                        break;
                    case 'resume':
                        resumeTrivia(client, target, params);
                        break;
                }
            }
        },
        modOnly: true,
        coolDown: 10,
    },
    {
        command: '!t',
        cb: (client, params, target) => {
            if (params.rest.length > 0) {
                saveTriviaAnswers({
                    answer: params.rest[0],
                    displayName: params.displayName,
                });
            }
        },
        coolDown: 0,
    }
]
