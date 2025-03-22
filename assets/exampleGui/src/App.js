import React, { Component } from "react";
import FurhatGUI from "furhat-gui";
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

function mapEmotion(expression){
    switch(expression){
        case "Expression 1":
            return "Joy";
        case "Expression 2":
            return "Sadness";
        case "Expression 3":
            return "Anger";
        case "Expression 4":
            return "Surprise";
        case "Expression 5":
            return "Disgust";
        case "Expression 6":
            return "Fear";
        default:
            return "Neutral";
    }
}

const blocks = [
    {"blockID": "1", "scenarioList":[2,4,7,8,9,10]},
    {"blockID": "2", "scenarioList":[1,3,6,7,9,10]},
    {"blockID": "3", "scenarioList":[6,7,8,10,11,12]},
    {"blockID": "4", "scenarioList":[1,3,5,6,7,9]},
    {"blockID": "5", "scenarioList":[1,3,5,6,10,11]},
    {"blockID": "6", "scenarioList":[5,6,8,9,10,11]},
    {"blockID": "7", "scenarioList":[5,6,7,8,9,12]},
    {"blockID": "8", "scenarioList":[1,4,7,8,10,11]},
    {"blockID": "9", "scenarioList":[5,6,7,8,11,12]},
    {"blockID": "10", "scenarioList":[1,4,6,10,11,12]},
    {"blockID": "11", "scenarioList":[4,5,7,9,10,11]},
    {"blockID": "12", "scenarioList":[1,3,4,6,7,8]},
    {"blockID": "13", "scenarioList":[1,3,4,9,10,12]},
    {"blockID": "14", "scenarioList":[4,5,7,9,10,12]},
    {"blockID": "15", "scenarioList":[4,5,7,8,10,12]},
    {"blockID": "16", "scenarioList":[1,3,4,7,9,11]},
    {"blockID": "17", "scenarioList":[4,5,6,9,11,12]},
    {"blockID": "18", "scenarioList":[1,3,4,8,11,12]},
    {"blockID": "19", "scenarioList":[1,3,5,8,9,12]},
    {"blockID": "20", "scenarioList":[3,4,6,8,9,10]},
    {"blockID": "21", "scenarioList":[3,4,6,8,9,11]},
    {"blockID": "22", "scenarioList":[2,4,6,9,11,12]},
    {"blockID": "23", "scenarioList":[1,3,5,8,10,12]},
    {"blockID": "24", "scenarioList":[2,3,4,8,11,12]},
    {"blockID": "25", "scenarioList":[1,3,5,7,11,12]},
    {"blockID": "26", "scenarioList":[2,3,6,8,10,12]},
    {"blockID": "27", "scenarioList":[2,3,6,7,11,12]},
    {"blockID": "28", "scenarioList":[2,3,6,7,10,12]},
    {"blockID": "29", "scenarioList":[2,3,5,8,9,10]},
    {"blockID": "30", "scenarioList":[2,3,5,8,9,11]},
    {"blockID": "31", "scenarioList":[1,2,4,5,6,8]},
    {"blockID": "32", "scenarioList":[2,3,5,7,10,11]},
    {"blockID": "33", "scenarioList":[1,2,4,5,6,8]},
    {"blockID": "34", "scenarioList":[1,2,4,5,6,7]},
    {"blockID": "35", "scenarioList":[1,2,7,8,10,11]},
    {"blockID": "36", "scenarioList":[2,3,4,7,9,12]},
    {"blockID": "37", "scenarioList":[1,2,7,8,9,12]},
    {"blockID": "38", "scenarioList":[1,2,7,8,9,11]},
    {"blockID": "39", "scenarioList":[1,2,6,9,10,12]},
    {"blockID": "40", "scenarioList":[2,3,4,5,10,11]},
    {"blockID": "41", "scenarioList":[1,2,6,9,10,11]},
    {"blockID": "42", "scenarioList":[2,3,4,5,6,7]},
    {"blockID": "43", "scenarioList":[1,2,5,9,11,12]},
    {"blockID": "44", "scenarioList":[1,2,4,5,10,12]}
];

const scenariosList = [
    {vignetteID: 1, emotion: "Joy", intensity: "100", text:"I won first place in the school science fair today! When they called my name, everyone clapped, and I felt incredibly proud. My parents were so happy too—it was a moment I’ll never forget."},
    {vignetteID: 2, emotion: "Joy", intensity: "0", text:"My teacher gave me a small compliment in class for answering a difficult question. It wasn’t a big deal, but it gave me a nice feeling inside."},

    {vignetteID: 3, emotion: "Sadness", intensity: "100", text:"My best friend told me they are moving to another city next month. I know we can still talk online, but it feels like things will never be the same."},
    {vignetteID: 4, emotion: "Sadness", intensity: "0", text:"I worked hard on my school project, but I didn’t get the grade I was hoping for. I still did really well but I felt discouraged even though I knew I tried my best."},

    {vignetteID: 5, emotion: "Anger", intensity: "100", text:"My younger sibling accidentally deleted a project I’d been working on for hours. I felt so frustrated that I had to walk away to calm down."},
    {vignetteID: 6, emotion: "Anger", intensity: "0", text:"I don’t play video games very often but I was playing a game online, and another player wasn’t following the rules. I got frustrated and stopped playing because it wasn’t fair."},

    {vignetteID: 7, emotion: "Fear", intensity: "100", text:"I was walking home late in the evening, and I thought I heard footsteps behind me. My heart started racing, and I felt scared until I got home safely."},
    {vignetteID: 8, emotion: "Fear", intensity: "0", text:"During class, the teacher asked a question, and I wasn’t sure of the answer. I felt nervous, hoping she wouldn’t call on me."},


    {vignetteID: 9, emotion: "Disgust", intensity: "0", text:"Someone spilled milk in the cafeteria, and it stayed there for days. By the end, the smell was terrible, and it made me feel really uncomfortable."},
    {vignetteID: 10, emotion: "Disgust", intensity: "0", text:"I found an old sandwich in my backpack that I had forgotten about. It smelled bad, so I threw it away."},

    {vignetteID: 11, emotion: "Surprise", intensity: "100", text:"I came home and found a surprise party waiting for me! All my friends and family were there, and I had no idea they had planned something so special."},
    {vignetteID: 12, emotion: "Surprise", intensity: "100", text:"When I got my math test back, I was surprised to see I got a high score. I wasn’t expecting such a good result, but it felt great."},
];

const emotionOptions = ["Expression 1", "Expression 2", "Expression 3", "Expression 4", "Expression 5", "Expression 6"];


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: "blockID",
            iteration: 1,
            speaking: false,
            shuffledScenarios:[],
            scenarioEmotion: "",
            scenarioIntensity: 0,
            scenarioText: "",
            emotionOptions: shuffle(emotionOptions),
            selectedEmotion: "",
            intensity: 50,
            blockID: "",
            participantID: "",
            participantReasoning: "",
            participantFurhatResponse: "",
            responses: [],
            enteredId: false,
            triedEmotions: new Set(),
            movedSlider: false
        };
        this.furhat = null;
    }

    componentDidMount() {
        FurhatGUI()
            .then((connection) => {
                this.furhat = connection;
                this.setupSubscriptions();
            })
            .catch(error => {
                console.error("FurhatGUI connection failed:", error);
                alert("FurhatGUI failed to connect!");
            });
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
        const scenarioIndex = (this.state.iteration - 1) % this.state.shuffledScenarios.length;
        this.setState({ scenarioText: this.state.shuffledScenarios[scenarioIndex].text, scenarioEmotion: this.state.shuffledScenarios[scenarioIndex].emotion, scenarioIntensity: this.state.shuffledScenarios[scenarioIndex].intensity});
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
        const { currentScreen, iteration, responses, selectedEmotion, intensity, participantID, participantReasoning, participantFurhatResponse, triedEmotions, movedSlider, enteredId  } = this.state;

        if (currentScreen === "scenarioRating" && triedEmotions.size < this.state.emotionOptions.length + 1) {
            alert("Please try all the expressions options before proceeding.");
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

        if (currentScreen === "scenarioQuestions" && (participantReasoning.trim() === "" || participantFurhatResponse.trim() === "")) {
            alert("Please answer both questions before proceeding.");
            return;
        }

        if (currentScreen === "SurveyScreen") {
            this.setState({ currentScreen: "done" }, () => {
                this.downloadJSON(`${participantID}.json`, responses); // Ensure JSON is saved
                this.furhat.send({
                    event_name: "endingScreen" // Ensure Furhat speaks
                });
            });
            return;
        }
        if (currentScreen === "blockID") {
            this.setState({ currentScreen: "participantID" });
        }else if (currentScreen === "participantID") {
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
                { participantID, blockId: this.state.blockID, scenarioEmotion: this.state.scenarioEmotion, scenarioIntensity: this.state.scenarioIntensity, scenarioText: this.state.scenarioText, selectedEmotion: mapEmotion(this.state.selectedEmotion), selectedIntensity: this.state.intensity, participantReasoning, participantFurhatResponse}
            ];
            if (iteration < 6) {
                this.setState(
                    { iteration: iteration + 1, currentScreen: "scenarioDisplay", responses: updatedResponses, intensity: 50, participantReasoning: "", participantFurhatResponse: "", enteredId: false, triedEmotions: new Set(), selectedEmotion:"", movedSlider: false, emotionOptions: shuffle(emotionOptions) },
                    this.loadScenario
                );
            } else {
                if (iteration === 6 && currentScreen === "scenarioQuestions"){
                    this.setState(
                        { iteration: iteration + 1, currentScreen: "SurveyScreen"}
                    );
                }else {
                    this.setState({currentScreen: "done", responses: updatedResponses}, () => {
                        this.downloadJSON(`${participantID}.json`, updatedResponses);
                    });
                    this.furhat.send({
                        event_name: "endingScreen"
                    });
                }
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



    handleBlockIDChange = (event) => {
        this.setState({ blockID: event.target.value }, () => { // Include callback to setState.
            const selectedBlock = blocks.find(block => block.blockID === this.state.blockID);
            if (selectedBlock) {
                const scenariosIDs = selectedBlock.scenarioList;
                const scenarios = scenariosList.filter(scenario => scenariosIDs.includes(scenario.vignetteID));
                this.setState({ shuffledScenarios: shuffle(scenarios) }, () => {
                    console.log("Updated shuffledScenarios:", this.state.shuffledScenarios);
                    console.log("Updated blockID:", this.state.blockID);
                    this.loadScenario();
                });
            }
            else{
                this.setState({shuffledScenarios : []}, () => {
                    console.log("Updated shuffledScenarios:", this.state.shuffledScenarios);
                    console.log("Updated blockID:", this.state.blockID);
                    this.loadScenario();
                });
            }
        });
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
        const { currentScreen, scenarioText, emotionOptions, intensity, blockID, participantID, participantReasoning: participantReasoning, participantFurhatResponse, selectedEmotion,triedEmotions, movedSlider, enteredId } = this.state;

        return (
            <Grid>
                {currentScreen === "blockID" && (
                    <Row className="participant-id-container">
                        <Col sm={8} className="text-box">
                            <h3>Enter Block ID:</h3>
                            <FormControl type="text" value={blockID} onChange={this.handleBlockIDChange} />

                            <div className="button-container">
                                <Button onClick={this.handleNextScreen} className="next-button"  style={{ backgroundColor: "red" }}>Next</Button>
                            </div>
                        </Col>
                    </Row>
                )}
                {currentScreen === "participantID" && (
                    <Row className="participant-id-container">
                        <Col sm={4} className="furhat-image-container">
                            <div className="furhat-label">This is Furhat!</div>
                            <img src="../public/assets/images/leftarrowv2.png" alt="Left Arrow" className="furhat-image" />
                        </Col>
                        <Col sm={8} className="text-box">
                            <h2> Welcome! </h2>
                            <p>The robot on your left is <b>Furhat</b>, a humanoid social robot designed to interact with people. </p> <p> In the future, we envisage that Furhat can take on the role of a <b>peer mentor</b> for adolescents. </p><p>
                           Your task is to <b>design Furhat’s empathetic emotional expressions</b>  for six different scenarios that an adolescent will share with the robot during a one-on-one interaction.</p>
                           <p>For each scenario, you will:</p>
                            <ul>
                                <li><b>Select an emotional expression</b> for the Furhat.</li>
                                <li><b>Adjust the intensity</b> of the emotional expression to match the situation.</li>
                                <li><b>See your changes in real time</b> —each time you adjust the emotional expression or intensity, the Furhat robot will display the updated expression.</li>
                            </ul>
                            <p>Take your time exploring the different options to create expressions that feel natural and appropriate. </p>
                            <p>When you're ready, proceed to the first scenario!</p>

                            <h3>Enter Participant ID:</h3>
                            <FormControl type="text" value={participantID} onChange={this.handleParticipantIDChange} />

                            <div className="button-container">
                                <Button onClick={this.handleNextScreen} className="next-button"  style={{ backgroundColor: enteredId ? "#194051" : "gray" }}>Next</Button>
                            </div>
                        </Col>
                    </Row>
                )}
                {currentScreen === "SurveyScreen" && (
                    <Row className="done-screen">
                        <Col sm={12} className="done-text">
                            <p>Your responses have been saved successfully. Please now complete the survey by clicking the link below. Once you are done, you can complete this study by clicking the "done" button.</p>
                            <a href ="google.com" target="_blank" rel="noopener noreferrer">
                                Click here to take the survey
                            </a>
                            <div className="button-container">
                                <Button onClick={this.handleNextScreen} className="next-button" >Done</Button>
                            </div>
                        </Col>
                    </Row>
                )}
                {currentScreen === "done" && (
                    <Row className="done-screen">
                        <Col sm={12} className="done-text">
                            <p>Your responses have been saved successfully. You may now exit the room and inform the researcher.</p>
                            <h2>Thank you for helping create Furhat's responses to these scenarios!</h2>
                            <img src={"../public/assets/images/balloons.png"} alt="Balloons" style={{ width: "150px", display: "block", margin: "20px auto" }} />
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioDisplay" && (
                    <Row className="scenario-display">
                        <Col sm={12} className="scenario-text"><h2 className="scenario-out-of">Scenario: {this.state.iteration} out of 6</h2>
                        <h2> Read the following scenario that an adolescent might share with the Furhat:</h2><h2 className="scenario-text">" {scenarioText} "</h2>
                            </Col>
                        <Col sm={12} className="button-container">
                            <Button onClick={this.handleNextScreen} className="next-button" >Done</Button>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioRating" && (
                    <Row className="scenario-rating">
                        <Col sm={8} className="scenario-text"><h2 className="scenario-out-of">Scenario: {this.state.iteration} out of 6</h2>
                        <h2>" {scenarioText} "</h2>
                        </Col>
                        <Col sm={12} className="emotion-options"><h3>Furhat should respond with which expression? </h3>
                            <p><b>It is important that you check the different emotional expressions on the physical Furhat robot next to this screen. Please view all of the options below by clicking on them and choose one before proceeding.  </b></p>
                            <div className="button-grid">
                            {emotionOptions.map((emotion) => (
                                <Button className={selectedEmotion === emotion ? "selected" : ""} key={emotion}  onClick={() => this.handleEmotionSelect(emotion) }>{emotion}</Button>
                            ))}
                                <Button className= "neutral-button" onClick={() => this.handleEmotionSelect("Neutral")}>Neutral Expression</Button>
                            </div>


                            <div className="next-button-container">
                                <Button className="next-button" style={{ backgroundColor: triedEmotions.size === emotionOptions.length + 1 ? "#194051" : "gray" }} onClick={this.handleNextScreen}>Next</Button>
                            </div>

                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioScaling" && (
                    <Row className="scenario-scaling">
                        <Col sm={8} className="scenario-text">
                        <h2 className="scenario-out-of">Scenario: {this.state.iteration} out of 6</h2>
                        <h2 >"{scenarioText}"</h2>
                        </Col>
                        <Col sm={12} className="scaling-container"><h3>How intense should {this.state.selectedEmotion} be? <b>You can view the different intensities on the Furhat robot next to this screen</b></h3>
                            <div className="slider-container">
                            <span>Very Low</span>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={this.state.intensity}
                                className="slider"
                                id="scale"
                                onChange={(e) => this.handleIntensityChange(parseInt(e.target.value, 10))}
                            />
                            <span>Very High</span>
                            </div>

                            <Button onClick={this.handleResetIntensity} className="reset-button">Reset</Button>

                            <div className="navigation-buttons">
                                <Button onClick={this.handleBackScreen} className="back-button">Back</Button>
                                <Button onClick={this.handleNextScreen} className="next-button" style={{ backgroundColor: movedSlider ? "#194051" : "gray" }}>Finalize</Button>
                            </div>
                        </Col>
                    </Row>
                )}
                {currentScreen === "scenarioQuestions" && (
                    <Row className="scenario-questions">
                        <Col sm={8} className="scenario-text"><h2 className="scenario-out-of">Scenario: {this.state.iteration} out of 6</h2>
                        <h2>"{scenarioText}"</h2>
                        </Col>
                        <Col sm={12} className="question-container"><h3>Why did you pick this expression?</h3>
                            <textarea className="text-area" value={participantReasoning} onChange={(e) => this.handleQuestionChange(e, "participantReasoning")} />
                            <h3>What would you want Furhat to say in response to this scenario along with this expression?</h3>
                            <textarea className="text-area" value={participantFurhatResponse} onChange={(e) => this.handleQuestionChange(e, "participantFurhatResponse")} />

                            <div className="done-button-container">
                                <Button onClick={this.handleNextScreen} className="next-button"  style={{ backgroundColor: (participantReasoning.trim() && participantFurhatResponse.trim()) ? "#194051" : "gray"}}>Done</Button>
                            </div>
                        </Col>
                    </Row>
                )}
            </Grid>
        );
    }
}

export default App;
