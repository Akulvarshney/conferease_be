const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./db/connectDB.js");

const loginRoutes = require("./routes/loginSignUpRoutes.js");
const roles = require("./routes/rolesRoutes.js");
const conferenceRoutes = require("./routes/conferenceRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js");
const submsssionRoutes = require("./routes/submissionRoutes.js");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Requested URL:", req.url, new Date());
  next();
});

app.use("/api/v1", loginRoutes);
app.use("/api/v1", roles);
app.use("/api/v1", conferenceRoutes);
app.use("/api/v1", usersRoutes);
app.use("/api/v1", submsssionRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
