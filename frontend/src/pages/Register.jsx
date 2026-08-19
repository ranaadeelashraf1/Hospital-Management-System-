import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../components/ui/Logo";
import { Field, Input, Select } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth, roleHome } from "../context/AuthContext";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", age: "", gender: "FEMALE",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        age: Number(form.age),
        gender: form.gender,
      };
      const newUser = await register(payload);
      toast.success("Account created successfully!");
      navigate(roleHome[newUser.role] || "/login");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <div className="mb-5 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2 text-xs text-primary-700">
                Public registration is available for patients only. Doctor, Admin, and Receptionist accounts are created by an Admin.
              </div>

              <Field label="Full Name">
                <Input icon={User} type="text" placeholder="John Doe" value={form.name} onChange={update("name")} required />
              </Field>

              <Field label="Email address">
                <Input icon={Mail} type="email" placeholder="you@medicare.hospital" value={form.email} onChange={update("email")} required />
              </Field>

              <Field label="Phone Number">
                <Input icon={Phone} type="tel" placeholder="+92 300 1234567" value={form.phone} onChange={update("phone")} required />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Age"><Input type="number" min="1" placeholder="e.g. 29" value={form.age} onChange={update("age")} required /></Field>
                <Field label="Gender">
                  <Select value={form.gender} onChange={update("gender")}>
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Password">
                  <Input icon={Lock} type="password" placeholder="••••••••" value={form.password} onChange={update("password")} required />
                </Field>
                <Field label="Confirm Password">
                  <Input icon={Lock} type="password" placeholder="••••••••" value={form.confirmPassword} onChange={update("confirmPassword")} required />
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
