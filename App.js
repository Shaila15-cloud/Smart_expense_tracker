import { useState, useEffect } from "react";
import jsPDF from "jspdf";

function App() {
  const [expenses, setExpenses] = useState([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/expenses")
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  // ✅ ADD
  const addExpense = () => {
    if (!name || !amount || !date || !category) {
      alert("Fill all fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      name,
      amount: Number(amount),
      date,
      category,
    };

    fetch("http://localhost:5000/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    }).then(() => {
      setExpenses([...expenses, newExpense]);
    });

    setName("");
    setAmount("");
    setDate("");
    setCategory("");
  };

  // ✅ DELETE
  const deleteExpense = (id) => {
    fetch(`http://localhost:5000/expenses/${id}`, {
      method: "DELETE",
    }).then(() => {
      setExpenses(expenses.filter(e => e.id !== id));
    });
  };

  // ✅ PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 10, 10);

    let y = 20;
    expenses.forEach((e, i) => {
      doc.text(
        `${i + 1}. ${e.name} - ₹${e.amount} - ${e.date}`,
        10,
        y
      );
      y += 10;
    });

    doc.save("expenses.pdf");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "green" }}>
        Smart Expense Tracker
      </h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select onChange={(e) => setCategory(e.target.value)}>
        <option>Select Category</option>
        <option>Food</option>
        <option>Travel</option>
        <option>Bills</option>
      </select>

      <button onClick={addExpense}>Add</button>

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.name} - ₹{e.amount}
            <button onClick={() => deleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={exportPDF}>Download PDF</button>

      <button onClick={() => window.open("http://localhost:5000/report")}>
        Share Report
      </button>
    </div>
  );
}

export default App;