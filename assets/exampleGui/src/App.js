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
            scenarioEmotion: "",
            scenarioIntensity: 0,
            scenarioText: "",
            emotionOptions: ["Joy", "Sadness", "Anger", "Surprise", "Disgust", "Fear", "Neutral"],
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
            {emotion: "Joy", intensity: "100", text:" I won first place in the school science fair today! When they called my name, everyone clapped, and I felt incredibly proud. My parents were so happy too—it was a moment I’ll never forget. "},
            {emotion: "Sadness", intensity: "0", text:"I accidentally spilled a few drops of juice on my homework just before handing it in. The teacher didn’t seem to notice, but I was frustrated because I’d put a lot of effort into it.  "},
            {emotion: "Anger", intensity: "100", text:"My younger sibling accidentally deleted a project I’d been working on for hours. I felt so frustrated that I had to walk away to calm down. "},
            {emotion: "Fear", intensity: "100", text:" I was walking home late in the evening, and I thought I heard footsteps behind me. My heart started racing, and I felt scared until I got home safely. "},
            {emotion: "Disgust", intensity: "0", text:" I found an old sandwich in my backpack that I had forgotten about. It smelled bad, so I threw it away."},
            {emotion: "Joy", intensity: "0", text:" My teacher gave me a small compliment in class for answering a difficult question. It wasn’t a big deal, but it gave me a nice feeling inside. "},
            {emotion: "Surprise", intensity: "100", text:"I came home and found a surprise party waiting for me! All my friends and family were there, and I had no idea they had planned something so special. "},
            {emotion: "Anger", intensity: "0", text:"I don’t play video games very often but I was playing a game online, and another player wasn’t following the rules. I got frustrated and stopped playing because it wasn’t fair.  "},
                    ];
        const scenarioIndex = (this.state.iteration - 1) % scenarios.length;
        this.setState({ scenarioText: scenarios[scenarioIndex].text, scenarioEmotion: scenarios[scenarioIndex].emotion, scenarioIntensity: scenarios[scenarioIndex].intensity});
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
        } else if (currentScreen === "scenarioRating" && selectedEmotion !== "Neutral") {
            this.setState({ currentScreen: "scenarioScaling" });
        } else if (currentScreen === "scenarioScaling" || (currentScreen === "scenarioRating" && selectedEmotion === "Neutral")) {
            this.setState({ currentScreen: "scenarioQuestions" });
        } else if (currentScreen === "scenarioQuestions") {
            const updatedResponses = [
                ...responses,
                { participantID, scenarioEmotion: this.state.scenarioEmotion, scenarioIntensity: this.state.scenarioIntensity, scenarioText: this.state.scenarioText, emotion: selectedEmotion, intensity }
            ];
            if (iteration < 8) {
                this.setState(
                    { iteration: iteration + 1, currentScreen: "scenarioDisplay", responses: updatedResponses, intensity: 50},
                    this.loadScenario
                );
            } else {
                this.setState({ currentScreen: "done", responses: updatedResponses }, () => {
                    this.downloadJSON(`${participantID}.json`, updatedResponses);
                });
            }
            this.furhat.send({
                event_name: "updateEmotionIntensity",
                emotion: "Neutral",
                intensity: 0
            })
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
            this.furhat.send({
                event_name: "updateEmotionIntensity",
                emotion: this.state.selectedEmotion,
                intensity: this.state.intensity
            })
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
                            <h2>Thank you for helping to create Furhat's responses to these scenarios!</h2>
                            <p>Your responses have been saved successfully. You may now exit the room and inform the researcher.</p>
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
                        <Col sm={12}><p>{scenarioText}</p>
                        </Col>
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
                        <Col sm={12}><p>{scenarioText}</p>
                        </Col>
                        <Col sm={12}><h2>How intense should Furhat's expression of {this.state.selectedEmotion} be?</h2>
                            <Button onClick={() => this.handleIntensityChange(10)}>More +</Button>
                            <span style={{ margin: "0 10px", fontWeight: "bold" }}>{intensity}%</span>
                            <Button onClick={() => this.handleIntensityChange(-10)}>Less -</Button>
                            <br /><Button onClick={this.handleNextScreen}>Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioQuestions" && (
                    <Row>
                        <Col sm={12}><p>{scenarioText}</p>
                        </Col>
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
