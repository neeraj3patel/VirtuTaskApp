import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields");
    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.code === "auth/invalid-credential" ? "Invalid email or password" : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch { setError("Google sign-in failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">WELCOME</h1>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" disabled={loading} autoComplete="email"
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading} autoComplete="current-password"
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold uppercase tracking-wider disabled:opacity-50">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center"><div className="flex-1 border-t border-white/20"></div><span className="px-4 text-gray-400 text-sm">or</span><div className="flex-1 border-t border-white/20"></div></div>

        <button onClick={handleGoogle} disabled={loading} className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 disabled:opacity-50">
          Continue with Google
        </button>

        <p className="mt-8 text-center text-gray-400">
          {"Don't have an account? "}<Link to="/register" className="text-orange-400 hover:text-orange-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
