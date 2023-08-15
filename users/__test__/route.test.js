const request = require("supertest");
const app = require("../app");
const { connect, clearAllCollections, close } = require("./db.test");

beforeEach(async () => {
  await connect();
  await clearAllCollections();
});

afterAll(async () => {
  await clearAllCollections();
  await close();
});

const user = () => {
  const firstNames = ["John", "Jane", "Mike", "Emily", "David", "Sarah"];
  const lastNames = ["Doe", "Smith", "Johnson", "Brown", "Lee", "Wilson"];
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    userName: randomFirstName.toLowerCase() + Math.floor(Math.random() * 100),
    password: "password" + Math.floor(Math.random() * 1000),
    permissionLevel: Math.floor(Math.random() * 3) + 1,
  };
};

function createUser() {
  const firstNames = ["John", "Jane", "Mike", "Emily", "David", "Sarah"];
  const lastNames = ["Doe", "Smith", "Johnson", "Brown", "Lee", "Wilson"];
  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomUserName =
    randomFirstName.toLowerCase() + Math.floor(Math.random() * 100);
  const randomPassword = "password" + Math.floor(Math.random() * 1000);
  const randomPermissionLevel = Math.floor(Math.random() * 3) + 1;

  // Generate a random birthday within a reasonable range
  const start = new Date(1970, 0, 1);
  const end = new Date(2005, 11, 31);
  const randomBirthday = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  return {
    firstName: randomFirstName,
    lastName: randomLastName,
    userName: randomUserName,
    password: randomPassword,
    permissionLevel: randomPermissionLevel,
    birthday: randomBirthday.toISOString(), // Format as ISO string
  };
}

describe("Test the root path to make sure its running fine", () => {
  test("It should response the GET method", (done) => {
    request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("POST /users", () => {
  test("creates a new user", async () => {
    const user = createUser();
    const response = await request(app).post("/users").send(user).expect(201);

    expect(response.body).toHaveProperty("id");
  });
});

describe("GET /users", () => {
  test("GET a new user", async () => {
    await request(app).get("/users").expect(200);
  });
});

describe("GET /usersbyid", () => {
  test("GET a new user by id", async () => {
    const user = createUser();
    const response = await request(app).post("/users").send(user).expect(201);
    await request(app).get(`/users/${response.body.id}`).expect(200);
  });
});

describe("GET /usersbyid and check the fields", () => {
  test("GET a new user by id", async () => {
    const user = createUser();
    const response = await request(app).post("/users").send(user).expect(201);
    const getUserResponse = await request(app)
      .get(`/users/${response.body.id}`)
      .expect(200);
    // Check if the response contains the expected fields
    // Check if the response contains the expected fields
    console.log(getUserResponse.body);
    expect(getUserResponse.body).toHaveProperty("id");
    expect(getUserResponse.body).toHaveProperty("firstName", user.firstName);
    expect(getUserResponse.body).toHaveProperty("lastName", user.lastName);
    expect(getUserResponse.body).toHaveProperty("userName", user.userName);
    expect(getUserResponse.body).toHaveProperty("password");
    expect(getUserResponse.body).toHaveProperty(
      "permissionLevel",
      user.permissionLevel
    );

    expect(getUserResponse.body).toHaveProperty("isActive",true);
    expect(getUserResponse.body).toHaveProperty("status",[]);
    expect(getUserResponse.body).toHaveProperty("devices", []);
    expect(getUserResponse.body).toHaveProperty(
      "noderedInstance"
    );
    // Add more checks for other fields if needed
  });
});
describe("put/usersbyid", () => {
  test("update user by id", async () => {
    const user = createUser();
    const response = await request(app).post("/users").send(user).expect(201);
    await request(app)
      .put(`/users/${response.body.id}`)
      .send({ firstName: "Name2" })
      .expect(204);
  });
});

describe("delete/usersbyid", () => {
  test("delete user by id", async () => {
    const user = createUser();
    const response = await request(app).post("/users").send(user).expect(201);
    await request(app).delete(`/users/${response.body.id}`).expect(204);
  });
});

describe("POST/auth", () => {
  test("creates a new user", async () => {
    const user = createUser();
    await request(app).post("/users").send(user).expect(201);
    const response = await request(app)
      .post("/auth")
      .send({
        username: user.userName,
        password: user.password,
      })
      .expect(201);

    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });
});
