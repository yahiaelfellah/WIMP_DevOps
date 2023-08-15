/*
  Returns the Heart Rate BPM, with off-wrist detection.
  Callback raised to update your UI.
*/
import { me } from "appbit";
import { display } from "display";
import { Accelerometer } from "accelerometer";
import { user } from "user-profile";
import { send } from "./utils";

let accel, watchID, accCallback;
let lastReading = 0;
let accelerometerData = [];
let speed;

// Initialize variables
let velocity = { x: 0, y: 0, z: 0 };
let position = { x: 0, y: 0, z: 0 };
// Time interval between accelerometer readings (in seconds)
const timeInterval = 0.01; // for example, 10 milliseconds

export function initialize(callback) {
  if (Accelerometer) {
    accCallback = callback;
    accel = new Accelerometer({ frequency: 20 });
    setupEvents();
    start();
    lastReading = accel.timestamp;
  } else {
    console.log("Denied Heart Rate or User Profile permissions");
    callback({
      speed: "???",
      unit: "denied",
    });
  }
}

function calculateVelocity() {
  // Calculate velocity and position
  for (let i = 1; i < accelerometerData.length; i++) {
    const acceleration = accelerometerData[i];

    // Integrate acceleration to obtain velocity
    velocity.x += acceleration.x * timeInterval;
    velocity.y += acceleration.y * timeInterval;
    velocity.z += acceleration.z * timeInterval;

    // Integrate velocity to obtain position
    position.x += velocity.x * timeInterval;
    position.y += velocity.y * timeInterval;
    position.z += velocity.z * timeInterval;
  }
  // Calculate speed (magnitude of velocity vector)
  const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
  return speed;
}

function getReading() {
  accel.addEventListener("reading", () => {
    if (accel.timestamp === lastReading) {
      speed = "--";
    } else {
      lastReading = accel.timestamp;
      const data = { x: accel.x, y: accel.y, z: accel.z };
      accelerometerData.push(data);
      speed = calculateVelocity();
      send({ topic: "accelerometer", data: data });
      accCallback({
        speed: speed,
        unit: "m/s",
      });
    }
  });
}

function setupEvents() {
  display.addEventListener("change", function () {
    display.on ? accel.start() : accel.stop();
  });
}

function start() {
  if (!watchID) {
    accel.start();
    getReading();
    watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  accel.stop();
  clearInterval(watchID);
  watchID = null;
}
