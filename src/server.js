import express from "express";
import path from "path";
import items from "./items.js";

const app = express();

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.get("/api/products", (req, res) => {
    res.send(items);
});

const port = 4000;

app.listen(port, () => {
    console.log(`Started server, port ${port}`);
});