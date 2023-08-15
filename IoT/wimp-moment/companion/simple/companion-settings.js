import * as messaging from "messaging";
import { settingsStorage } from "settings";

let firebaseTestURL = "https://wimp-project-63c97-default-rtdb.firebaseio.com";
/// ------------------------ You change you firabase url here ------------------------------------------////
let firebaseEndpoint = firebaseTestURL;
///  --------------------------------------------------------------------------------------------------////

export function initialize() {
  settingsStorage.addEventListener("change", (evt) => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
  messaging.peerSocket.addEventListener("message", (evt) => {
    const currentData = JSON.parse(evt.data);
    send(currentData.topic, currentData.data);
  });
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val),
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}

function send(topic, data) {
  let firebaseTestURL = `${firebaseEndpoint}/${topic}.json`;
  fetch(firebaseTestURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("Response from server: " + response.status);
      console.log("Response details : " + JSON.stringify(response));
      return response.json();
    })
    .then((data) => {
      console.log("Response from server: " + JSON.stringify(data));
    })
    .catch((error) => {
      console.log("Error from server: " + error);
    });
}
