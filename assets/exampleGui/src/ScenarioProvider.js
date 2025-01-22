import React, { createContext, useContext, useState } from "react";

// Create Context
const ScenarioContext = createContext();

// Custom Hook for Context Access
export const useScenario = () => useContext(ScenarioContext);

// Scenario Provider
export const ScenarioProvider = ({ children }) => {
    const [iteration, setIteration] = useState(1); // Track current iteration (1 to 8)
    const [screen, setScreen] = useState("scenarioDisplay"); // Current screen
    const [scenarioIndex, setScenarioIndex] = useState(0); // Index for scenarios

    const nextScenario = () => {
        if (iteration < 8) {
            setIteration(iteration + 1);
            setScenarioIndex(scenarioIndex + 1);
        }
    };

    const resetScenario = () => {
        setIteration(1);
        setScenarioIndex(0);
        setScreen("scenarioDisplay");
    };

    return (
        <ScenarioContext.Provider
            value={{
                iteration,
                screen,
                scenarioIndex,
                setScreen,
                nextScenario,
                resetScenario,
            }}
        >
            {children}
        </ScenarioContext.Provider>
    );
};
