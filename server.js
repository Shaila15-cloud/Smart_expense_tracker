const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let expenses = [];

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.post("/expenses", (req, res) => {
  expenses.push(req.body);
  res.json(req.body);
});

app.delete("/expenses/:id", (req, res) => {
  const id = Number(req.params.id);
  expenses = expenses.filter(e => e.id !== id);
  res.json({ message: "Deleted" });
});

// SHARE LINK
app.get("/report", (req, res) => {
  res.json(expenses);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});