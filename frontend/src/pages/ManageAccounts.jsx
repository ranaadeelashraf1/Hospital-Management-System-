import { useState } from "react";
import { KeyRound, Mail, Phone, ShieldPlus, Stethoscope, User, UsersRound } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Field, Input, Select } from "../components/ui/Input";
import { authApi } from "../api/auth";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "DOCTOR",
  specialization: "",
  experienceYears: "",
};

export default function ManageAccounts() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        role: form.role,
        ...(form.role === "DOCTOR" && {
          specialization: form.specialization || "General Physician",
          experienceYears: Number(form.experienceYears) || 0,
        }),
      };
      await authApi.createManagedUser(payload);
      toast.success(`${form.role} account created successfully.`);
      setForm(initialForm);
    } catch (error) {
      toast.error(error.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="font-display font-semibold text-xl text-ink-900">Manage Accounts</h2>
        <p className="mt-0.5 text-sm text-ink-500">Create staff accounts. Only Admin users can access this page.</p>
      </div>

      <Card>
        <div className="mb-5 flex items-center gap-3 border-b border-ink-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><ShieldPlus className="h-5 w-5" /></div>
          <div><h3 className="font-display font-semibold text-ink-900">Create staff account</h3><p className="text-xs text-ink-500">Set the login credentials and role for the new account.</p></div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Account type">
            <Select icon={UsersRound} value={form.role} onChange={update("role")}>
              <option value="DOCTOR">Doctor</option>
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </Field>
          <Field label="Full name"><Input icon={User} value={form.name} onChange={update("name")} placeholder="Full name" required /></Field>
          <Field label="Email address"><Input icon={Mail} type="email" value={form.email} onChange={update("email")} placeholder="staff@medicare.hospital" required /></Field>
          <Field label="Phone number"><Input icon={Phone} type="tel" value={form.phone} onChange={update("phone")} placeholder="+92 300 1234567" /></Field>
          <Field label="Temporary password"><Input icon={KeyRound} type="password" minLength={6} value={form.password} onChange={update("password")} placeholder="At least 6 characters" required /></Field>

          {form.role === "DOCTOR" && (
            <>
              <Field label="Specialization"><Input icon={Stethoscope} value={form.specialization} onChange={update("specialization")} placeholder="e.g. Cardiologist" required /></Field>
              <Field label="Experience (years)"><Input type="number" min="0" value={form.experienceYears} onChange={update("experienceYears")} placeholder="e.g. 5" required /></Field>
            </>
          )}

          <div className="flex justify-end sm:col-span-2"><Button type="submit" loading={loading}>{loading ? "Creating account..." : "Create account"}</Button></div>
        </form>
      </Card>
    </div>
  );
}