import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(query(collection(db, "users", currentUser.uid, "todos"), orderBy("createdAt", "desc")), 
      (snap) => { setTodos(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); });
  }, [currentUser]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setNewTodo("");
    await addDoc(collection(db, "users", currentUser.uid, "todos"), { text: newTodo.trim(), completed: false, createdAt: new Date() });
  };

  const toggle = (id, c) => updateDoc(doc(db, "users", currentUser.uid, "todos", id), { completed: !c });
  const remove = (id) => deleteDoc(doc(db, "users", currentUser.uid, "todos", id));
  const updateTodo = async (id) => {
    if (!editText.trim()) return alert("Todo cannot be empty");
    setEditingId(null);
    await updateDoc(doc(db, "users", currentUser.uid, "todos", id), { text: editText.trim() });
  };

  const startEdit = (todo) => { setEditingId(todo.id); setEditText(todo.text); };
  const handleLogout = async () => { await logout(); navigate("/login", { replace: true }); };
  const completed = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6 p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl border border-white/20">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Task</h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{currentUser?.email}</p>
          </div>
          <button onClick={handleLogout} className="ml-2 px-3 sm:px-4 py-2 text-xs sm:text-sm hover:text-red-400 hover:bg-red-500/10 rounded-lg transition text-gray-300">Logout</button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {[{v: todos.length - completed, l: "Pending"}, {v: completed, l: "Completed"}].map(({v, l}) => (
            <div key={l} className="p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl border border-white/20">
              <p className="text-2xl sm:text-3xl font-bold text-white">{v}</p>
              <p className="text-xs sm:text-sm text-gray-400">{l}</p>
            </div>
          ))}
        </div>

        <form onSubmit={addTodo} className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="What needs to be done?"
            className="flex-1 px-3 sm:px-4 py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
          <button type="submit" disabled={!newTodo.trim()} className="px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg sm:rounded-xl disabled:opacity-50 font-semibold">+</button>
        </form>

        <div className="bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 overflow-hidden">
          {loading ? <p className="py-12 text-center text-gray-400">Loading...</p> : todos.length === 0 ? <p className="py-12 text-center text-gray-400">No tasks yet</p> : 
          <ul className="divide-y divide-white/10">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-white/5 transition flex-wrap sm:flex-nowrap">
                <button onClick={() => toggle(todo.id, todo.completed)} className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-500 hover:border-green-400"}`}>
                  {todo.completed && <span className="text-white text-xs">✓</span>}
                </button>
                {editingId === todo.id ? (
                  <>
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") updateTodo(todo.id); if (e.key === "Escape") setEditingId(null); }}
                      className="flex-1 min-w-0 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50" autoFocus />
                    <button onClick={() => updateTodo(todo.id)} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition">✕</button>
                  </>
                ) : (
                  <>
                    <span className={`flex-1 text-sm sm:text-base truncate ${todo.completed ? "line-through text-gray-500" : "text-white"}`}>{todo.text}</span>
                    <button onClick={() => startEdit(todo)} className="px-2 sm:px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit</button>
                    <button onClick={() => remove(todo.id)} className="px-2 sm:px-3 py-1 text-xs bg-red-400 text-white rounded hover:bg-red-500 transition">Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          }
        </div>
      </div>
    </div>
  );
}
