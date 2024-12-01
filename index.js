import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 9000;

const OMDB_API_KEY = "3aa28eff";
const OMDB_BASE_URL = "http://www.omdbapi.com/";

app.use(cors()); // Enable cross-origin requests

app.get("/movie-by-title/:t", async (req, res) => {
  const { t } = req.params;
  console.log(`Fetching movie with title: ${t}`); // Debugging

  try {
    const response = await axios.get(`${OMDB_BASE_URL}?t=${encodeURIComponent(t)}&apikey=${OMDB_API_KEY}`);
    console.log("OMDB API Response:", response.data); // Debugging

    if (response.data.Response === "True") {
      res.json(response.data);
    } else {
      res.status(404).json({ error: response.data.Error });
    }
  } catch (error) {
    console.error("Error fetching movie:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
