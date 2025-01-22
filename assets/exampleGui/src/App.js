import React, { Component } from "react";
import FurhatGUI from "furhat-gui";
import { Grid, Row, Col, Button } from "react-bootstrap";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: "scenarioDisplay", // Tracks the current screen in the flow
            iteration: 1, // Tracks the current iteration (1-8)
            speaking: false, // Tracks if Furhat is speaking
            scenarioText: "", // Text of the current scenario
            emotionOptions: ["Happy", "Sad", "Angry", "Surprised", "Neutral"], // Example options for emotion
            selectedEmotion: "", // Tracks the selected emotion
        };
        this.furhat = null;
    }

    componentDidMount() {
        // Initialize Furhat connection
        FurhatGUI()
            .then((connection) => {
                this.furhat = connection;
                this.setupSubscriptions();
                this.loadScenario(); // Load the first scenario when Furhat connects
            })
            .catch(console.error);
    }

    setupSubscriptions() {
        // Example subscription to handle connected GUI events
        this.furhat.subscribe("SenseSkillGUIConnected", () => {
            console.log("Furhat GUI connected");
        });

        // Handle speech completion event
        this.furhat.subscribe("SpeechDone", () => {
            this.setState({ speaking: false });
        });
    }

    loadScenario() {
        // Load the scenario text based on the current iteration
        const scenarios = [
            "You encounter a stranger asking for directions.",
            "A dog approaches you in the park, barking loudly.",
            "Your friend tells you they have exciting news to share.",
            "Someone accidentally spills coffee on you at a café.",
        ];
        const scenarioIndex = (this.state.iteration - 1) % scenarios.length;
        this.setState({ scenarioText: scenarios[scenarioIndex] });
    }

    handleNextScreen = () => {
        // Handles navigation through the flow
        const { currentScreen, iteration } = this.state;

        if (currentScreen === "scenarioDisplay") {
            this.setState({ currentScreen: "scenarioRating" });
        } else if (currentScreen === "scenarioRating") {
            this.setState({ currentScreen: "scenarioScaling" });
        } else if (currentScreen === "scenarioScaling") {
            this.setState({ currentScreen: "scenarioQuestions" });
        } else if (currentScreen === "scenarioQuestions") {
            if (iteration < 8) {
                this.setState(
                    { iteration: iteration + 1, currentScreen: "scenarioDisplay" },
                    this.loadScenario // Load the next scenario
                );
            } else {
                alert("You have completed all scenarios!");
            }
        }
    };

    handleEmotionSelect = (emotion) => {
        // Handles emotion selection and sends it to Furhat
        this.setState({ speaking: true, selectedEmotion: emotion });
        this.furhat.send({
            event_name: "UserEmotionSelected",
            data: emotion,
        });
        this.furhat.send({
            type: "furhat_say",
            text: `You selected the emotion ${emotion}.`,
        });
    };

    render() {
        const { currentScreen, scenarioText, emotionOptions, speaking } = this.state;

        return (
            <Grid>
                <Row>
                    <Col sm={12}>
                        <h1>Participant Designed Emotion Expressions for Social Robot</h1>
                    </Col>
                </Row>
                {currentScreen === "scenarioDisplay" && (
                    <Row>
                        <Col sm={12}>
                            <h2>Read the following scenario:</h2>
                            <p>{scenarioText}</p>
                            <Button onClick={this.handleNextScreen} disabled={speaking}>
                                Done
                            </Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioRating" && (
                    <Row>
                        <Col sm={12}>
                            <h2>Furhat should respond with which emotion?</h2>
                            {emotionOptions.map((emotion, index) => (
                                <Button
                                    key={index}
                                    onClick={() => this.handleEmotionSelect(emotion)}
                                    disabled={speaking}
                                    style={{ margin: "5px" }}
                                >
                                    {emotion}
                                </Button>
                            ))}
                            <Button onClick={this.handleNextScreen} disabled={speaking}>
                                Next
                            </Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioScaling" && (
                    <Row>
                        <Col sm={12}>
                            <h2>How intense should Furhat's expression of the emotion be?</h2>
                            <Button onClick={() => this.handleNextScreen()} disabled={speaking}>
                                Intensity Selection (Placeholder)
                            </Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioQuestions" && (
                    <Row>
                        <Col sm={12}>
                            <h2>Why did you pick this expression?</h2>
                            <textarea
                                style={{ width: "100%", height: "100px", marginBottom: "10px" }}
                            ></textarea>
                            <h2>What would you want Furhat to say in response to this scenario?</h2>
                            <textarea
                                style={{ width: "100%", height: "100px", marginBottom: "10px" }}
                            ></textarea>
                            <Button onClick={this.handleNextScreen} disabled={speaking}>
                                Done
                            </Button>
                        </Col>
                    </Row>
                )}
            </Grid>
        );
    }
}

export default App;
