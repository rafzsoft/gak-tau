// WhatsApp Bot Activity API Backend
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "./events.json";

app.use(cors());
app.use(bodyParser.json());

let events = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    events = JSON.parse(fs.readFileSync(DATA_FILE));
  } catch {
    events = [];
  }
}

function saveEvents() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
}

app.post("/api/event", (req, res) => {
  const { type, from, text, meta } = req.body || {};
  if (!type) return res.status(400).json({ ok: false, error: "Missing type" });

  const evt = {
    _ts: new Date().toISOString(),
    type,
    from: from || "unknown",
    text: text || "",
    meta: meta || {},
  };

  events.unshift(evt);
  if (events.length > 1000) events.pop();
  saveEvents();

  console.log("📩 Event masuk:", evt);
  res.json({ ok: true });
});

app.get("/api/events", (req, res) => {
  res.json({ ok: true, events });
});

app.listen(PORT, () =>
  console.log(`✅ Server jalan di http://localhost:${PORT}`)
);
