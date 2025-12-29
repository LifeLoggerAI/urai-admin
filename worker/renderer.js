
const { Firestore } = require('@google-cloud/firestore');
const { bundle } = require('@remotion/cli');
const { renderMedia, getCompositions } = require('@remotion/renderer');
const path = require('path');

const firestore = new Firestore();

async function renderVideo(videoId) {
  const videoDocRef = firestore.collection('videos').doc(videoId);

  try {
    // 1. Update Firestore status to "rendering"
    await videoDocRef.update({ status: 'rendering' });

    // 2. Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.resolve(process.env.REMOTION_PROJECT_ROOT, 'src/index.ts'), // Adjust if your entry is different
      webpackOverride: (config) => config,
    });

    // 3. Get the compositions
    const comps = await getCompositions(bundleLocation);
    const composition = comps.find((c) => c.id === 'Main'); // Assuming your main composition is named 'Main'

    if (!composition) {
      throw new Error('Could not find a composition to render.');
    }

    // 4. Render the video
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: `gs://${process.env.GCP_BUCKET}/videos/${videoId}.mp4`,
      inputProps: { videoId }, // Pass videoId to your Remotion composition
    });

    // 5. Update Firestore status to "completed"
    await videoDocRef.update({ status: 'completed' });

    console.log(`Video ${videoId} rendered successfully.`);

  } catch (error) {
    console.error(`Failed to render video ${videoId}:`, error);

    // 6. Update Firestore status to "error"
    await videoDocRef.update({
      status: 'error',
      errorMessage: error.message,
    });

    // Re-throw the error to be caught by the calling function
    throw error;
  }
}

module.exports = { renderVideo };
