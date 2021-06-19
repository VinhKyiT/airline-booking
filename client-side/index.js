const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require('./routes/index.route');
const session = require("express-session");
var paypal = require("paypal-rest-sdk");

require("dotenv").config();


app.set("trust proxy", 1); // trust first proxy
app.use(
    session({
        secret: process.env.SECRET_SESSION,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(require("flash")());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    next();
});
// app.use(flash(app));

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(function (req, res) {
//     res.setHeader("Content-Type", "text/html");
//     res.end();
// });
app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");


router(app)

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: "AdHXUICnzbdMboZmjnQkq8Vxvh6F6Il0ffiLxV3Aq6FW_apHoteHIjG6KgUxjOQERWjz77-cy6GjJ77w",
    client_secret: "ENgD12T8tpayy2_pHkdHU3klUo_B8UW2ElDrOS35dK5g1QR4-NnNjcc2OUqC-YkVosBzvKwGbwQwbSAP",
});


app.get("/success", (req, res) => {
    res.render('./flight/success');
});
app.get("/fail", (req, res) => {
    res.send("fail");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});