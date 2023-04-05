import express from "express";
import items from "./items.js";

const app = express();

app.get("/api/products", (req, res) => {
    res.send(items);
});

const port = 4000;

app.listen(port, () => {
    console.log(`Started server, port ${port}`);
});Hello