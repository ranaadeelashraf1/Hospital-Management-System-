import { useEffect, useState } from "react";
import { Camera, Mail, Phone, Clock, Star, Lock, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Input";
import { doctorsApi } from "../../api/doctors";

const statusLabel = { AVAILABLE: "Available", ON_LEAVE: "On Leave", IN_SURGERY: "In Surgery" };

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    doctorsApi
      .getMyProfile()
      .then(setDoctor)
      .catch((err) => toast.error(err.message || "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setSaving(true);
    try {
      const updated = await doctorsApi.update(doctor.id, {
        specialization: form.get("specialization"),
        experienceYears: Number(form.get("experienceYears")),
        availability: form.get("availability"),
      });
      setDoctor(updated);
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

  if (loading || !doctor) {
    return <Card className="text-center py-12"><p className="text-ink-400 text-sm">Loading profile…</p></Card>;
  }

  const avatar = doctor.user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

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
        <h3 className="font-display font-semibold text-lg text-ink-900">{doctor.user?.name}</h3>
        <p className="text-xs text-ink-400 font-mono-num mt-0.5">{doctor.id.slice(0, 8)}</p>
        <Badge status={statusLabel[doctor.status] || doctor.status} className="mt-2" />

        <div className="flex items-center justify-center gap-1 mt-3 text-warning-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.round(doctor.rating) ? "fill-current" : "text-ink-200"}`} />
          ))}
          <span className="text-xs text-ink-500 ml-1">{doctor.rating}</span>
        </div>

        <div className="mt-6 space-y-3 text-left border-t border-ink-100 pt-5">
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Briefcase className="w-4 h-4 text-ink-400" />{doctor.specialization}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Mail className="w-4 h-4 text-ink-400" />{doctor.user?.email}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Phone className="w-4 h-4 text-ink-400" />{doctor.user?.phone}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Clock className="w-4 h-4 text-ink-400" />{doctor.availability || "Not set"}</div>
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink-900">Professional Information</h3>
            {!editing && <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>}
          </div>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label="Full Name"><Input defaultValue={doctor.user?.name} disabled /></Field>
              <Field label="Specialization"><Input name="specialization" defaultValue={doctor.specialization} disabled={!editing} /></Field>
              <Field label="Email"><Input defaultValue={doctor.user?.email} disabled /></Field>
              <Field label="Phone"><Input defaultValue={doctor.user?.phone} disabled /></Field>
              <Field label="Experience (years)"><Input name="experienceYears" type="number" min="0" defaultValue={doctor.experienceYears} disabled={!editing} /></Field>
              <Field label="Availability"><Input name="availability" defaultValue={doctor.availability} disabled={!editing} /></Field>
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
