const express = require("express");
const path = require("path");

const app = express();

app.use("/", express.static("client"));

app.get("/", async (req, res) => {
    res.sendFile(path.resolve("client/index.html"));
});

app.listen(8080, () => {
    console.log("Server running on port 80");
});
