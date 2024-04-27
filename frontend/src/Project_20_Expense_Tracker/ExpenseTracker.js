import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpenseTracker.css';

const ExpenseTracker = () => {
    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [history, setHistory] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const URL = "http://localhost:3201/history";

    const fetchData = async () => {
        try {
            const res = await axios.get(URL);
            const data = res.data;
            if (data && data.length >= 3) {
                setBalance(data[0].amount);
                setIncome(data[1].amount);
                setExpense(data[2].amount);
                setHistory(data);
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddTransaction = async () => {
        const newAmount = parseInt(amount);
        const isExpense = newAmount < 0;
        const newIncome = isExpense ? income : income + newAmount;
        const newExpense = isExpense ? expense + newAmount : expense;
        const newBalance = balance + newAmount;
        setIncome(newIncome);
        setExpense(newExpense);
        setBalance(newBalance);
        const newTransaction = {
            id: generateUUID(), 
            name: name,
            amount: newAmount,
        };
        try {
            await axios.post(URL, newTransaction);
            await axios.patch(`${URL}/0`, { amount: newBalance });
            await axios.patch(`${URL}/1`, { amount: newIncome });
            await axios.patch(`${URL}/2`, { amount: newExpense });
            fetchData();
        } catch (error) {
            console.log("Error adding transaction:", error);
        }
        setName('');
        setAmount('');
    };
    

    const generateUUID = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    return (
        <div className="expense-tracker-container">
            <div>
            <div className="balance-section">
                <h2>Balance: {balance}</h2>
                <div className="income-expense">
                    <p>Income: {income}</p>
                    <p>Expense: {expense}</p>
                </div>
            </div>
            <div className="add-transaction-section">
                <h2>Add Transaction</h2>
                <input
                    type="text"
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
                <button onClick={handleAddTransaction}>Add</button>
            </div>
            </div>
            <div className="history-section">
                <h2>Transaction History</h2>
                <ul>
                    {history.map((transaction) => (
                        transaction.id !=="0" && transaction.id!=="1" && transaction.id!=="2" &&
                        <li key={transaction.id}>
                            <span>{transaction.name}</span>
                            <span>{transaction.amount}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExpenseTracker;
