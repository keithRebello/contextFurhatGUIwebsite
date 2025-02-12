import React, { Component } from "react";
import FurhatGUI from "furhat-gui";
import { Grid, Row, Col, Button, FormControl } from "react-bootstrap";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: "participantID", // Start at participant ID screen
            iteration: 1,
            speaking: false,
            scenarioText: "",
            emotionOptions: ["Happy", "Sad", "Angry", "Surprised", "Neutral"],
            selectedEmotion: "",
            intensity: 50,
            participantID: "",
            responses: [] // Store user responses
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

    loadScenario() {
        const scenarios = [
            "You encounter a stranger asking for directions.",
            "A dog approaches you in the park, barking loudly.",
            "Your friend tells you they have exciting news to share.",
            "Someone accidentally spills coffee on you at a café.",
        ];
        const scenarioIndex = (this.state.iteration - 1) % scenarios.length;
        this.setState({ scenarioText: scenarios[scenarioIndex] });
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
        const { currentScreen, iteration, responses, selectedEmotion, intensity, participantID } = this.state;

        if (currentScreen === "participantID") {
            this.setState({ currentScreen: "scenarioDisplay" });
        } else if (currentScreen === "scenarioDisplay") {
            this.setState({ currentScreen: "scenarioRating" });
        } else if (currentScreen === "scenarioRating") {
            this.setState({ currentScreen: "scenarioScaling" });
        } else if (currentScreen === "scenarioScaling") {
            this.setState({ currentScreen: "scenarioQuestions" });
        } else if (currentScreen === "scenarioQuestions") {
            const updatedResponses = [
                ...responses,
                { participantID, scenario: this.state.scenarioText, emotion: selectedEmotion, intensity }
            ];
            if (iteration < 8) {
                this.setState(
                    { iteration: iteration + 1, currentScreen: "scenarioDisplay", responses: updatedResponses },
                    this.loadScenario
                );
            } else {
                this.setState({ currentScreen: "done", responses: updatedResponses }, () => {
                    this.downloadJSON(`${participantID}.json`, updatedResponses);
                });
            }
        }
    };

    handleEmotionSelect = (emotion) => {
        this.setState({ selectedEmotion: emotion });
    };

    handleIntensityChange = (change) => {
        this.setState((prevState) => {
            let newIntensity = prevState.intensity + change;
            if (newIntensity > 100) {
                alert("The intensity cannot be more than 100%.");
                newIntensity = 100;
            } else if (newIntensity < 0) {
                alert("The intensity cannot be less than 0%.");
                newIntensity = 0;
            }
            return { intensity: newIntensity };
        });
    };

    handleParticipantIDChange = (event) => {
        this.setState({ participantID: event.target.value });
    };

    render() {
        const { currentScreen, scenarioText, emotionOptions, intensity, participantID } = this.state;

        return (
            <Grid>
                <Row>
                    <Col sm={12}><h1>Participant Designed Emotion Expressions for Social Robot</h1></Col>
                </Row>
                {currentScreen === "participantID" && (
                    <Row>
                        <Col sm={12}>
                            <h2>Enter Participant ID:</h2>
                            <FormControl type="text" value={participantID} onChange={this.handleParticipantIDChange} />
                            <Button onClick={this.handleNextScreen}>Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "done" && (
                    <Row>
                        <Col sm={12}>
                            <h2>Thank you for participating!</h2>
                            <p>Your responses have been saved successfully.</p>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioDisplay" && (
                    <Row>
                        <Col sm={12}><h2>Read the following scenario:</h2><p>{scenarioText}</p>
                            <Button onClick={this.handleNextScreen}>Done</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioRating" && (
                    <Row>
                        <Col sm={12}><h2>Furhat should respond with which emotion?</h2>
                            {emotionOptions.map((emotion) => (
                                <Button key={emotion} onClick={() => this.handleEmotionSelect(emotion)}>{emotion}</Button>
                            ))}
                            <br />
                            <Button style={{ marginTop: "10px", backgroundColor: "blue", color: "white" }} onClick={this.handleNextScreen}>Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioScaling" && (
                    <Row>
                        <Col sm={12}><h2>How intense should Furhat's expression be?</h2>
                            <Button onClick={() => this.handleIntensityChange(10)}>More +</Button>
                            <span style={{ margin: "0 10px", fontWeight: "bold" }}>{intensity}%</span>
                            <Button onClick={() => this.handleIntensityChange(-10)}>Less -</Button>
                            <br /><Button onClick={this.handleNextScreen}>Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioQuestions" && (
                    <Row>
                        <Col sm={12}><h2>Why did you pick this expression?</h2>
                            <textarea style={{ width: "100%", height: "100px" }}></textarea>
                            <h2>What would you want Furhat to say?</h2>
                            <textarea style={{ width: "100%", height: "100px" }}></textarea>
                            <Button onClick={this.handleNextScreen}>Done</Button>
                        </Col>
                    </Row>
                )}
            </Grid>
        );
    }
}

export default App;
