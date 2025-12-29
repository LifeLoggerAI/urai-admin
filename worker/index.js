
const express = require('express');
const { renderVideo } = require('./renderer');

const app = express();
app.use(express.json());

app.post('/render', async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).send('Missing videoId in request body');
  }

  try {
    await renderVideo(videoId);
    res.status(200).send(`Successfully rendered video ${videoId}`);
  } catch (error) {
    console.error(`Error rendering video ${videoId}:`, error);
    res.status(500).send(`Failed to render video ${videoId}`);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Render worker listening on port ${port}`);
});
