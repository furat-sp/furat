import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
import { getFirestore,doc,getDoc } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';
// TODO: Replace the following with your app's Firebase project configuration
const firebaseApp = initializeApp(
    {
        apiKey: "AIzaSyAjRzpuYK-Khtt16TzxQq3--ckyWzQqz60",
        authDomain: "furat-a5d96.firebaseapp.com",
        databaseURL: "https://furat-a5d96-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "furat-a5d96",
        storageBucket: "furat-a5d96.appspot.com",
        messagingSenderId: "618435503538",
        appId: "1:618435503538:web:3de2c7e38ecdc2e9eab0ab",
        measurementId: "G-HGM3NS79ND"
    });

// Initialize Firebase
//const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

async function getRoleOfUser(userId) {
    const userCollection = "newusers";
    const docRef = doc(db, userCollection, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
        return data["AccountType"]
    } else {
        return null;
    }
}

//Functions
document.getElementById("btn").addEventListener("click", function () {


    var email = document.getElementById("email").value;
    if (email == "") {
        alert("Email or Password can't be empty");
        return false;
    }
    var password = document.getElementById("password").value;
    if (password == "") {
        alert("Email or Password can't be empty");
        return false;
    }
    localStorage.setItem("user", document.getElementById("email").value);
    localStorage.setItem("pass", document.getElementById("password").value);

    const auth = getAuth()




    signInWithEmailAndPassword(auth, email, password).then(async (cred) => {
        const userId = cred.user.uid;
        const role = await getRoleOfUser(userId)
        let url = "/";
        if (role === "Admin") {
          url = "/AdminPage.html"

        } else if (role === "Employee") {
            url = "/Dashboard.html"
        } else {
            alert("Unknown AccountType")
        }

        window.location = url

    })
        .catch(function (error) {
            console.error(error)
            alert("Email or Password invalid")
        });

});



