import express from "express";

const app = express();
const port = 9000;
app.use("/",(req,res)=>{
    res.json({message: "hello world"})
})

app.listen(9000, ()=> {
    console.log(`server running on ${port}`)
})


const OMDB_API_KEY = '3aa28eff';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

// Serve HTML content on the root path
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Serverless Movie API</title>
    </head>
    <body>
      <h1>Welcome to the Serverless Movie API</h1>
      <p>Use the endpoint <code>/movie-by-title/{movie-name}</code> to search for a movie.</p>
    </body>
    </html>
  `);
});

app.get('/movie-by-title/:t', async (req, res) => {
  const { t } = req.params;
  try {
    const response = await axios.get(`${OMDB_BASE_URL}?t=${t}&apikey=${OMDB_API_KEY}`);
    if (response.data.Response === 'True') {
      res.json(response.data);
    } else {
      res.status(404).json({ error: response.data.Error });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
