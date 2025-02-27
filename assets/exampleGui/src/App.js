import React, { Component } from "react";
import FurhatGUI from "furhat-gui";
import rangeSlider from "./RangeSlider";
import { Grid, Row, Col, Button, FormControl } from "react-bootstrap";

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

const scenarios = [
    {emotion: "Joy", intensity: "100", text:" I won first place in the school science fair today! When they called my name, everyone clapped, and I felt incredibly proud. My parents were so happy too—it was a moment I’ll never forget. "},
    {emotion: "Sadness", intensity: "0", text:"I accidentally spilled a few drops of juice on my homework just before handing it in. The teacher didn’t seem to notice, but I was frustrated because I’d put a lot of effort into it.  "},
    {emotion: "Anger", intensity: "100", text:"My younger sibling accidentally deleted a project I’d been working on for hours. I felt so frustrated that I had to walk away to calm down. "},
    {emotion: "Fear", intensity: "100", text:" I was walking home late in the evening, and I thought I heard footsteps behind me. My heart started racing, and I felt scared until I got home safely. "},
    {emotion: "Disgust", intensity: "0", text:" I found an old sandwich in my backpack that I had forgotten about. It smelled bad, so I threw it away."},
    {emotion: "Joy", intensity: "0", text:" My teacher gave me a small compliment in class for answering a difficult question. It wasn’t a big deal, but it gave me a nice feeling inside. "},
    {emotion: "Surprise", intensity: "100", text:"I came home and found a surprise party waiting for me! All my friends and family were there, and I had no idea they had planned something so special. "},
    {emotion: "Anger", intensity: "0", text:"I don’t play video games very often but I was playing a game online, and another player wasn’t following the rules. I got frustrated and stopped playing because it wasn’t fair.  "},
];
const shuffledScenarios = shuffle(scenarios);

const emotionOptions = ["E1", "E2", "E3", "E4", "E5", "E6", "Neutral"];


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: "participantID", // Start at participant ID screen
            iteration: 1,
            speaking: false,
            scenarioEmotion: "",
            scenarioIntensity: 0,
            scenarioText: "",
            emotionOptions: shuffle(emotionOptions),
            selectedEmotion: "",
            intensity: 50,
            participantID: "",
            question1: "",
            question2: "",
            responses: [],
            enteredId: false,
            triedEmotions: new Set(),
            movedSlider: false// Store user responses
        };
        this.furhat = null;
    }

    componentDidMount() {
        FurhatGUI()
            .then((connection) => {
                this.furhat = connection;
                this.setupSubscriptions();
                this.loadScenario();
            })
            .catch(console.error);
    }

    setupSubscriptions() {
        this.furhat.subscribe("SenseSkillGUIConnected", () => {
            console.log("Furhat GUI connected");
        });
        this.furhat.subscribe("SpeechDone", () => {
            this.setState({ speaking: false });
        });
    }

    handleQuestionChange = (event, question) => {
        this.setState({ [question]: event.target.value });
    };

    loadScenario() {
        console.log(shuffledScenarios);
        const scenarioIndex = (this.state.iteration - 1) % scenarios.length;
        this.setState({ scenarioText: shuffledScenarios[scenarioIndex].text, scenarioEmotion: shuffledScenarios[scenarioIndex].emotion, scenarioIntensity: shuffledScenarios[scenarioIndex].intensity});
    }

    downloadJSON(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    handleNextScreen = () => {
        const { currentScreen, iteration, responses, selectedEmotion, intensity, participantID, question1, question2, triedEmotions, movedSlider, enteredId  } = this.state;

        if (currentScreen === "scenarioRating" && triedEmotions.size < this.state.emotionOptions.length) {
            alert("Please try all the emotion options before proceeding.");
            return;
        }

        if (currentScreen === "participantID" && !enteredId) {
            alert("Please enter your participant id before proceeding.");
            return;
        }

        if (currentScreen === "scenarioScaling" && !movedSlider) {
            alert("Please move the slider up and down before proceeding.");
            return;
        }

        if (currentScreen === "scenarioQuestions" && (question1.trim() === "" || question2.trim() === "")) {
            alert("Please answer both questions before proceeding.");
            return;
        }

        if (currentScreen === "participantID") {
            this.setState({ currentScreen: "scenarioDisplay" });
        } else if (currentScreen === "scenarioDisplay") {
            this.setState({ currentScreen: "scenarioRating" });
        } else if (currentScreen === "scenarioRating" && selectedEmotion !== "Neutral") {
            this.setState({ currentScreen: "scenarioScaling" });
        } else if (currentScreen === "scenarioScaling" || (currentScreen === "scenarioRating" && selectedEmotion === "Neutral")) {
            this.setState({ currentScreen: "scenarioQuestions" });
        } else if (currentScreen === "scenarioQuestions") {
            const updatedResponses = [
                ...responses,
                { participantID, scenarioEmotion: this.state.scenarioEmotion, scenarioIntensity: this.state.scenarioIntensity, scenarioText: this.state.scenarioText, emotion: selectedEmotion, intensity, question1, question2}
            ];
            if (iteration < 8) {
                this.setState(
                    { iteration: iteration + 1, currentScreen: "scenarioDisplay", responses: updatedResponses, intensity: 50, question1: "", question2: "" },
                    this.loadScenario
                );
            } else {
                this.setState({ currentScreen: "done", responses: updatedResponses }, () => {
                    this.downloadJSON(`${participantID}.json`, updatedResponses);
                });
                this.furhat.send({
                    event_name: "endingScreen"
                });
            }
            this.furhat.send({
                event_name: "updateEmotionIntensity",
                emotion: "Neutral",
                intensity: 0
            })
        }
    };

    handleBackScreen = () => {
        this.setState({ currentScreen: "scenarioRating" });
        this.furhat.send({
            event_name: "updateEmotionIntensity",
            emotion: "Neutral",
            intensity: 0
        })
    };


    handleEmotionSelect = (emotion) => {
        this.setState(prevState => {
            const updatedTriedEmotions = new Set(prevState.triedEmotions);
            updatedTriedEmotions.add(emotion);
            return {
                selectedEmotion: emotion,
                triedEmotions: updatedTriedEmotions
            };
        });
        this.furhat.send({
            event_name: "updateEmotionIntensity",
            emotion: "Neutral",
            intensity: 0
        })
        this.furhat.send({
            event_name: "updateEmotionIntensity",
            emotion: emotion,
            intensity: 50
        })
    };

    handleIntensityChange = (newValue) => {
        this.setState((prevState) => {
            if (newValue > 100) {
                alert("The intensity cannot be more than 100%.");
                newValue = 100;
            } else if (newValue < 0) {
                alert("The intensity cannot be less than 0%.");
                newValue = 0;
            }
            this.furhat.send({
                event_name: "updateEmotionIntensity",
                emotion: this.state.selectedEmotion,
                intensity: this.state.intensity
            })
            return { intensity: newValue, movedSlider: true };
        });
    };

    handleQuestionChange = (event, question) => {
        this.setState({ [question]: event.target.value });
    };

    handleParticipantIDChange = (event) => {
        this.setState({ participantID: event.target.value, enteredId: true});
    };

    handleResetIntensity = () => {
        this.setState({ intensity: 50 });
        this.furhat.send({
            event_name: "updateEmotionIntensity",
            emotion: this.state.selectedEmotion,
            intensity: 50
        })
    };


    render() {
        const { currentScreen, scenarioText, emotionOptions, intensity, participantID, question1, question2, triedEmotions, movedSlider, enteredId } = this.state;

        return (
            <Grid>
                <Row>
                    <Col sm={12}><h1>Participant Designed Emotion Expressions for Social Robot</h1></Col>
                </Row>
                {currentScreen === "participantID" && (
                    <Row>
                        <Col sm={12}>
                            <h3> Welcome! </h3>
                            <p>The robot on your left is <b>Furhat</b>, a humanoid social robot designed to interact with people. In this study, Furhat will take on the role of a <b>peer mentor</b> for adolescents.</p>
                           <p>Your task is to <b>design Furhat’s empathetic emotional expressions</b>  for six different scenarios that an adolescent will share with the robot during a one-on-one interaction.</p>
                           <p>For each scenario, you will:</p>
                            <ul>
                                <li><b>Select an emotion</b> that Furhat should express.</li>
                                <li><b>Adjust the intensity</b> of the emotion to match the situation.</li>
                                <li><b>See your changes in real time</b> —each time you adjust the emotion or intensity, the Furhat robot will display the updated expression.</li>
                            </ul>
                            <p>Take your time exploring the different options to create expressions that feel natural and appropriate. </p>
                            <p>When you're ready, proceed to the first scenario!</p>


                            <h2>Enter Participant ID:</h2>
                            <FormControl type="text" value={participantID} onChange={this.handleParticipantIDChange} />
                            <Button onClick={this.handleNextScreen} style={{ backgroundColor: enteredId ? "blue" : "gray" }}>Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "done" && (
                    <Row>
                        <Col sm={12}>
                            <h2>Your responses have been saved successfully. You may now exit the room and inform the researcher.</h2>
                            <p>Thank you for helping to create Furhat's responses to these scenarios!</p>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioDisplay" && (
                    <Row>
                        <Col sm={12}><h2>Scenario: {this.state.iteration} out of 8</h2>
                        </Col>
                        <Col sm={12}><h2>Read the following scenario:</h2><p>{scenarioText}</p>
                            <Button onClick={this.handleNextScreen}>Done</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioRating" && (
                    <Row>
                        <Col sm={12}><p>{scenarioText}</p>
                        </Col>
                        <Col sm={12}><h2>Furhat should respond with which expression? </h2>
                            <b>It is important that you check the different emotional expressions on the physical Furhat robot next to this screen. Please check all of the options below.  </b>
                            {emotionOptions.map((emotion) => (
                                <Button key={emotion} onClick={() => this.handleEmotionSelect(emotion)}>{emotion}</Button>
                            ))}
                            <br />
                            <Button style={{ marginTop: "10px", backgroundColor: triedEmotions.size === emotionOptions.length ? "blue" : "gray", color: "white" }} onClick={this.handleNextScreen}>Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioScaling" && (
                    <Row>
                        <Col sm={12}><p>{scenarioText}</p>
                        </Col>
                        <Col sm={12}><h2>How intense should Furhat's expression of {this.state.selectedEmotion} be? <b>You can view the different intensities on the physical Furhat robot next to this screen</b></h2>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={this.state.intensity}
                                className="slider"
                                id="scale"
                                onChange={(e) => this.handleIntensityChange(parseInt(e.target.value, 10))}
                            />
                            {/*<Button onClick={() => this.handleIntensityChange(10)}>More +</Button>*/}
                            {/*<span style={{ margin: "0 10px", fontWeight: "bold" }}>{intensity}%</span>*/}
                            {/*<Button onClick={() => this.handleIntensityChange(-10)}>Less -</Button>*/}
                            <br />
                            <Button onClick={this.handleResetIntensity} style={{ marginRight: "10px" }}>Reset</Button>
                            <br />
                            <Button onClick={this.handleBackScreen} style={{ marginRight: "10px" }}>Back</Button>
                            <Button onClick={this.handleNextScreen} style={{ backgroundColor: movedSlider ? "blue" : "gray" }}>Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioQuestions" && (
                    <Row>
                        <Col sm={12}><p>{scenarioText}</p>
                        </Col>
                        <Col sm={12}><h2>Why did you pick this expression?</h2>
                            <textarea style={{ width: "100%", height: "100px" }} value={question1} onChange={(e) => this.handleQuestionChange(e, "question1")} />
                            <h2>What would you want Furhat to say in response to this scenario along with this expression?</h2>
                            <textarea style={{ width: "100%", height: "100px" }} value={question2} onChange={(e) => this.handleQuestionChange(e, "question2")} />
                            <Button onClick={this.handleNextScreen} style={{ backgroundColor: (question1.trim() && question2.trim()) ? "blue" : "gray" }}>Done</Button>
                        </Col>
                    </Row>
                )}
            </Grid>
        );
    }
}

export default App;
