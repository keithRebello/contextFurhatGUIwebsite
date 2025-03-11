import React, { Component } from "react";
import FurhatGUI from "furhat-gui";
import { Grid, Row, Col, Button, FormControl } from "react-bootstrap";
import "./style.css";

class App extends Component {
    // ... (rest of your existing code)

    render() {
        const { currentScreen, scenarioText, emotionOptions, intensity, participantID, question1, question2, triedEmotions, movedSlider, enteredId } = this.state;

        return (
            <Grid>
                <Row>
                    <Col sm={12} className="title-container"><h1>Participant Designed Emotion Expressions for Social Robot</h1></Col>
                </Row>
                {currentScreen === "participantID" && (
                    <Row className="participant-id-container">
                        <Col sm={4} className="furhat-image-container">
                            <img src="/assets/images/leftarrowv2.png" alt="Left Arrow" className="furhat-image" />
                            <div className="furhat-label">This is Furhat!</div>
                        </Col>
                        <Col sm={8} className="text-box">
                            <h2> Welcome! </h2>
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
                            <h3>Enter Participant ID:</h3>
                            <FormControl type="text" value={participantID} onChange={this.handleParticipantIDChange} className="participant-input" />
                            <Button onClick={this.handleNextScreen} className={enteredId ? "next-button" : "next-button disabled"}>Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioDisplay" && (
                    <Row className="scenario-display">
                        <Col sm={12} className="scenario-text"><h2>Scenario: {this.state.iteration} out of 8</h2>
                            <h2 className="highlighted-text">" {scenarioText} "</h2>
                        </Col>
                        <Col sm={12} className="button-container">
                            <Button onClick={this.handleNextScreen} className="next-button">Done</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioRating" && (
                    <Row className="scenario-rating">
                        <Col sm={6} className="scenario-text"> <h2>{scenarioText}</h2></Col>
                        <Col sm={6} className="emotion-options">
                            <h3>Furhat should respond with which expression?</h3>
                            <p><b>It is important that you check the different emotional expressions on the physical Furhat robot next to this screen.</b></p>
                            <div className="button-grid">
                                {emotionOptions.map((emotion) => (
                                    <Button key={emotion} onClick={() => this.handleEmotionSelect(emotion)}>{emotion}</Button>
                                ))}
                            </div>
                            <Button className="next-button">Next</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioScaling" && (
                    <Row className="scenario-scaling">
                        <Col sm={6} className="scenario-text"> <h2>{scenarioText}</h2></Col>
                        <Col sm={6} className="scaling-container">
                            <h3>How intense should Furhat's expression of {this.state.selectedEmotion} be?</h3>
                            <div className="slider-container">
                                <span>Very Low</span>
                                <input type="range" min="1" max="100" value={this.state.intensity} className="slider" onChange={(e) => this.handleIntensityChange(parseInt(e.target.value, 10))} />
                                <span>Very High</span>
                            </div>
                            <Button onClick={this.handleResetIntensity} className="reset-button">Reset</Button>
                            <div className="navigation-buttons">
                                <Button onClick={this.handleBackScreen} className="back-button">Back</Button>
                                <Button onClick={this.handleNextScreen} className="next-button">Next</Button>
                            </div>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioQuestions" && (
                    <Row className="scenario-questions">
                        <Col sm={6} className="scenario-text"> <h2>{scenarioText}</h2></Col>
                        <Col sm={6} className="question-container">
                            <h3>Why did you pick this expression?</h3>
                            <textarea className="text-area" value={question1} onChange={(e) => this.handleQuestionChange(e, "question1")} />
                            <h3>What would you want Furhat to say in response?</h3>
                            <textarea className="text-area" value={question2} onChange={(e) => this.handleQuestionChange(e, "question2")} />
                            <Button onClick={this.handleNextScreen} className="next-button">Done</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "done" && (
                    <Row className="done-screen">
                        <Col sm={12} className="done-text">
                            <h2>Your responses have been saved successfully. You may now exit the room and inform the researcher.</h2>
                            <p>Thank you for helping to create Furhat's responses to these scenarios!</p>
                            <img src="/assets/images/balloons.png" alt="Balloons" className="done-image" />
                        </Col>
                    </Row>
                )}
            </Grid>
        );
    }
}

export default App;
