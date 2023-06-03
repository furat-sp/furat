//document.getElementById('formCreate').hidden = true;

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getFirestore,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjRzpuYK-Khtt16TzxQq3--ckyWzQqz60",
  authDomain: "furat-a5d96.firebaseapp.com",
  databaseURL:
    "https://furat-a5d96-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "furat-a5d96",
  storageBucket: "furat-a5d96.appspot.com",
  messagingSenderId: "618435503538",
  appId: "1:618435503538:web:3de2c7e38ecdc2e9eab0ab",
  measurementId: "G-HGM3NS79ND",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

//on open page load all users
$(document).ready(function () {
  $("#dataTbl td").remove();
  var rowNum = 0;
  ///
  getDocs(collection(db, "newusers")).then((docSnap) => {
    docSnap.forEach((doc) => {
      rowNum += 1;
      var row =
        "<tr><td>" +
        rowNum +
        "</td><td>" +
        doc.data().Name +
        "</td><td class='email'>" +
        doc.data().email +
        "</td><td class='password'>" +
        doc.data().password +
        "</td><td class='uid text-hide'>" +
        doc.data().userId +
        "</td><td><input type='button'  class='btn btn-danger' value='Delete'></td></tr>";
      $(row).appendTo("#dataTbl");
      //console.log("Document data:", doc.data().email);
    });
  });
});
//create account
signUp.addEventListener("click", (e) => {
  var email = document.getElementById("email").value;
  var name = document.getElementById("name").value;
  var type = document.getElementById("type").value;
  var password = document.getElementById("psw").value;
  var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  if (name.length===0) {
    alert("name  can't be empty");
    //$('#name').after('<span class="text-danger">Name  canot be empty *</span>');
    $('#name').focus();
        return false;  
  }
  if (email.length<=0) {
    alert("Email  can't be empty");
    //$('#email').after('<span class="text-danger">Email  canot be empty*</span>');
    $('#email').focus();
        return false;   
  }
  if(!email.match(mailformat))
  {
    document.getElementById("email").focus();
    //$('#email').after('<span class="text-danger">Invalid email address</span>');
    alert("You hava Entered an Invalid email address.");
    $('#email').focus();
       return false;
  }
  if (password.length==0) {
    alert("Password  can't be empty");
    //$('#psw').after('<span class="error">Password  canot be empty</span>');
    $('#psw').focus();
    return false;
  }
  if (password.length < 8) {  
    //$('#psw').after('<span class="error">Password must be at least 8 characters long</span>');
    alert("Password must be at least 8 characters long"); 
    $('#psw').focus();
    return false;
  }

  //sign up user
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const user_id = user.uid;
      // ... user.uid
      setDoc(doc(db, "newusers", user_id), {
        email: email,
        password: password,
        userId: user_id,
        AccountType: type,
        Name: name,
      })
        .then(() => {
          // Data saved successfully!
          alert("Account Type ("+type+ ") created successfully");
          document.getElementById("email").value = "";
          document.getElementById("name").value = "";
          document.getElementById("psw").value = "";

          $("#dataTbl td").remove();
          var rowNum = 0;
          ///
          getDocs(collection(db, "newusers")).then((docSnap) => {
            docSnap.forEach((doc) => {
              rowNum += 1;
              var row =
                "<tr><td>" +
                rowNum +
                "</td><td>" +
                doc.data().Name +
                "</td><td class='email'>" +
                doc.data().email +
                "</td><td class='password'>" +
                doc.data().password +
                "</td><td class='uid text-hide'>" +
                doc.data().userId +
                "</td><td><input type='button'  class='btn btn-danger' value='Delete'></td></tr>";
              $(row).appendTo("#dataTbl");
              //console.log("Document data:", doc.data().email);
            });
          });
        })
        .catch((error) => {
          // The write failed...
          alert(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      $('#email').focus();
      alert("Email already exists Please enter an available email address");
    });
});

//when click  delete
$("#dataTbl").on("click", 'input[type="button"]', function (e) {
  var userId = $(this)
    .closest("tr") // Finds the closest row <tr>
    .find(".uid") // Gets a descendent with class="nr"
    .text(); // Retrieves the text within <td>

  // you must catch the emil and password of the user you need to delete
  let mainDiv = e.target.parentNode.parentNode;
  let email =
    e.target.parentNode.parentNode.querySelector(".email").textContent;
  let password =
    e.target.parentNode.parentNode.querySelector(".password").textContent;

  // you must signIn before delete user
  userRemove(userId, email, password, mainDiv);
});

function userRemove(userId, email, password, mainDiv) {
  signInWithEmailAndPassword(auth, `${email}`, `${password}`)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      user
        .delete()
        .then(() => {
          console.log("User account deleted successfully");
          deleteDoc(doc(db, "newusers", userId));
          alert("Successfully deleted user");
          mainDiv.remove();
        })
        .catch((error) => {
          console.error("Error deleting user account:", error);
        });

      var lgDate = new Date();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

//when clcik all
// read data
getData.addEventListener("click", (e) => {
  $("#dataTbl td").remove();
  var rowNum = 0;
  ///
  getDocs(collection(db, "newusers")).then((docSnap) => {
    docSnap.forEach((doc) => {
      rowNum += 1;
      var row =
        "<tr><td>" +
        rowNum +
        "</td><td>" +
        doc.data().Name +
        "</td><td class='email'>" +
        doc.data().email +
        "</td><td class='password'>" +
        doc.data().password +
        "</td><td class='uid text-hide'>" +
        doc.data().userId +
        "</td><td><input type='button'  class='btn btn-danger' value='Delete'></td></tr>";

      $(row).appendTo("#dataTbl");
      //console.log("Document data:", doc.data().email);
    });
  });
  //
});

//when click Search
search.addEventListener("click", (e) => {
  $("#dataTbl td").remove();
  var rowNum = 0;
  var txtSearch = document.getElementById("txtSearch").value;
  //const dbRef = ref(database, 'users/');
  if (txtSearch.length === 0) {
    alert("please Enter Email");
  } else {
    const q = query(
      collection(db, "newusers"),
      where("email", "==", txtSearch)
    );

    getDocs(q).then((docSnap) => {
      docSnap.forEach((doc) => {
        rowNum += 1;
        var row =
          "<tr><td>" +
          rowNum +
          "</td><td>" +
          doc.data().Name +
          "</td><td>" +
          doc.data().email +
          "</td><td>" +
          doc.data().password +
          "</td><td class='uid text-hide'>" +
          doc.data().userId +
          "</td><td><input type='button'  class='btn btn-danger' value='Delete'></td></tr>";

        $(row).appendTo("#dataTbl");
        console.log("Document data:", doc.data().email);
      });
    });
  }
});


