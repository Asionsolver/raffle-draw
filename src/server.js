const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes");
const app = express();
app.use([cors(), morgan("dev"), express.json()]);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Success" });
});
app.use("/api/v1/tickets", router);
app.use((_req, _res, next) => {
  const error = new Error("Resource Not Found");
  error.status = 404;
  next(error);
});

app.use((error, _req, res, _next) => {
  console.log(error);
  if (error.status) {
    res.status(error.status).json({ error: error.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
