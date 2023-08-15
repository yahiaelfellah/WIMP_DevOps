/*
  Returns the Location, with off-wrist detection.
  Callback raised to update your UI.
*/
import { me } from "appbit";
import { geolocation } from "geolocation";
import { send } from "./utils";

let watchID;

export function initialize() {
  if (me.permissions.granted("access_location")) {
    start();
  } else {
    console.log("Denied Location or User Profile permissions");
  }
}

function getReading() {
  watchID = geolocation.watchPosition(locationSuccess, locationError, {
    timeout: 60 * 1000,
  });
  function locationSuccess(position) {
    send({
      topic: "geolocation",
      data: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
    console.log(
      "Latitude: " + position.coords.latitude,
      "Longitude: " + position.coords.longitude
    );
  }
  function locationError(error) {
    console.log("Error: " + error.code, "Message: " + error.message);
  }
}

function start() {
  if (!watchID) {
    getReading();
    watchID = setInterval(getReading,1000);
  }
}

function stop() {
  geolocation.clearWatch(watchID);
  clearInterval(watchID);
  watchID = null;
}
