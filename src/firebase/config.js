import { initializeApp } from "firebase/app";
import { initializeFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCCwnk78mMePprJE-v5dHot9m9Phr_U-nw",
	authDomain: "getitdone-2c2ec.firebaseapp.com",
	projectId: "getitdone-2c2ec",
	storageBucket: "getitdone-2c2ec.appspot.com",
	messagingSenderId: "583041867326",
	appId: "1:583041867326:web:dbf25e84b2a850c2fd3b6f",
};

const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const db = initializeFirestore(firebaseApp, {
	ignoreUndefinedProperties: true,
});
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Timestamp
const timestamp = serverTimestamp();

export { db, auth, storage, timestamp };
