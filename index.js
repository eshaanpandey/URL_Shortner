const express = require('express');
const app = express();
const PORT = 8001;
const path = require('path');
const cookieParser = require('cookie-parser');

const {connectToMongoDB} = require("./connect");

const {restrictToLoggedinUserOnly, checkAuth} = require('./middlewares/auth');
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(()=> console.log("MongoDB connected"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use("/", checkAuth, staticRoute);
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

app.get('/url/:shortId', async (req, res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },
    {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    });
    res.redirect(entry.redirectURL);
});

app.get("/test", async(req, res) =>{
    const allUrls = await URL.find({});

    return res.render("home", {
        urls: allUrls,
    })
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));