import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Logo from "../components/ui/Logo";
import { authApi } from "../api/auth";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      setMessage("This verification link is missing a token.");
      return;
    }

    authApi
      .verifyEmail(token)
      .then((data) => {
        setState("success");
        setMessage(data?.message || "Email verified successfully. You can now sign in.");
      })
      .catch((error) => {
        setState("error");
        setMessage(error.message || "This verification link is invalid or expired.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-soft">
        <Logo className="mx-auto mb-8" />
        {state === "loading" && <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary-600" />}
        {state === "success" && <CheckCircle2 className="mx-auto h-12 w-12 text-accent-600" />}
        {state === "error" && <XCircle className="mx-auto h-12 w-12 text-danger-500" />}
        <h1 className="mt-5 text-2xl font-display font-bold text-ink-900">
          {state === "loading" ? "Verifying your email" : state === "success" ? "Email verified" : "Verification failed"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {state === "loading" ? "Please wait a moment." : message}
        </p>
        {state !== "loading" && (
          <Link to="/login" className="mt-6 inline-flex rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700">
            Go to Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
