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

describe("Register User", () => {
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

  it("400 Failed register - User must be unique", (done) => {
    request(app)
      .post("/register")
      .send(userData)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        // expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty("message", "Email must be unique");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Login User", () => {
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
      .send({ email: "salah@email.com", password: "salah" })
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
});

describe("Get All User", () => {
  it("200 Success Get Users - should receive array of users", (done) => {
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

  it(" 401 Failure Get Users - Authentication Failed", (done) => {
    request(app)
      .get("/user")
      .set("access_token", "abcdefghijklmnopqrstu")
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Authentication Failed");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Get Single User", () => {
  it("200 Success Get User - should find single user", (done) => {
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

  it("404 Failure Get User - User Not Found", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .get(`/user/9999`)
      .set("access_token", tokenUser)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "User not Found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Edit User Info", () => {
  it("200 Success Patch User - should edit user info", (done) => {
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

  it("401 Failure Patch User - Authorization Failed", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .patch(`/user/${id}`)
      .set(
        "access_token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzAsImZ1bGxfbmFtZSI6IlZpa2kgWWFwdXRyYSIsImVtYWlsIjoidmlraS55YXB1dHJhQGdtYWlsLmNvbSIsImlzX3ByZW1pdW0iOmZhbHNlLCJpYXQiOjE2MzI1NDc5Njd9.f_9bGJpwspVxago230JmBSzCDB3j61aAKt5vbHia3kw"
      )
      .send({
        full_name: "Test Patch",
        register_as: "coder designer",
        social_media_link: "TEST www.social.com",
        portfolio_link: "TEST www.portfolio.com",
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("404 Failure Patch User - User not Found", (done) => {
    request(app)
      .patch(`/user/9999`)
      .set("access_token", tokenAdmin)
      .send({
        full_name: "Test Patch",
        register_as: "coder designer",
        social_media_link: "TEST www.social.com",
        portfolio_link: "TEST www.portfolio.com",
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "User not Found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Change User Premium Status", () => {
  it("200 Success Upgrade User - should upgrade user to premium", (done) => {
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

  it("200 Success Downgrade User - should upgrade user to premium", (done) => {
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

  it("404 Failure Upgrade User - User not Found", (done) => {
    request(app)
      .patch(`/user/9999/upgrade`)
      .set("access_token", tokenAdmin)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "User not Found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("401 Failure Upgrade User - Only admin can change membership status", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .patch(`/user/${id}/upgrade`)
      .set("access_token", tokenUser)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty(
          "message",
          "Only admin can change membership status"
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("404 Failure Downgrade User - User not Found", (done) => {
    request(app)
      .patch(`/user/9999/downgrade`)
      .set("access_token", tokenAdmin)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "User not Found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("401 Failure downgrade User - Only admin can change membership status", (done) => {
    const { id } = verifyToken(tokenUser);
    request(app)
      .patch(`/user/${id}/downgrade`)
      .set("access_token", tokenUser)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty(
          "message",
          "Only admin can change membership status"
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Delete User", () => {
  it("200 Success Delete User - should delete user", (done) => {
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

  it("404 Failure Delete User - User not Found", (done) => {
    request(app)
      .delete(`/user/9999`)
      .set("access_token", tokenAdmin)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "User not Found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
