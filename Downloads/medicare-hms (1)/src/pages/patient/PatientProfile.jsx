import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Droplet, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Input";
import { currentPatient } from "../../data/mockData";

export default function PatientProfile() {
  const [editing, setEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    toast.success("Profile updated successfully");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast.success("Password changed successfully");
    e.target.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-1 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-display font-bold">
            {currentPatient.avatar}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center text-ink-500 hover:text-primary-600 shadow-soft" aria-label="Change photo">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h3 className="font-display font-semibold text-lg text-ink-900">{currentPatient.name}</h3>
        <p className="text-xs text-ink-400 font-mono-num mt-0.5">{currentPatient.id}</p>
        <Badge status={currentPatient.status} className="mt-2" />

        <div className="mt-6 space-y-3 text-left border-t border-ink-100 pt-5">
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Mail className="w-4 h-4 text-ink-400" />{currentPatient.email}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Phone className="w-4 h-4 text-ink-400" />{currentPatient.phone}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><Droplet className="w-4 h-4 text-ink-400" />Blood Group: {currentPatient.bloodGroup}</div>
          <div className="flex items-center gap-2.5 text-sm text-ink-600"><MapPin className="w-4 h-4 text-ink-400" />{currentPatient.address}</div>
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
              <Field label="Full Name"><Input defaultValue={currentPatient.name} disabled={!editing} /></Field>
              <Field label="Email"><Input defaultValue={currentPatient.email} disabled={!editing} /></Field>
              <Field label="Phone"><Input defaultValue={currentPatient.phone} disabled={!editing} /></Field>
              <Field label="Blood Group"><Input defaultValue={currentPatient.bloodGroup} disabled={!editing} /></Field>
              <Field label="Address" className="sm:col-span-2"><Input defaultValue={currentPatient.address} disabled={!editing} /></Field>
            </div>
            {editing && (
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
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
