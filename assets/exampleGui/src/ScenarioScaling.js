import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScenario } from "./ScenarioProvider";
import "../../../../Robotic-Coach-main_gui_edited/assets/coachGUI/src/css/ScenarioScaling.css";

const ScenarioScaling = () => {
    const [scenarioText, setScenarioText] = useState("");
    const [intensity, setIntensity] = useState(50);
    const { scenarioIndex, setScreen } = useScenario();
    const navigate = useNavigate();

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

    const handleMoreClick = () => {
        setIntensity((prev) => Math.min(prev + 10, 100));
    };

    const handleLessClick = () => {
        setIntensity((prev) => Math.max(prev - 10, 0));
    };

    const handleResetClick = () => {
        setIntensity(50);
    };

    const handleBackClick = () => {
        navigate("/scenarioRating");
    };

    const handleDoneClick = () => {
        navigate("/scenarioQuestions");
        setScreen("scenarioQuestions");
    };

    return (
        <div className="scaling-container">
            <div className="scenario-section">
                <h2>Scenario</h2>
                <p className="scenario-text">{scenarioText}</p>
            </div>
            <div className="scaling-section">
                <h2>How intense should Furhat's expression of the emotion be?</h2>
                <div className="scale-controls">
                    <button className="scale-button" onClick={handleLessClick}>
                        Less -
                    </button>
                    <div className="scale-value">{intensity}</div>
                    <button className="scale-button" onClick={handleMoreClick}>
                        More +
                    </button>
                </div>
                <div className="navigation-buttons">
                    <button className="nav-button" onClick={handleBackClick}>
                        Back
                    </button>
                    <button className="nav-button" onClick={handleResetClick}>
                        Reset
                    </button>
                    <button className="nav-button" onClick={handleDoneClick}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScenarioScaling;
