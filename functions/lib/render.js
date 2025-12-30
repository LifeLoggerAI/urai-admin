"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerRender = void 0;
const https_1 = require("firebase-functions/v2/https");
const google_auth_library_1 = require("google-auth-library");
const node_fetch_1 = __importDefault(require("node-fetch"));
// TODO: Replace this with your actual Cloud Run service URL after deployment
const workerUrl = "https://your-cloud-run-worker-url.a.run.app/render";
const auth = new google_auth_library_1.GoogleAuth();
exports.triggerRender = (0, https_1.onCall)({ retry: true }, async (request) => {
    const { videoId } = request.data;
    if (!videoId) {
        throw new https_1.onCall.HttpsError("invalid-argument", "The function must be called with a 'videoId'.");
    }
    try {
        const client = await auth.getIdTokenClient(workerUrl);
        const headers = await client.getRequestHeaders();
        const response = await (0, node_fetch_1.default)(workerUrl, {
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
    }
    catch (error) {
        console.error(`Error triggering render for video ${videoId}:`, error);
        throw new https_1.onCall.HttpsError("internal", error.message, error);
    }
});
//# sourceMappingURL=render.js.map