import { pool } from "../models/db.js";
import { hashSha256 } from "./hash.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT _id, email FROM users");
        if (users.length === 0) {
            return res.status(400).json({ message: "No users found" });
        }
        res.json(users);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

const createNewUser = async (req, res) => {
    try {
        const { email, password } = req.body; 
 
        const existingUsers = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        const password_hash = hashSha256(password);
        const userRecord = { email,  password_hash };
        
        await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
            [userRecord.email, userRecord.password_hash]
        );

        res.status(201).json({ message: `New user ${userRecord.email} created`});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });        
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "User ID required" });
        }

        const existingUsers = await pool.query("SELECT email FROM users WHERE _id = $1", [id]);
        if (user.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const [targetUser] = existingUsers;

        await pool.query("DELETE FROM users WHERE _id = $1", [id]);

        res.json({ message: `User ${targetUser.email} with ID ${targetUser._id} deleted` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });        
    }
}

export default { getAllUsers, createNewUser, deleteUser };