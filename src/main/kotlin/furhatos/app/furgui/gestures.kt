package furhatos.app.characterparams.gestures

import furhatos.gestures.ARKitParams
import furhatos.gestures.CharParams
import furhatos.gestures.CharParams.*
import furhatos.gestures.defineGesture
import furhatos.gestures.BasicParams



val BigEyes = defineGesture("BigEyes") {
    frame(0.35, 3.4){
        EYES_SCALE_UP to 1.0

    }
    reset(4.0)
}


val Joy = defineGesture("Joy") {
    frame(0.35, 3.4){
        BasicParams.SMILE_OPEN to 1.0

    }
}

