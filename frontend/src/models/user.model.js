/**
 *  Create User interface in order to use it for mapping
 */
export default class User {
  constructor(data) {
    this._id = data._id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.userName = data.userName;
    this.permissionLevel = data.permissionLevel;
    this.devices = data.devices;
    this.flows = data.flows;
    this.status = data.status;
  }
  // ...
}
