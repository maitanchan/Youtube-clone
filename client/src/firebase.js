import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {

    apiKey: "AIzaSyD_yP8kXrnB6lJWIapAUikF1Zf93tT63eE",
    authDomain: "video-app-c1b1e.firebaseapp.com",
    projectId: "video-app-c1b1e",
    storageBucket: "video-app-c1b1e.appspot.com",
    messagingSenderId: "358359381105",
    appId: "1:358359381105:web:1dc42145307aca44d097d0"

}

const app = initializeApp(firebaseConfig);

export const auth = getAuth()

export const provider = new GoogleAuthProvider()

export default app