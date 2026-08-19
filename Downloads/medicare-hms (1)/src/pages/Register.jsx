import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, HeartPulse, Stethoscope, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../components/ui/Logo";
import { Field, Input } from "../components/ui/Input";
import Button from "../components/ui/Button";

const roles = [
  { id: "Patient", icon: HeartPulse },
  { id: "Doctor", icon: Stethoscope },
  { id: "Receptionist", icon: ClipboardList },
];

export default function Register() {
  const [role, setRole] = useState("Patient");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully!");
      navigate("/login");
    }, 900);
  };

  return (
    <div className="min-h-screen flex bg-ink-50">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-accent-700 via-accent-600 to-primary-600">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
              Join a care network built around real people.
            </h3>
            <p className="text-accent-50 mt-4 max-w-sm text-sm leading-relaxed">
              Whether you're a patient booking your first visit or a doctor joining our network,
              your account gets you set up in under two minutes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-sm mx-auto w-full">
          <Logo className="mb-8" />

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-display font-bold text-ink-900">Create your account</h2>
            <p className="text-ink-500 text-sm mt-1.5 mb-6">Get started with MediCare in a few steps.</p>

            <form onSubmit={handleSubmit}>
              <Field label="I am registering as">
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(({ id, icon: Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setRole(id)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                        role === id
                          ? "border-primary-500 bg-primary-50 text-primary-700 shadow-soft"
                          : "border-ink-200 text-ink-500 hover:border-ink-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {id}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Full Name">
                <Input icon={User} type="text" placeholder="John Doe" required />
              </Field>

              <Field label="Email address">
                <Input icon={Mail} type="email" placeholder="you@medicare.hospital" required />
              </Field>

              <Field label="Phone Number">
                <Input icon={Phone} type="tel" placeholder="+92 300 1234567" required />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Password">
                  <Input icon={Lock} type="password" placeholder="••••••••" required />
                </Field>
                <Field label="Confirm Password">
                  <Input icon={Lock} type="password" placeholder="••••••••" required />
                </Field>
              </div>

              <Button type="submit" loading={loading} icon={!loading ? ArrowRight : undefined} className="w-full mt-2" size="lg">
                {loading ? "Creating account…" : "Register"}
              </Button>
            </form>

            <p className="text-center text-sm text-ink-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
