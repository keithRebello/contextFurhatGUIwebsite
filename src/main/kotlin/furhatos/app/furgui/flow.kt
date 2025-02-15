package furhatos.app.furgui

import furhatos.event.senses.SenseSkillGUIConnected
import furhatos.flow.kotlin.*
import furhatos.gestures.BasicParams
import furhatos.gestures.Gestures
import furhatos.gestures.defineGesture
import furhatos.records.Record
import furhatos.skills.HostedGUI

// GUI declaration
val GUI = HostedGUI("ExampleGUI", "assets/exampleGui", PORT)
val VARIABLE_SET = "VariableSet"
val CLICK_BUTTON = "ClickButton"
val EMOTION_UPDATE = "updateEmotionIntensity"

// Starting state, before GUI is connected
val NoGUI: State = state(null) {
    onEvent<SenseSkillGUIConnected> {
        goto(GUIConnected)
    }
}

/*
    Here we know our GUI has connected. We store intensity inside this state to make it mutable.
 */
val GUIConnected = state(NoGUI) {
    var intensity: Double = 0.0  // Now mutable inside the state

    val buttons = listOf("Joy", "Sadness", "Anger", "Surprise", "Disgust", "Fear", "Neutral")
    val inputFieldData = mutableMapOf<String, (String) -> String>()

    fun getGesture(emotion: String) = when (emotion) {
        "Joy" -> defineGesture { frame(0.35, 1.0, persist = false) { BasicParams.SMILE_OPEN to intensity } }
        "Sadness" -> defineGesture { frame(0.35, 1.0, persist = false) { BasicParams.EXPR_SAD to intensity } }
        "Anger" -> defineGesture { frame(0.35, 3.4, persist = false) { BasicParams.EXPR_ANGER to intensity } }
        "Surprise" -> defineGesture { frame(0.35, 3.4, persist = false) { BasicParams.SURPRISE to intensity } }
        "Disgust" -> defineGesture { frame(0.35, 3.4, persist = false) { BasicParams.EXPR_DISGUST to intensity } }
        "Fear" -> defineGesture { frame(0.35, 3.4, persist = false) { BasicParams.EXPR_FEAR to intensity } }
        "Neutral" -> defineGesture { frame(0.35, 3.4, persist = false) {BasicParams.SMILE_OPEN to 0
            BasicParams.SURPRISE to 0
            BasicParams.EXPR_ANGER to 0
            BasicParams.EXPR_DISGUST to 0
            BasicParams.EXPR_FEAR to 0
            BasicParams.EXPR_SAD to 0
        } }
        else -> null
    }

    onEntry {
        // Pass data to GUI
        send(DataDelivery(buttons = buttons, inputFields = inputFieldData.keys.toList()))
    }

    // Users clicked any of our buttons
    onEvent(CLICK_BUTTON) {
        furhat.say("You pressed ${it.get("data") ?: "something I'm not aware of"}")
        send(SPEECH_DONE)
    }

    // Handle emotion updates with intensity
    onEvent(EMOTION_UPDATE) {
        val emotion = it.get("emotion") as? String
        intensity = (it.get("intensity") as? Number)?.toDouble()?.div(100) ?: 0.0  // Convert to 0.0 - 1.0 scale

        val gesture = emotion?.let { getGesture(it) }
        if (gesture != null) {
            furhat.gesture(gesture)
        }

        send(SPEECH_DONE)
    }

    // Handle variable set
    onEvent(VARIABLE_SET) {
        val data = it.get("data") as Record
        val variable = data.getString("variable")
        val value = data.getString("value")

        val answer = inputFieldData[variable]?.invoke(value)
        furhat.say(answer ?: "Something went wrong")

        send(SPEECH_DONE)
    }
}
