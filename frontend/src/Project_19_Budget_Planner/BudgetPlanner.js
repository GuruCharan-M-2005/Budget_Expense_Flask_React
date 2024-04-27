import React, { useEffect, useState } from 'react';
import './BudgetPlanner.css';
import axios from 'axios';

export default function BudgetPlanner() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [newname, setNewname] = useState('');
    const [newcost, setNewcost] = useState(0);
    const [budget, setBudget] = useState(0);
    const [spend, setSpend] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const URL = "http://localhost:5000/budget";

    const fetchData = async () => {
        try {
            const res = await axios.get(URL);
            setItems(res.data);
            const budgetItem = res.data.find(item => item.id === "a3d4");
            if (budgetItem) { setBudget(budgetItem.amount); }
            console.log("Data fetch success");
        } catch (err) {
            console.log("Data fetch failure" + err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const totalSpend = items.reduce((total, item) => {
            return item.id !== "1234567890" ? total + item.amount : total;
        }, 0);
        setSpend(totalSpend);
        setRemaining(budget - totalSpend);
    }, [items, budget]);

    const addNewData = async () => {
        const newone = {
            id: items.length.toString(),
            name: newname,
            amount: newcost
        }
        try {
            await axios.post(URL, newone);
            console.log("Data create success");
            setNewcost(0);
            setNewname('');
            fetchData();
        } catch (err) {
            console.log("Data create failure" + err);
        }
    }

    const deleteData = async (id) => {
        try {
            await axios.delete(`${URL}/${id}`);
            console.log("Data delete success");
            fetchData(); 
        } catch (err) {
            console.log("Data delete failure" + err);
        }
    }

    return (
        <div className="container">
            <h1>Budget Planner</h1>
            <div className="budget-info">
                <h2>Budget: {budget}</h2>
                <h2>Spend: {spend}</h2>
                <h2>Remaining: {remaining}</h2>
            </div>
            <h1>Expenses</h1>
            <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." />
            <div className="expenses-container">
                {items.filter((item) => (
                    item.name.toLowerCase().includes(search.toLowerCase()) && item.name !== ''
                )).map((item) => (
                    <div key={item.id} className="expense-item">
                        {item.id !== "12345" && (
                            <div>
                                <h3>{item.name}</h3>
                                <h3>{item.amount}</h3>
                                <button onClick={() => deleteData(item.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <h1>Add Expenses</h1>
            <input type='text' value={newname} onChange={(e) => setNewname(e.target.value)} placeholder="New Expense" />
            <input type='text' value={newcost} onChange={(e) => setNewcost(parseInt(e.target.value, 10))} placeholder="Cost" />
            <button onClick={() => addNewData()}>Add</button>
        </div>
    )
}
