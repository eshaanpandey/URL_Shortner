const express = require('express');
const app = express();
const PORT = 8001;
const path = require('path');

const {connectToMongoDB} = require("./connect");
const urlRoute = require("./routes/url");

const URL = require("./models/url");
const { appendFileSync } = require('fs');

const staticRoute = require("./routes/staticRouter");

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(()=> console.log("MongoDB connected"));

app.use("/", staticRoute);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

app.get('/:shortId', async (req, res) =>{
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
    res.redirect(entry.redirectUrl);
});

app.get("/test", async(req, res) =>{
    const allUrls = await URL.find({});

    return res.render("home", {
        urls: allUrls,
    })
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));