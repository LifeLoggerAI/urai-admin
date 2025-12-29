
import { onCall } from "firebase-functions/v2/https";
import { GoogleAuth } from "google-auth-library";
import fetch from "node-fetch";

// TODO: Replace this with your actual Cloud Run service URL after deployment
const workerUrl = "https://your-cloud-run-worker-url.a.run.app/render";

const auth = new GoogleAuth();

export const triggerRender = onCall({ retry: true }, async (request) => {
  const { videoId } = request.data;

  if (!videoId) {
    throw new onCall.HttpsError(
      "invalid-argument",
      "The function must be called with a 'videoId'."
    );
  }

  try {
    const client = await auth.getIdTokenClient(workerUrl);
    const headers = await client.getRequestHeaders();

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloud Run worker failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.text();
    return { result };

  } catch (error: any) {
    console.error(`Error triggering render for video ${videoId}:`, error);
    throw new onCall.HttpsError("internal", error.message, error);
  }
});
