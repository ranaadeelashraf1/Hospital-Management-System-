import { useEffect, useState } from "react";
import { appointmentsApi } from "../../api/appointments";
import { Select } from "../ui/Input";

export default function AppointmentSlotSelect({ doctorId, date, value, onChange, name = "time" }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setSlots([]);
    if (!doctorId || !date) return undefined;

    setLoading(true);
    appointmentsApi
      .getAvailability(doctorId, date)
      .then((nextSlots) => {
        if (active) setSlots(nextSlots);
      })
      .catch(() => {
        if (active) setSlots([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [doctorId, date]);

  return (
    <Select name={name} value={value} onChange={onChange} required disabled={loading || !doctorId || !date}>
      <option value="">{loading ? "Loading slots..." : "Select a time slot"}</option>
      {slots.map((slot) => (
        <option key={slot.time} value={slot.time} disabled={!slot.available}>
          {slot.time}{slot.available ? "" : " - Already booked"}
        </option>
      ))}
    </Select>
  );
}
