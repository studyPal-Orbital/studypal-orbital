import React from "react";
import Card from './Card.js';
import UserTasks from './UserTasks.js';
import AddTodo from './AddTodo.js'
import Todo from './Todo.js'


import {db} from "../firebase.js"

import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot
  } from "firebase/firestore"
  
import { useState, useEffect } from "react"

export default function Todolist () {
    const [todos, setTodos] = React.useState([]);

  React.useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsub();
  }, []);

  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, "todos", todo.id), { title: title });
  };
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), { completed: !todo.completed });
  };
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };
  return (
    <div className="App">
      <div>
        <AddTodo />
      </div>
      <div className="todo_container">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}


/*
 // To-do list Cards
    const userTasks = UserTasks.map(item => {
        return <Card
                    task = {item.task}
                    day = {item.day}
                    urgency = {item.urgency}
                />
    });

    return (
        <>
        <div class="container">

            <h1 class="title">To-do List</h1>
            <form>
                <input className="todoinput"></input>
                <button className="todobutton">Add Task</button>
            </form>
        </div>

        <div className="cards">
            {userTasks}
        </div>
        
        </>
    );
}
*/