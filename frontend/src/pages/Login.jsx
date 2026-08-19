import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Activity, Users } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../components/ui/Logo";
import { Field, Input } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth, roleHome } from "../context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success(`Welcome back, ${loggedInUser.name.split(" ")[0]}!`);
      navigate(roleHome[loggedInUser.role] || "/login");
    } catch (err) {
      toast.error(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Left: form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-sm mx-auto w-full">
          <Logo className="mb-8" />

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-display font-bold text-ink-900">Welcome back</h2>
            <p className="text-ink-500 text-sm mt-1.5 mb-6">
              Sign in to manage patients, appointments, and records.
            </p>

            <div className="mb-6 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2 text-xs text-primary-700">
              Sign in with your account email and password. The system will redirect you to the correct portal automatically.
            </div>

            <form onSubmit={handleSubmit}>
              <Field label="Email address">
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Input
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              <div className="flex items-center justify-between mb-6 -mt-1">
                <label className="flex items-center gap-2 text-sm text-ink-600 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500/40" />
                  Remember me
                </label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" loading={loading} icon={!loading ? ArrowRight : undefined} className="w-full" size="lg">
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-ink-500 mt-8">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                Register here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>




      {/* Right: illustration */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <svg viewBox="0 0 320 60" className="w-64 mb-8 opacity-90">
              <polyline
                className="vitals-line"
                points="0,30 60,30 75,8 92,52 108,30 320,30"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-3xl font-display font-bold leading-tight max-w-md">
              Every patient, every record, every heartbeat — in one place.
            </h3>
            <p className="text-primary-100 mt-4 max-w-sm text-sm leading-relaxed">
              MediCare gives your staff a single, calm view of the hospital — from admissions to billing —
              so care teams spend less time on paperwork and more time with patients.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-12">
              {[
                { icon: Users, label: "3,200+ Patients" },
                { icon: Activity, label: "Real-time Vitals" },
                { icon: ShieldCheck, label: "HIPAA Secure" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <Icon className="w-5 h-5 mb-2 text-white/90" />
                  <p className="text-xs font-medium text-white/90">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
