import { useState } from "react";
import { Moon, Bell, UserCog, ShieldCheck, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Field, Input, Select } from "../components/ui/Input";

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="pr-4">
        <p className="text-sm font-medium text-ink-800">{label}</p>
        {description && <p className="text-xs text-ink-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative shrink-0 transition-colors ${checked ? "bg-primary-600" : "bg-ink-200"}`}
        aria-pressed={checked}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, billing: true });
  const [twoFA, setTwoFA] = useState(true);

  const handleToggleNotif = (key) => setNotifs((n) => ({ ...n, [key]: !n[key] }));

  const handleSaveAccount = (e) => {
    e.preventDefault();
    toast.success("Account settings saved");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card>
        <h3 className="font-display font-semibold text-ink-900 mb-1 flex items-center gap-2">
          <Moon className="w-4 h-4 text-ink-400" /> Appearance
        </h3>
        <p className="text-xs text-ink-500 mb-2">Customize how MediCare looks on your device.</p>
        <div className="divide-y divide-ink-100">
          <Toggle
            checked={darkMode}
            onChange={(v) => { setDarkMode(v); toast.success(v ? "Dark mode enabled" : "Dark mode disabled"); }}
            label="Dark Mode"
            description="Switch to a darker color theme"
          />
        </div>
      </Card>

      <Card>
        <h3 className="font-display font-semibold text-ink-900 mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-ink-400" /> Notifications
        </h3>
        <p className="text-xs text-ink-500 mb-2">Choose what you want to be notified about.</p>
        <div className="divide-y divide-ink-100">
          <Toggle checked={notifs.email} onChange={() => handleToggleNotif("email")} label="Email Notifications" description="Appointment reminders and updates" />
          <Toggle checked={notifs.sms} onChange={() => handleToggleNotif("sms")} label="SMS Notifications" description="Text alerts for urgent updates" />
          <Toggle checked={notifs.push} onChange={() => handleToggleNotif("push")} label="Push Notifications" description="Browser and mobile app alerts" />
          <Toggle checked={notifs.billing} onChange={() => handleToggleNotif("billing")} label="Billing Alerts" description="Invoice and payment reminders" />
        </div>
      </Card>

      <Card>
        <h3 className="font-display font-semibold text-ink-900 mb-1 flex items-center gap-2">
          <UserCog className="w-4 h-4 text-ink-400" /> Account Settings
        </h3>
        <p className="text-xs text-ink-500 mb-4">General account preferences.</p>
        <form onSubmit={handleSaveAccount}>
          <Field label="Language">
            <Select defaultValue="English">
              <option>English</option>
              <option>Urdu</option>
              <option>Arabic</option>
            </Select>
          </Field>
          <Field label="Timezone">
            <Select defaultValue="Asia/Karachi (PKT)">
              <option>Asia/Karachi (PKT)</option>
              <option>UTC</option>
              <option>America/New_York (EST)</option>
            </Select>
          </Field>
          <Button type="submit" size="sm">Save Preferences</Button>
        </form>
      </Card>

      <Card>
        <h3 className="font-display font-semibold text-ink-900 mb-1 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-ink-400" /> Security
        </h3>
        <p className="text-xs text-ink-500 mb-2">Keep your account secure.</p>
        <div className="divide-y divide-ink-100">
          <Toggle
            checked={twoFA}
            onChange={(v) => { setTwoFA(v); toast.success(v ? "Two-factor authentication enabled" : "Two-factor authentication disabled"); }}
            label="Two-Factor Authentication"
            description="Add an extra layer of security at login"
          />
        </div>
        <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-ink-100 text-xs text-ink-500">
          <Smartphone className="w-4 h-4 text-ink-400" />
          2 active sessions — this device and iPhone 15 Pro
        </div>
      </Card>
    </div>
  );
}
