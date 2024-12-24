import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaFaceSadTear } from "react-icons/fa6";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(false);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      setTodos(JSON.parse(todoString));
    }
  }, []);

  // Save todos to localStorage every time the todos list changes
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleAdd = () => {
    if (!todo) {
      return alert("Invalid Task");
    }
    const newTodo = { todo, id: uuidv4(), isCompleted: false };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setTodo(""); // Clear the input field
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleDelete = (id) => {
    const isResponse = window.confirm("Are you sure to delete this Todo?");
    if (isResponse) {
      // Remove the todo by filtering out the item with the matching id
      const newTodos = todos.filter((item) => item.id !== id);
      
      // Update the state with the new list
      setTodos(newTodos);
  
      // Save updated todos to localStorage
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  };
  

  const handleCheckbox = (e) => {
    const id = e.target.name;
    // Toggle the completion status of the todo
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
  };

  const handleEdit = (id) => {
    const todoToEdit = todos.find((item) => item.id === id);
    setTodo(todoToEdit.todo);
    // Remove the todo to be edited from the list (it will be re-added after editing)
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl p-2 bg-violet-300 lg:w-1/2 min-h-screen">
        <div className="addTodo flex flex-col gap-4">
          <h2 className="text-center font-bold text-xl text-violet-700">
            iTask - Manage Your Daily Tasks
          </h2>
          <div className="flex justify-around">
            <input
              type="text"
              value={todo}
              onChange={handleChange}
              className="rounded-full h-10 p-3 w-[80%] border-none focus:outline-violet-500"
              placeholder="Tell me your Task"
            />
            <button
              onClick={handleAdd}
              disabled={todo.length < 3}
              className="disabled:bg-slate-400 bg-violet-800 hover:bg-violet-900 text-sm font-bold text-white p-3 py-1 w-[20%] rounded-full mx-2"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-center my-5">
          <input
            type="checkbox"
            checked={showFinished}
            onChange={toggleFinished}
          />
          <p className="font-bold text-violet-800">Show Only Finished Task</p>
        </div>

        <h1 className="text-xl mb-3 font-bold text-center text-violet-700">
          {showFinished ? "Finished Todos" : "All Todos"}
        </h1>
        <div className="todos min-h-[50vh] flex flex-col gap-4 p-2 bg-violet-100 rounded-xl">
          {!todos.length && (
            <div className="font-bold m-5 flex items-center gap-2 mx-auto text-red-600">
              No Todos Here <FaFaceSadTear />
            </div>
          )}
          {todos.map((item) => {
            return (
              (!showFinished || !!item.isCompleted) && (
                <div
                  key={item.id}
                  className={`${
                    item.isCompleted ? "bg-lime-300" : ""
                  } todo flex shrink-0 justify-around items-center h-10 px-2 rounded-xl`}
                >
                  <input
                    type="checkbox"
                    onChange={handleCheckbox}
                    name={item.id}
                    checked={item.isCompleted}
                  />

                  <div
                    className={`${
                      item.isCompleted ? "line-through" : ""
                    } text-center w-2/3`}
                  >
                    {item.todo}
                  </div>
                  <div className="buttons shrink-0">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-violet-800 hover:bg-violet-900 text-sm font-bold text-white p-3 py-1 rounded-md mx-6"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-violet-800 hover:bg-violet-900 text-sm font-bold text-white p-3 py-1 rounded-md mx-1"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
