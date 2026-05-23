import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Plane, Sparkles, Eye, EyeOff } from "lucide-react";

import loginBg from "../assets/login-bg.jpg";
const BG_IMAGE = loginBg;

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side — travel image with overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={BG_IMAGE}
          alt="Travel destination"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* dark gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-950/50 to-indigo-950/80" />

        {/* overlay content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 
              flex items-center justify-center"
            >
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              TripPlanner <span className="text-sky-400">AI</span>
            </span>
          </div>

          {/* tagline at bottom */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span className="text-sky-400 text-sm font-medium">
                AI-Powered Travel Planning
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              Your journey starts
              <br />
              with a single upload
            </h2>
            <p className="text-gray-300 text-lg">
              Upload your travel documents and let AI build your perfect
              itinerary in seconds.
            </p>

            {/* feature pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                "Flight Tickets",
                "Hotel Bookings",
                "Train Tickets",
                "Auto Itinerary",
              ].map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/20 
                  text-white text-sm backdrop-blur-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-md">
          {/* mobile logo — only shows on small screens */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 
              flex items-center justify-center"
            >
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">TripPlanner AI</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">
            Sign in to continue planning your adventures
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              {/* password field with show/hide toggle */}
              <div className="relative">
                <input
                  className="input pr-12"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-sky-400 hover:text-sky-300 font-medium"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
