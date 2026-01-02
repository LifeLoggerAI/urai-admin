import * as express from "express";
import * as cors from "cors";
import { getFirestore } from "firebase-admin/firestore";
import adminRoutes from "./routes/adminRoutes";
import flagsRoutes from "./routes/flagsRoutes";
import incidentRoutes from "./routes/incidentRoutes";
import supportRoutes from "./routes/supportRoutes";
import healthRoutes from "./routes/healthRoutes";

const app = express();

const db = getFirestore();

db.collection("config").doc("global").get().then(configDoc => {
    const config = configDoc.data();
    if (config && config.allowOrigins) {
        app.use(cors({ origin: config.allowOrigins }));
    }
});

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/flags", flagsRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/health", healthRoutes);

export default app;
