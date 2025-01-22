import React, { useState, useEffect } from "react";
import { useScenario } from "./ScenarioProvider";
import "../css/ScenarioDisplay.css";

const ScenarioDisplay = () => {
    const [scenarioText, setScenarioText] = useState("");
    const { scenarioIndex, setScreen } = useScenario();

    // Load scenarios.json on component mount
    useEffect(() => {
        const fetchScenario = async () => {
            try {
                const response = await fetch("./scenarios.json");
                const data = await response.json();
                // Assuming scenarios.json has a "text" field for the scenario
                setScenarioText(data.text);
            } catch (error) {
                console.error("Error loading scenario:", error);
                setScenarioText("Failed to load scenario. Please try again later.");
            }
        };

        fetchScenario();
    }, [scenarioIndex]);

    const handleDoneClick = () => {
        alert("You have finished reading the scenario!");
        setScreen("scenarioRating");
    };

    return (
        <div className="scenario-container">
            <h2 className="instruction">Read the following scenario</h2>
            <div className="scenario-text">{scenarioText}</div>
            <button className="done-button" onClick={handleDoneClick}>
                Done
            </button>
        </div>
    );
};

export default ScenarioDisplay;
