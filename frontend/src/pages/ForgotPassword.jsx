import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../components/ui/Logo";
import { Field, Input } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { authApi } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Reset your password" description="Enter your account email and we will send you a secure reset link.">
      {sent ? (
        <div className="rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm text-primary-800">
          If an account exists for this email, a reset link has been sent. Check your inbox and spam folder.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Field label="Email address">
            <Input icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Button type="submit" loading={loading} icon={!loading ? ArrowRight : undefined} className="w-full" size="lg">
            {loading ? "Sending link..." : "Send reset link"}
          </Button>
        </form>
      )}
      <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </AuthShell>
  );
}

function AuthShell({ title, description, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-6 py-12">
      <div className="w-full max-w-sm">
        <Logo className="mb-8" />
        <h2 className="text-2xl font-display font-bold text-ink-900">{title}</h2>
        <p className="mb-6 mt-1.5 text-sm text-ink-500">{description}</p>
        {children}
      </div>
    </div>
  );
}