import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "users", currentUser.uid, "todos"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => { setTodos(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); });
  }, [currentUser]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addDoc(collection(db, "users", currentUser.uid, "todos"), { text: newTodo.trim(), completed: false, createdAt: new Date() });
    setNewTodo("");
  };

  const toggle = (id, completed) => updateDoc(doc(db, "users", currentUser.uid, "todos", id), { completed: !completed });
  const remove = (id) => deleteDoc(doc(db, "users", currentUser.uid, "todos", id));
  const handleLogout = async () => { await logout(); navigate("/login", { replace: true }); };

  const completed = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6 p-4 bg-white/10 rounded-2xl border border-white/20">
          <div>
            <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
            <p className="text-sm text-gray-400">{currentUser?.email}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg">Logout</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="text-3xl font-bold text-white">{todos.length - completed}</p>
            <p className="text-sm text-gray-400">Pending</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="text-3xl font-bold text-white">{completed}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>
        </div>

        <form onSubmit={addTodo} className="flex gap-3 mb-6">
          <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="What needs to be done?"
            className="flex-1 px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
          <button type="submit" disabled={!newTodo.trim()} className="px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl disabled:opacity-50">+</button>
        </form>

        <div className="bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
          {loading ? (
            <p className="py-12 text-center text-gray-400">Loading...</p>
          ) : todos.length === 0 ? (
            <p className="py-12 text-center text-gray-400">No tasks yet</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {todos.map((todo) => (
                <li key={todo.id} className="flex items-center gap-4 p-4 hover:bg-white/5 group">
                  <button onClick={() => toggle(todo.id, todo.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-500"}`}>
                    {todo.completed && <span className="text-white text-xs">✓</span>}
                  </button>
                  <span className={`flex-1 ${todo.completed ? "line-through text-gray-500" : "text-white"}`}>{todo.text}</span>
                  <button onClick={() => remove(todo.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
