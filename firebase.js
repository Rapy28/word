import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDwqFrntmJU12a6wxayeTb-iP0A_ZlDb0Y",
  authDomain: "crosswordle-mg.firebaseapp.com",
  projectId: "crosswordle-mg",
  storageBucket: "crosswordle-mg.appspot.com",
  messagingSenderId: "511788984229",
  appId: "1:511788984229:web:d126cf8f705dc975d02a4c",
  measurementId: "G-7S3RXB44Q1"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = 'en';
const db = getFirestore(app);
const provider = new GoogleAuthProvider();


const googleLogin = document.getElementById("google-signin-btn");
if (googleLogin) {
  googleLogin.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        let username = prompt("Enter a unique username:");
        if (!username) {
          alert("Username is required to proceed.");
          return;
        }

        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          username: username,
          photoURL: user.photoURL,
          createdAt: serverTimestamp()
        });

        alert(`Signed up as ${username}`);
      } else {
        const existingUsername = userSnap.data().username;
        alert(`Welcome back, ${existingUsername}!`);
      }
    } catch (error) {
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        alert(`Sign-in failed: ${error.message}`);
      } else {
        console.log("Sign-in popup was cancelled or closed by user.");
      }
    }
  });
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User signed in:', user.email, user.photoURL);
  }
});

export { auth, db };
