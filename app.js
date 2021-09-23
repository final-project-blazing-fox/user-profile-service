if (!process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const router = require("./routes/routes");
const { errorHandler } = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use(errorHandler);

// if (!process.env.NODE_ENV === "test") {
module.exports = app;
// } else {
//   app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
//   });
// }
