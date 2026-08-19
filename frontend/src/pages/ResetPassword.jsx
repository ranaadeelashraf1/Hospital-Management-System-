import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../components/ui/Logo";
import { Field, Input } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { authApi } from "../api/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      toast.success("Password reset successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-6 py-12">
      <div className="w-full max-w-sm">
        <Logo className="mb-8" />
        <h2 className="text-2xl font-display font-bold text-ink-900">Choose a new password</h2>
        <p className="mb-6 mt-1.5 text-sm text-ink-500">Use at least six characters for your new password.</p>
        {!token ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">This reset link is missing or invalid.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field label="New password"><Input icon={Lock} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} /></Field>
            <Field label="Confirm password"><Input icon={Lock} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} /></Field>
            <Button type="submit" loading={loading} icon={!loading ? ArrowRight : undefined} className="w-full" size="lg">{loading ? "Updating..." : "Update password"}</Button>
          </form>
        )}
        <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
      </div>
    </div>
  );
}