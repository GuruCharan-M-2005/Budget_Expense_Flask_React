import React, { useEffect, useState } from 'react'
import './BudgetExpense.css'
import axios from 'axios'

export default function BudgetExpense() {

    const timeout=100;

    const [budgets, setBudgets] = useState([]);
    const [newBudgets, setNewBudgets] = useState(false);
    const [newBudgetname, setNewBudgetname] = useState('');
    const [newBudgetcost, setNewBudgetcost] = useState(0);

    const [editBudgets, setEditBudgets] = useState(false);
    const [editBudgetname, setEditBudgetname] = useState('');
    const [editBudgetcost, setEditBudgetcost] = useState(0);

    const [expenses,setExpenses] = useState([]);
    const [newExpenses,setNewExpenses] = useState(false);
    const [newExpensename, setNewExpensename] = useState('');
    const [newExpensecost, setNewExpensecost] = useState(0);

    const [editExpenses,setEditExpenses] = useState(false);
    const [editExpensename, setEditExpensename] = useState('');
    const [editExpensecost, setEditExpensecost] = useState(0);

    const [search, setSearch] = useState('');
    const [history,setHistory] = useState([]);

    const [current, setCurrent] = useState(0);
    const [expense, setExpense] = useState(0);
    const [income, setIncome] = useState(0);

    const URL1 = "http://localhost:5000/budget";
    const URL2 = "http://localhost:5000/expense";
    const URL3 = "http://localhost:5000/history";
    const URL4 = "http://localhost:5000/amount";

    const getData1 = async () => {
        try {
            const res = await axios.get(URL1);
            setBudgets(res.data);
        } catch (err) {
            console.log("Data fetch failure" + err);
        }
    }

    const getData2 = async () => {
        try {
            const res = await axios.get(URL2);
            setExpenses(res.data);
        } catch (err) {
            console.log("Data fetch failure" + err);
        }
    }

    const getData3 = async () => {
        try {
            const res = await axios.get(URL3);
            setHistory(res.data);
        } catch (err) {
            console.log("Data fetch failure" + err);
        }
    }

    const getData4 = async () => {
        try {
            const res = await axios.get(URL4);
            const p=res.data;
            setCurrent(p[0].current)
            setExpense(p[0].expense)
            setIncome(p[0].income)
        } catch (err) {
            console.log("Data fetch failure" + err);
        }
    }

    const addData1 = async () => {
        let temp={
            id: generateHexUUID(),
            name: newBudgetname,
            amount: newBudgetcost
        }
        await axios.post(URL1, temp);
        addData3(temp);
        setTimeout(() => {
            getData1();
            getData4();
        }, timeout);
        console.log("Data create success");
        setNewBudgetcost(0);
        setNewBudgetname('');
        setNewBudgets(!newBudgets)
    }

    const addData2 = async () => {
        let temp={
            id: generateHexUUID(),
            name: newExpensename,
            amount: newExpensecost
        }
        await axios.post(URL2,temp);
        addData3(temp);
        setTimeout(() => {
            getData2();
            getData4();
        }, timeout);
        console.log("Data create success");
        setNewExpensecost(0);
        setNewExpensename('');
        setNewExpenses(!newExpenses)
    }

    const addData3 = async (data) => {
        await axios.post(URL3, data);
        setTimeout(() => {
            getData3();
        }, timeout);
        console.log("Data create success");
    }

    const editData1 = async (item) =>{
        const newdata={
            'name':editBudgetname,
            'amount':editBudgetcost
        }
        try {
            await axios.put(`${URL1}/${item.id}`,newdata);
            console.log("Data update success");
            setEditBudgetname('')
            setEditBudgetcost(0)
            setEditBudgets(false);
            getData1(); 
            getData4();
        } catch (err) {
            console.log("Data update failure" + err);
        }    
    }

    const editData2 = async (item) =>{
        const newdata={
            'name':editExpensename,
            'amount':editExpensecost
        }
        try {
            await axios.put(`${URL2}/${item.id}`,newdata);
            console.log("Data update success");
            setEditExpensename('');
            setEditExpensecost(0);
            setEditExpenses(false);
            getData2(); 
            getData4();
        } catch (err) {
            console.log("Data update failure" + err);
        }
    }

    const deleteData1 = async (id) => {
        try {
            await axios.delete(`${URL1}/${id}`);
            console.log("Data delete success");
            getData1(); 
            getData4();
        } catch (err) {
            console.log("Data delete failure" + err);
        }
    }

    const deleteData2 = async (id) => {
        try {
            await axios.delete(`${URL2}/${id}`);
            console.log("Data delete success");
            getData4();
            getData2(); 
        } catch (err) {
            console.log("Data delete failure" + err);
        }
    }

    const editBudgetZone = (item) => {
        setEditBudgets(true);
        setEditBudgetname(item.name)
        setEditBudgetcost(item.amount)
    }

    const editExpenseZone = (item) => {
        setEditExpenses(true);
        setEditExpensename(item.name)
        setEditExpensecost(item.amount)
    }

    useEffect(()=>{
        getData1();
        getData2();
        getData3();
        getData4();
    },[])

    const generateHexUUID = () => {
        let hexUUID = '';
        for (let i = 0; i < 4; i++) {
            hexUUID += Math.floor(Math.random() * 16).toString(16);
        }
        return hexUUID;
    };

  return (
    <div className='main-grid'>
        <div className='sub-grid-1'>
            <h1>Budget Planner</h1>
            <div className='sub-body-grid-1'>
                    <div className="budget-info">
                        <h2>Current: {current}</h2>
                        <h2>Expense: {expense}</h2>
                        <h2>Income: {income}</h2>
                    </div>
                    <div>
                        <input type='text' value={search} placeholder='Search...' onChange={(e)=>setSearch(e.target.value)} />
                    </div>
            </div>
            <div className='sub-body-grid-2'>
                <div className='body-grid-1'>
                        <h1>Income</h1>
                        <div className="expenses-container">
                        {budgets.filter((item) => (
                            item.name.toLowerCase().includes(search.toLowerCase()) && item.name !== ''
                        )).map((item) => (
                            <div key={item.id} className="expense-item">
                                {editBudgets ? (<div>
                                    <input type="text" value={editBudgetname} onChange={(e) => setEditBudgetname(e.target.value)} />
                                    <input type="text" value={editBudgetcost} onChange={(e) => setEditBudgetcost(e.target.value)} />
                                    <button onClick={() => editData1(item)}>Edit</button>
                                    <button onClick={() => setEditBudgets(false)}>Cancel</button>
                                </div>) : (
                                    <div>
                                        <h3>{item.name}</h3>
                                        <h3>{item.amount}</h3>
                                        <button onClick={() => editBudgetZone(item)}>Edit</button>
                                        <button onClick={() => deleteData1(item.id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {!newBudgets && <div>
                                <button onClick={()=>setNewBudgets(!newBudgets)}>Add</button>
                            </div>}
                        {newBudgets && <div>
                                <input type='text' value={newBudgetname} onChange={(e)=>setNewBudgetname(e.target.value)} />
                                <input type='text' value={newBudgetcost} onChange={(e)=>setNewBudgetcost(e.target.value)} />
                                <button onClick={()=>addData1()}>Ok</button>
                            </div>}
                        </div>
                </div>
                <div className='body-grid-2'>
                        <h1>Expense</h1>
                        <div className="expenses-container">
                        {expenses.filter((item) => (
                            item.name.toLowerCase().includes(search.toLowerCase()) && item.name !== ''
                        )).map((item) => (
                            <div key={item.id} className="expense-item">
                                {editExpenses ? (<div>
                                    <input type="text" value={editExpensename} onChange={(e) => setEditExpensename(e.target.value)} />
                                    <input type="text" value={editExpensecost} onChange={(e) => setEditExpensecost(e.target.value)} />
                                    <button onClick={() => editData2(item)}>Edit</button>
                                    <button onClick={() => setEditExpenses(false)}>Cancel</button>
                                </div>) : (
                                    <div>
                                        <h3>{item.name}</h3>
                                        <h3>{item.amount}</h3>
                                        <button onClick={() => editExpenseZone(item)}>Edit</button>
                                        <button onClick={() => deleteData2(item.id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {!newExpenses && <div>
                                <button onClick={()=>setNewExpenses(!newExpenses)}>Add</button>
                            </div>}
                        {newExpenses && <div>
                                <input type='text' value={newExpensename} onChange={(e)=>setNewExpensename(e.target.value)} />
                                <input type='text' value={newExpensecost} onChange={(e)=>setNewExpensecost(e.target.value)} />
                                <button onClick={()=>addData2()}>Ok</button>
                            </div>}
                        </div>
                </div>
            </div>
        </div>
        <div className='sub-grid-2'>
            <h1>History</h1>
                <div className="history-container">
                        {history.filter((item) => (
                            item.name.toLowerCase().includes(search.toLowerCase()) && item.name !== ''
                        )).map((item) => (
                            <div key={item.id} className="expense-item">
                                {item.id !== "12345" && (
                                    <div>
                                        <h3>{item.name}</h3>
                                        <h3>{item.amount}</h3>
                                        {/* <button onClick={() => deleteData(item.id)}>Delete</button> */}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
        </div>
    </div>
  )
}
