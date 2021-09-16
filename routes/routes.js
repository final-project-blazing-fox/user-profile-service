const UserController = require("../controllers/UserController");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("ahahhahaha");
});

router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.findUser);
router.post("/users", UserController.createUser);

module.exports = router;
