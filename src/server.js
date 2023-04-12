import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import items from "./items.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(express.json());

app.use(cookieParser());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use("/", express.static(path.join(__dirname, "public")));

// app.use("/", require("./routes/root"));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/products", (req, res) => {
    res.send(items);
});

const port = 4000;

app.listen(port, () => {
    console.log(`Started server, port ${port}`);
});