const app = require("../app.js");
const { User, sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const { generateToken, verifyToken } = require("../helpers/jwt");

let tokenUser = "";
let tokenAdmin = generateToken({ isAdmin: true });

const userData = {
  email: "viki.yaputra@gmail.com",
  password: "password",
  full_name: "Viki Yaputra",
  birth_date: "1986-11-25T13:53:22.317Z",
  gender: "male",
  register_as: "coder",
  main_card_showoff: "testing",
  is_premium: true,
  social_media_link: "www.social.com",
  portfolio_link: "www.portfolio.com",
};

afterAll((done) => {
  queryInterface
    .bulkDelete("Users", {})
    .then(() => done())
    .catch((err) => done(err));
});

describe("User Profile Testing", () => {
  it("201 Success register - should create new User", (done) => {
    request(app)
      .post("/register")
      .send(userData)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(201);
        // expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty("full_name", userData.full_name);
        expect(body).toHaveProperty("email", userData.email);
        expect(body).toHaveProperty("is_premium", false);
        expect(body).toHaveProperty("message", "User successfully created!");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("200 Success Login - should receive access_token", (done) => {
    request(app)
      .post("/login")
      .send({ email: userData.email, password: userData.password })
      .then((response) => {
        const { body, status } = response;
        tokenUser = body.access_token;
        expect(status).toBe(200);
        expect(body).toHaveProperty("access_token", expect.any(String));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("401 Failure Login - Wrong Password", (done) => {
    request(app)
      .post("/login")
      .send({ email: userData.email, password: "salah" })
      .then((response) => {
        const { body, status } = response;
        // tokenUser = body.access_token
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Username/Password Incorrect");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("401 Failure Login - Wrong Email", (done) => {
    request(app)
      .post("/login")
      .send({ email: "random@mail.com", password: userData.password })
      .then((response) => {
        const { body, status } = response;
        // tokenUser = body.access_token
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Username/Password Incorrect");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("200 Get Users - should receive array of users", (done) => {
    request(app)
      .get("/user")
      .set("access_token", tokenUser)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Array));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("200 Get User - should find single user", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .get(`/user/${id}`)
      .set("access_token", tokenUser)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("email", expect.any(String));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("200 Patch User - should edit user info", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .patch(`/user/${id}`)
      .set("access_token", tokenUser)
      .send({
        full_name: "Test Patch",
        register_as: "coder designer",
        social_media_link: "TEST www.social.com",
        portfolio_link: "TEST www.portfolio.com",
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty(
          "message",
          `User with id ${id} successfully modified`
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("200 Upgrade User - should upgrade user to premium", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .patch(`/user/${id}/upgrade`)
      .set("access_token", tokenAdmin)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty(
          "message",
          `User with id ${id} successfully upgraded`
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("200 Downgrade User - should upgrade user to premium", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .patch(`/user/${id}/downgrade`)
      .set("access_token", tokenAdmin)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty(
          "message",
          `User with id ${id} successfully downgraded`
        );
        console.log(body, "ini response dari downgrade");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("200 Delete User - should delete user", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .delete(`/user/${id}`)
      .set("access_token", tokenUser)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty(
          "message",
          `User with id ${id} successfully deleted!`
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
