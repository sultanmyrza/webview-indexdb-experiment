import express from "express";
import bodyParser from "body-parser";
import { Sequelize, DataTypes } from "sequelize";
import { faker } from '@faker-js/faker';

const app = express();
const PORT = 3000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Define Item model
const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// Test database connection and sync models
sequelize.authenticate()
  .then(async () => {
    console.log('Database connection established successfully.');
    await sequelize.sync({ force: true }); // This will recreate tables on every restart
    
    // Generate some fake items
    for(let i = 0; i < 10; i++) {
      await Item.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price())
      });
    }
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Get all items endpoint
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
