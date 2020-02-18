const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;

const users = require("./routes/users");
const items = require("./routes/items");
const orders = require("./routes/orders");

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

mongoose
  .connect(
    'mongodb://127.0.0.1:27017/ssad',
    { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true }
  )
  .catch(err => console.log(err));
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established succesfully.");
})

app.use("/api/users", users);
app.use("/api/items", items);
app.use("/api/orders", orders);

app.listen(PORT, () => console.log(`Backend server up and running on port ${PORT} !`));