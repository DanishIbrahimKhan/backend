import express from "express";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 9000;

// MongoDB Atlas connection
const MONGO_URI = "mongodb+srv://mrdanishibrahim:Ot18DiBsq5layODP@cluster0.iavub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// Define the movie schema with userEmail field
const movieSchema = new mongoose.Schema({
  imdbID: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  year: { type: String },
  poster: { type: String },
  userEmail: { type: String, required: true }, // Added userEmail to associate with a specific user
});

const Movie = mongoose.model("Movie", movieSchema);

app.use(cors());
app.use(express.json());

const OMDB_API_KEY = "3aa28eff";
const OMDB_BASE_URL = "http://www.omdbapi.com/";

// Route to get movie by title
app.get("/movie-by-title/:t", async (req, res) => {
  const { t } = req.params;
  try {
    const response = await axios.get(`${OMDB_BASE_URL}?t=${encodeURIComponent(t)}&apikey=${OMDB_API_KEY}`);
    if (response.data.Response === "True") {
      res.json(response.data);
    } else {
      res.status(404).json({ error: response.data.Error });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get movie by IMDB ID
app.get("/movie-by-id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${OMDB_BASE_URL}?i=${encodeURIComponent(id)}&apikey=${OMDB_API_KEY}`);
    if (response.data.Response === "True") {
      res.json(response.data);
    } else {
      res.status(404).json({ error: response.data.Error });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to save a movie to a user's favorites
app.post("/favorites", async (req, res) => {
  const { imdbID, title, year, poster, userEmail } = req.body;

  // Check if userEmail is provided
  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    // Check if the movie already exists for the user
    const existingMovie = await Movie.findOne({ imdbID, userEmail });
    if (existingMovie) {
      return res.status(400).json({ error: "Movie already in favorites" });
    }

    // Create a new movie document
    const movie = new Movie({ imdbID, title, year, poster, userEmail });

    // Save the movie to the database
    await movie.save();
    res.status(201).json({ message: "Movie saved to favorites!" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Movie is already in favorites" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Route to get all movies for a specific user
app.get("/favorites/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const favorites = await Movie.find({ userEmail });
    if (favorites.length === 0) {
      return res.status(404).json({ message: "No favorite movies found for this user" });
    }
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server listening on port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
