import express from "express";
import bodyParser from "body-parser";
import { Sequelize, DataTypes } from "sequelize";
import { faker } from "@faker-js/faker";
import {
  IMAGE_ORIGINAL_URL,
  IMAGE_THUMBNAIL_URL,
  STATIC_URL,
} from "./constants";
import cors from "cors";

const app = express();
const PORT = 3000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Define Item model
const Item = sequelize.define("Item", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imageOriginal: {
    type: DataTypes.STRING, // Storing the URL of the original image
    allowNull: true, // Change to false if this field becomes mandatory
  },
  imageThumbnail: {
    type: DataTypes.STRING, // Storing the URL of the image thumbnail
    allowNull: true, // Change to false if this field becomes mandatory
  },
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes

app.use(express.static(STATIC_URL));

// Test database connection and sync models
sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connection established successfully.");
    await sequelize.sync({ force: true }); // This will recreate tables on every restart

    for (let i = 0; i < 10; i++) {
      await Item.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        imageOriginal: IMAGE_ORIGINAL_URL,
        imageThumbnail: IMAGE_THUMBNAIL_URL,
      });
    }
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Endpoint to get all items with pagination
app.get("/api/items", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10; // Default limit to 10
  const page = parseInt(req.query.page as string) || 1; // Default page to 1

  const offset = (page - 1) * limit; // Calculate the offset for pagination

  try {
    const { count, rows } = await Item.findAndCountAll({
      limit: limit, // Limit the number of items returned
      offset: offset, // Skip the items based on the current page
    });

    const totalPages = Math.ceil(count / limit); // Calculate total pages
    const currentPage = page; // Current page
    const nextPage = currentPage < totalPages ? currentPage + 1 : null; // Next page link
    const prevPage = currentPage > 1 ? currentPage - 1 : null; // Previous page link

    res.json({
      totalItems: count, // Total number of items
      totalPages: totalPages, // Total number of pages
      currentPage: currentPage, // Current page number
      nextPage: nextPage, // Next page number or null
      prevPage: prevPage, // Previous page number or null
      items: rows, // The items for the current page
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// Endpoint to clear all items
app.post("/api/items/clear", async (req, res) => {
  try {
    await Item.destroy({ where: {} });
    res.json({ message: "All items cleared successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear items" });
  }
});

// Endpoint to populate items
app.post("/api/items/populate", async (req, res) => {
  const maxAllowed = 100;
  const minAllowed = 10;
  const requestedCount = parseInt(req.query.count as string) || minAllowed;
  const count = Math.min(requestedCount, maxAllowed);

  try {
    for (let i = 0; i < count; i++) {
      await Item.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        imageOriginal: IMAGE_ORIGINAL_URL,
        imageThumbnail: IMAGE_THUMBNAIL_URL,
      });
    }
    res.json({ message: `${count} items populated successfully.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to populate items" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
