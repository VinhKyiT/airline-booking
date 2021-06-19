const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const router = require("./routes/index.route");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser('mySecret'));
// app.use(function (req, res) {
//     res.setHeader("Content-Type", "text/plain");
//     res.write("you posted:\n");
//     res.end(JSON.stringify(req.body, null, 2));
// });
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");

router(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
