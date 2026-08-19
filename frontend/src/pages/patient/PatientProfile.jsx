import { useEffect, useState } from "react";
import { Camera, Mail, Phone, MapPin, Droplet, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { patientsApi } from "../../api/patients";

const statusLabel = { ADMITTED: "Admitted", OUTPATIENT: "Outpatient", DISCHARGED: "Discharged" };

export default function PatientProfile() {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    patientsApi
      .getMyProfile()
      .then(setPatient)
      .catch((err) => toast.error(err.message || "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setSaving(true);
    try {
      const updated = await patientsApi.update(patient.id, {
        bloodGroup: form.get("bloodGroup"),
        address: form.get("address"),
      });
      setPatient({ ...patient, ...updated });
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast("Password change requires a dedicated endpoint — not yet wired.", { icon: "ℹ️" });
    e.target.reset();
  };

  if (loading || !patient) {
    return <Card className="text-center py-12"><p className="text-ink-400 text-sm">Loading profile…</p></Card>;
  }

  const avatar = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-1 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-display font-bold">
            {avatar}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center text-ink-500 hover:text-primary-600 shadow-soft" aria-label="Change photo">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h3 className="font-display font-semibold text-lg text-ink-900">{user?.name}</h3>
        <p className="text-xs text-ink-400 font-mono-num mt-0.5">{patient.id.slice(0, 8)}</p>
        <Badge status={statusLabel[patient.status] || patient.status} className="mt-2" />

        <div className="mt-6 space-y-3 text-left border-t border-ink-100 pt-5">
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Mail className="w-4 h-4 text-ink-400" />{user?.email}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Phone className="w-4 h-4 text-ink-400" />{user?.phone}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Droplet className="w-4 h-4 text-ink-400" />Blood Group: {patient.bloodGroup || "—"}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><MapPin className="w-4 h-4 text-ink-400" />{patient.address || "Not set"}</div>
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink-900">Personal Information</h3>
            {!editing && <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>}
          </div>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label="Full Name"><Input defaultValue={user?.name} disabled /></Field>
              <Field label="Email"><Input defaultValue={user?.email} disabled /></Field>
              <Field label="Phone"><Input defaultValue={user?.phone} disabled /></Field>
              <Field label="Blood Group"><Input name="bloodGroup" defaultValue={patient.bloodGroup} disabled={!editing} /></Field>
              <Field label="Address" className="sm:col-span-2"><Input name="address" defaultValue={patient.address} disabled={!editing} /></Field>
            </div>
            {editing && (
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="submit" loading={saving}>Save Changes</Button>
              </div>
            )}
          </form>
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-ink-400" /> Change Password
          </h3>
          <form onSubmit={handlePasswordChange}>
            <Field label="Current Password"><Input type="password" placeholder="••••••••" required /></Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label="New Password"><Input type="password" placeholder="••••••••" required /></Field>
              <Field label="Confirm New Password"><Input type="password" placeholder="••••••••" required /></Field>
            </div>
            <Button type="submit" variant="accent">Update Password</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
