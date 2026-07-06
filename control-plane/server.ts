import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;

const registryPath = path.join(__dirname, "registry.json");

function loadRegistry() {
  try {
    const raw = fs.readFileSync(registryPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return { ecosystem: "URAI", services: [] };
  }
}

app.get("/control-plane/status", (req, res) => {
  const registry = loadRegistry();

  const status = {
    system: "URAI_CONTROL_PLANE_MVP",
    timestamp: new Date().toISOString(),
    serviceCount: registry.services?.length || 0,
    services: registry.services?.map((s) => ({
      name: s.name,
      type: s.type,
      status: s.status || "unknown"
    }))
  };

  res.json(status);
});

app.get("/control-plane/registry", (req, res) => {
  res.json(loadRegistry());
});

app.get("/control-plane", (req, res) => {
  const registry = loadRegistry();

  const html = `
  <html>
    <head>
      <title>URAI Control Plane</title>
      <style>
        body { font-family: Arial; background: #0b0f19; color: #e6e6e6; padding: 20px; }
        .card { background: #111827; padding: 12px; margin: 8px 0; border-radius: 8px; }
        .title { font-size: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="title">URAI Control Plane MVP</div>
      <div class="card">Services: ${registry.services.length}</div>
      ${registry.services.map((s) => `
        <div class="card">
          <b>${s.name}</b><br/>
          Type: ${s.type}<br/>
          Status: ${s.status}
        </div>
      `).join("")}
    </body>
  </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`URAI Control Plane running on port ${PORT}`);
});
