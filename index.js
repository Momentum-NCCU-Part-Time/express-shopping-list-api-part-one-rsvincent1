const express = require("express");
const app = express();
const config = { port: process.env.PORT || 3000 };

mongoose.set("strictQuery", false);
const mongoDB = app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});
