import jwt from "jsonwebtoken";
import { pool } from "../models/db.js";
import { hashSha256 } from "./hash.js";

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUsers = await pool.query("SELECT email, password_hash FROM users WHERE email = $1", [email]);
        if (existingUsers.rows.length === 0) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(existingUsers);
        const [targetUser] = existingUsers.rows;
        const password_hash = hashSha256(password);

        if (password_hash !== targetUser.password_hash) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const accessToken = jwt.sign(
            { "email": targetUser.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1m" }
        );

        const refreshToken = jwt.sign(
            { "email": targetUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 31 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

const refresh = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const refreshToken = cookies.jwt;

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Forbidden" });
                }

                const existingUsers = await pool.query("SELECT email FROM users WHERE email = $1", [decoded.email]);
                if (existingUsers.rows.length === 0) {
                    return res.status(401).json({ message: "Unauthorized" });
                }

                const [targetUser] = existingUsers.rows;

                const accessToken = jwt.sign(
                    { "email": targetUser.email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "1m" }
                );

                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

const logout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(204);
        }

        res.clearCookie("jwt", { httpOnly: true });
        res.json({ message:"Cookie cleared" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

export default { login, refresh, logout };