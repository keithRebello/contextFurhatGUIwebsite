import React, { useState, useEffect } from "react";
import { useScenario } from "./ScenarioProvider";
import "./css/ScenarioRating.css";

const ScenarioRating = () => {
    const { scenarioIndex, setScreen } = useScenario();
    const [scenarioText, setScenarioText] = useState("");
    const [selectedEmotion, setSelectedEmotion] = useState(null);

    // Load scenarios.json on component mount
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

    const handleEmotionChange = (event) => {
        setSelectedEmotion(event.target.value);
    };

    const handleDoneClick = () => {
        if (selectedEmotion) {
            alert(`You selected: ${selectedEmotion}`);
            setScreen("scenarioScaling");
        } else {
            alert("Please select an emotion before proceeding!");
        }
    };

    return (
        <div className="rating-container">
            <div className="scenario-section">
                <h2>Scenario</h2>
                <p className="scenario-text">{scenarioText}</p>
            </div>
            <div className="rating-section">
                <h2>Furhat should respond with which emotion?</h2>
                <form className="emotion-form">
                    {Array.from({ length: 7 }, (_, index) => (
                        <label key={index} className="emotion-option">
                            <input
                                type="radio"
                                name="emotion"
                                value={`Emotion ${index + 1}`}
                                onChange={handleEmotionChange}
                            />
                            Emotion {index + 1}
                        </label>
                    ))}
                </form>
                <button className="done-button" onClick={handleDoneClick}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default ScenarioRating;
