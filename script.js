street3box = document.querySelector(".danger");
street2box = document.querySelector(".warning");
street1box = document.querySelector(".normal");
nodanger = document.querySelector(".nodanger");

status_dot = document.querySelector(".wrapper .status-dot i");

s1tang = document.getElementById("nsec");
s2tang = document.getElementById("wsec");
s3tang = document.getElementById("dsec");
sheet = document.styleSheets[2];

let rule;
for (let i = 0; i < sheet.cssRules.length; i++) {
  const r = sheet.cssRules[i];
  if (r.selectorText === ".wave::before, .wave::after") {
    rule = r;
    break;
  }
}

show = document.querySelectorAll(".wave i");
sound = document.getElementById("siren-audio");
muteBtn = document.querySelector("#mute-btn");
clickOnMute = false;

isfirsttimeS1 = true;
isfirsttimeS2 = true;
isfirsttimeS3 = true;

var alertObject = null;
threshold = 10;
message = "danger";
var changeNum = 1;



muteBtn.addEventListener("click", function () {
  if (clickOnMute == false) {
    clickOnMute = true;
    sound.muted = true;
    muteBtn.classList.replace("fa-volume-up", "fa-volume-off");
  } else {
    clickOnMute = false;
    sound.muted = false;
    muteBtn.classList.replace("fa-volume-off", "fa-volume-up");
  }
});

setInterval(() => {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.thingspeak.com/channels/2097223/feeds.json?results=1",

    true
  );
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        status_dot.style.color = "green";
        setTimeout(() => {
          status_dot.style.color = "white";
        }, 200);

        let data = xhr.response;
        obj = JSON.parse(data);
        array_data = obj.feeds;
        water_level_steet1 = array_data[0]["field1"];
        water_level_steet2 = array_data[0]["field2"];
        water_level_steet3 = array_data[0]["field3"];

        if (
          water_level_steet1 > threshold &&
          water_level_steet2 > threshold &&
          water_level_steet3 > threshold
        ) {
          street1box.style.opacity = "1";
          street2box.style.opacity = "1";
          street3box.style.opacity = "1";
          nodanger.style.opacity = "0";
          s1tang.style.display = "block";
          s2tang.style.display = "block";
          s3tang.style.display = "block";
          message = "King Abdulaziz Rd., Prince Sultan Rd. and Al-Madinah Al-Munawara Rd. \nin danger water level \nThe gates it close";
          dangerStreet1();
          dangerStreet2();
          dangerStreet3();
          if (
            isfirsttimeS1 ||
            isfirsttimeS2 ||
            isfirsttimeS3 ||
            changeNum != 8
          ) {
            alertWithSound("data/popup.mp3");
            isfirsttimeS1 = false;
            isfirsttimeS2 = false;
            isfirsttimeS3 = false;
            changeNum = 8;
          }
        } else if (
          water_level_steet1 > threshold &&
          water_level_steet2 > threshold
        ) {
          isfirsttimeS3 = true;
          street1box.style.opacity = "1";
          street2box.style.opacity = "1";
          street3box.style.opacity = "0";
          nodanger.style.opacity = "0";
          //street3box.style.opacity = "0.2";
          s1tang.style.display = "block";
          s2tang.style.display = "block";
          s3tang.style.display = "none";
          message = "King Abdulaziz Rd. and Prince Sultan Rd. \nin danger water level ";
          dangerStreet1();
          dangerStreet2();
          if (isfirsttimeS1 || isfirsttimeS2 || changeNum != 7) {
            alertWithSound("data/popup.mp3");
            isfirsttimeS1 = false;
            isfirsttimeS2 = false;
            changeNum = 7;
          }
        } else if (
          water_level_steet2 > threshold &&
          water_level_steet3 > threshold
        ) {
          isfirsttimeS1 = true;
          //street1box.style.opacity = "0.2";
          street1box.style.opacity = "0";
          street2box.style.opacity = "1";
          street3box.style.opacity = "1";
          nodanger.style.opacity = "0";
          s1tang.style.display = "none";
          s2tang.style.display = "block";
          s3tang.style.display = "block";
          message = "Prince Sultan Rd. and Al-Madinah Al-Munawara Rd. \nin danger water level";
          dangerStreet2();
          dangerStreet3();
          if (isfirsttimeS2 || isfirsttimeS3 || changeNum != 6) {
            alertWithSound("data/popup.mp3");
            isfirsttimeS2 = false;
            isfirsttimeS3 = false;
            changeNum = 6;
          }
        } else if (
          water_level_steet1 > threshold &&
          water_level_steet3 > threshold
        ) {
          isfirsttimeS2 = true;

          street1box.style.opacity = "1";
          street2box.style.opacity = "0";
          nodanger.style.opacity = "0";
          //street2box.style.opacity = "0.2";
          street3box.style.opacity = "1";
          s1tang.style.display = "block";
          s2tang.style.display = "none";
          s3tang.style.display = "block";
          message = "King Abdulaziz Rd. and Al-Madinah Al-Munawara Rd. \nin danger water level";
          dangerStreet1();
          dangerStreet3();
          if (isfirsttimeS1 || isfirsttimeS3 || changeNum != 5) {
            alertWithSound("data/popup.mp3");
            isfirsttimeS1 = false;
            isfirsttimeS3 = false;
            changeNum = 5;
          }
        } else if (water_level_steet1 > threshold) {
          isfirsttimeS2 = true;
          isfirsttimeS3 = true;
          street1box.style.opacity = "1";
          //street2box.style.opacity = "0.2";
          street2box.style.opacity = "0";
          street3box.style.opacity = "0";
          nodanger.style.opacity = "0";
          //street3box.style.opacity = "0.2";
          s1tang.style.display = "block";
          s2tang.style.display = "none";
          s3tang.style.display = "none";
          message = "King Abdulaziz Rd. \n in danger water level";
          dangerStreet1();
          if (isfirsttimeS1 || changeNum != 4) {
            alertWithSound("data/popup.mp3");
            isfirsttimeS1 = false;
            changeNum = 4;
          }
        } else if (water_level_steet2 > threshold) {
          isfirsttimeS1 = true;
          isfirsttimeS3 = true;
          s1tang.style.display = "none";
          s2tang.style.display = "block";
          s3tang.style.display = "none";
          //street1box.style.opacity = "0.2";
          street1box.style.opacity = "0";
          street2box.style.opacity = "1";
          street3box.style.opacity = "0";
          nodanger.style.opacity = "0";
          //street3box.style.opacity = "0.2";
          message = "Prince Sultan Rd.\nin danger water level";
          dangerStreet2();
          if (isfirsttimeS2 || changeNum != 3) {
            alertWithSound("data/popup.mp3");
            isfirsttimeS2 = false;
            changeNum = 3;
          }
        } else if (water_level_steet3 > threshold) {
          isfirsttimeS1 = true;
          isfirsttimeS2 = true;
          //street1box.style.opacity = "0.2";
          street1box.style.opacity = "0";
          //street2box.style.opacity = "0.2";
          street2box.style.opacity = "0";
          street3box.style.opacity = "1";
          nodanger.style.opacity = "0";
          s1tang.style.display = "none";
          s2tang.style.display = "none";
          s3tang.style.display = "block";
          message = "Al-Madinah Al-Munawara Rd. \nin danger water level ";
          dangerStreet3();
          if (isfirsttimeS3 || changeNum != 2) {
            alertWithSound("data/popup.mp3");
            isfirsttimeS3 = false;
            changeNum = 2;
          }
        } else {
          isfirsttimeS1 = true;
          isfirsttimeS2 = true;
          isfirsttimeS3 = true;
          s1tang.style.display = "none";
          s2tang.style.display = "none";
          s3tang.style.display = "none";

          //street2box.style.opacity = "0.2";
          street2box.style.opacity = "0";
          //street3box.style.opacity = "0.2";
          street3box.style.opacity = "0";
          //street1box.style.opacity = "0.2";
          street1box.style.opacity = "0";
          nodanger.style.opacity = "1";
          sound.muted = true;
          message = "";
          changeNum = 1;
          if (alertObject) {
            alertObject.remove();
          }
        }
      } else {
        status_dot.style.color = "white";
        street2boxe.style.opacity = "0";
        street3box.style.opacity = "0";
        nodanger.style.opacity = "0";

        street1box.style.opacity = "0";
        s1tang.style.display = "none";
        s2tang.style.display = "none";
        s3tang.style.display = "none";
        sound.muted = true;
      }
    } else {
      status_dot.style.color = "white";
      street2box.style.opacity = "0";
      street3box.style.opacity = "0";
      street1box.style.opacity = "0";
      nodanger.style.opacity = "0";
      s1tang.style.display = "none";
      s2tang.style.display = "none";
      s3tang.style.display = "none";
      sound.muted = true;
    }
  };
  xhr.send();
}, 1000);

function dangerStreet1() {
  if (rule) {
    rule.style.width = "120%";
    rule.style.height = "120%";
  }
  street1box.style.backgroundColor = "red";
  show[0].innerHTML = water_level_steet1 + "cm";
  if (!clickOnMute) {
    sound.muted = false;
  }

  /*
    var blinkCount = 0;
    var blinkInterval = setInterval(function () {
      if (blinkCount % 2 === 0) {
        street1box.style.backgroundColor = "red";
      } else {
        street1box.style.backgroundColor = "white";
      }
      blinkCount++;
      if (blinkCount > 4) {
        clearInterval(blinkInterval);
        street1box.style.backgroundColor = "red";
      }
    }, 400);*/
}

function dangerStreet2() {
  if (rule) {
    rule.style.width = "120%";
    rule.style.height = "120%";
  }
  street2box.style.backgroundColor = "red";
  show[1].innerHTML = water_level_steet2 + "cm";
  muteBtn.style.display = "block";
  if (!clickOnMute) {
    sound.muted = false;
  }

  /*
  var blinkCount = 0;
  var blinkInterval = setInterval(function () {
    if (blinkCount % 2 === 0) {
      street2box.style.backgroundColor = "red";
    } else {
      street2box.style.backgroundColor = "white";
    }
    blinkCount++;
    if (blinkCount > 4) {
      clearInterval(blinkInterval);
      street2box.style.backgroundColor = "white";
    }
  }, 200);*/
}

function dangerStreet3() {
  if (rule) {
    rule.style.width = "120%";
    rule.style.height = "120%";
  }
  street3box.style.backgroundColor = "red";
  show[2].innerHTML = water_level_steet3 + "cm";
  muteBtn.style.display = "block";
  if (!clickOnMute) {
    sound.muted = false;
  }

  /*
  var blinkCount = 0;
  var blinkInterval = setInterval(function () {
    if (blinkCount % 2 === 0) {
      street3box.style.backgroundColor = "red";
    } else {
      street3box.style.backgroundColor = "white";
    }
    blinkCount++;
    if (blinkCount > 4) {
      clearInterval(blinkInterval);
      street3box.style.backgroundColor = "white";
    }
  }, 200);*/
}

function alertWithSound(soundUrl) {
  var sound = new Audio(soundUrl);
  sound.autoplay = true;
  sound.addEventListener("canplaythrough", function () {
    // if (!clickOnMute) {
    //   sound.muted = false;
    // }
    sound.play();
    if (alertObject) {
      alertObject.remove();
    }
    // Create the modal container
    var modalContainer = document.createElement("div");
    modalContainer.style.position = "fixed";
    modalContainer.style.top = "0";
    modalContainer.style.left = "0";
    modalContainer.style.width = "100%";
    modalContainer.style.height = "100%";
    modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalContainer.style.zIndex = "999";

    // Create the modal content
    var modalContent = document.createElement("div");
    modalContent.style.position = "absolute";
    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.style.top = "50%";
    modalContent.style.left = "50%";
    modalContent.style.transform = "translate(-50%, -50%)";
    modalContent.style.backgroundColor = "rgb(196, 3, 3)";
    modalContent.style.padding = "20px";
    modalContent.style.border = "3px solid black";
    modalContent.style.boxShadow = "0px 0px 10px 2px rgba(0,0,0,0.5)";

    // Create the message element
    var messageElement = document.createElement("p");
    messageElement.style.fontSize = "20px";
    messageElement.style.fontWeight = "600";
    messageElement.style.color = "white";
    messageElement.style.border = "3px solid #C8C8C8";
    messageElement.style.padding = "40px";
    messageElement.style.backgroundColor = "rgb(196, 3, 3)";
    messageElement.style.textAlign = "center";
    messageElement.style.marginBottom = "2vh";
    messageElement.innerText = message;
    modalContent.appendChild(messageElement);

    // Create the OK button
    var okButton = document.createElement("button");
    okButton.style.padding = "10px 25px";
    okButton.style.border = "none";
    okButton.style.borderRadius = "10px";
    okButton.style.backgroundColor = "#073763";
    okButton.style.color = "white";
    okButton.style.cursor = "pointer";
    okButton.innerText = "OK";
    isdisapper = false;
    okButton.addEventListener("click", function () {
      alertObject.remove();
    });
    modalContent.appendChild(okButton);
    alertObject = modalContainer.appendChild(modalContent);
    document.body.appendChild(alertObject);
  });
}
