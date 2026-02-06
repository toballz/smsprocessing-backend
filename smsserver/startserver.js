import express from "express";
import login_router from "./routers/login.js";
import core_router from "./routers/core.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || 4000;

app.get("/health", (req, res) => {
  res.json({ oksafsd: true });
});

app.use('/api/login', login_router);
app.use('/api/core/v1', core_router);



 


app.listen(port, () => {
  console.log(`Listening on ${port}`);
});