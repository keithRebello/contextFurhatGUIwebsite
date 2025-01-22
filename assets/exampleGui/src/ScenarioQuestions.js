import React, { useState, useEffect } from "react";
import { useScenario } from "./ScenarioProvider";
import "./ScenarioQuestions.css";

const ScenarioQuestions = () => {
    const { iteration, scenarioIndex, setScreen, nextScenario } = useScenario();
    const [scenarioText, setScenarioText] = useState("");
    const [expressionReason, setExpressionReason] = useState("");
    const [furhatResponse, setFurhatResponse] = useState("");


    // Load scenario text from the JSON file
    useEffect(() => {
        const fetchScenario = async () => {
            try {
                const response = await fetch("./scenarios.json");
                const data = await response.json();
                setScenarioText(data.text);
            } catch (error) {
                console.error("Error loading scenario:", error);
                setScenarioText("Failed to load scenario. Please try again later.");
            }
        };

        fetchScenario();
    }, [scenarioIndex]);

    const handleDoneClick = () => {
        if (!expressionReason.trim() || !furhatResponse.trim()) {
            alert("Please answer both questions before proceeding.");
        } else {
            alert(
                `Submitted:\n- Reason: ${expressionReason}\n- Furhat Response: ${furhatResponse}`
            );
            // Here, you can navigate to another screen or handle the data submission
        }
        if (iteration >= 8) {
            alert("You've completed all scenarios!");
            // Redirect or end process here
        } else {
            nextScenario(); // Increment scenario and iteration
            setScreen("scenarioDisplay"); // Go back to the first screen
        }
    };

    return (
        <div className="questions-container">
            <div className="scenario-section">
                <h2>Scenario</h2>
                <p className="scenario-text">{scenarioText}</p>
            </div>
            <div className="questions-section">
                <h2>Why did you pick this expression?</h2>
                <textarea
                    className="input-textbox"
                    value={expressionReason}
                    onChange={(e) => setExpressionReason(e.target.value)}
                    placeholder="Type your reason here..."
                />
                <h2>What would you want Furhat to say in response to this scenario?</h2>
                <textarea
                    className="input-textbox"
                    value={furhatResponse}
                    onChange={(e) => setFurhatResponse(e.target.value)}
                    placeholder="Type Furhat's response here..."
                />
                <button className="done-button" onClick={handleDoneClick}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default ScenarioQuestions;
