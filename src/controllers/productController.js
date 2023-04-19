import { pool } from "../models/db.js";

const getCategoryProduct = async (req, res) => {
    try {
        const products = await pool.query(
            "SELECT _id, category, name, price, description, image_path FROM products WHERE category = $1",
            [req.params.category]
        );

        if (products.rows.length === 0) {
            return res.status(400).json({ message: "No products found" });
        }

        res.json(products.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() }); 
    }
}

const getProduct = async (req, res) => {
    try {
        const products = await pool.query(
            "SELECT _id, category, name, price, description, image_path FROM products WHERE _id = $1", 
            [req.params.id]
        );

        if (products.rows.length === 0) {
            return res.status(400).json({ message: "No products found" });
        }

        res.json(products.rows[0])
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

const createProduct = async (req, res) => {
    try {
        const { category, name, price, description, image_path } = req.body;

        if (!category || !name || !price || !description || !image_path) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingProducts = pool.query("SELECT name FROM products WHERE name = $1", [name]);

        if (existingProducts.rows.length > 0) {
            return res.status(400).json({ message: `Product ${name} already exists` });
        }

        await pool.query(
            "INSERT INTO products (category, name, price, description, image_path) VALUES ($1, $2, $3, $4, $5)",
            [category, name, price, description, image_path]
        );

        res.status(201).json({ message: `New product '${name}' created`});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Product ID required" });
        }

        const existingProducts = await pool.query("SELECT _id, name FROM products WHERE _id = $1", [id]);
        if (existingProducts.rows.length === 0) {
            return res.status(400).json({ message: "Product not found" });
        }
        
        const [targetProduct] = existingProducts;

        await pool.query("DELETE FROM products WHERE _id = $1", [id]);

        res.json({ message: `Product ${targetProduct.name} with ID ${targetProduct._id} deleted`});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

export default { getCategoryProduct, getProduct, createProduct, deleteProduct };