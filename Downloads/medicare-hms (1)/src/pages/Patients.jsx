import { useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, SlidersHorizontal, Phone } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Pagination from "../components/ui/Pagination";
import { Field, Input, Select } from "../components/ui/Input";
import { TableSkeleton } from "../components/ui/Skeleton";
import { patients as initialPatients } from "../data/mockData";

const PAGE_SIZE = 5;

export default function Patients() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [viewPatient, setViewPatient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const departments = ["All", ...new Set(initialPatients.map((p) => p.department))];
  const statuses = ["All", "Admitted", "Outpatient", "Discharged"];

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === "All" || p.department === deptFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [patients, search, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newPatient = {
      id: `PT-${2200 + patients.length + 1}`,
      name: form.get("name"),
      age: Number(form.get("age")),
      gender: form.get("gender"),
      phone: form.get("phone"),
      department: form.get("department"),
      status: "Outpatient",
      lastVisit: new Date().toISOString().slice(0, 10),
      avatar: form.get("name").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    };
    setPatients([newPatient, ...patients]);
    setAddOpen(false);
    toast.success("Patient added successfully");
  };

  const handleDelete = () => {
    setPatients(patients.filter((p) => p.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} removed from records`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Patients</h2>
          <p className="text-sm text-ink-500 mt-0.5">{filtered.length} patients found</p>
        </div>
        <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Patient</Button>
      </div>

      <Card padded={false}>
        <div className="p-5 flex flex-col md:flex-row gap-3 border-b border-ink-100">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name or patient ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex gap-3">
            <Select icon={SlidersHorizontal} value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} className="min-w-[160px]">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="min-w-[140px]">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs uppercase tracking-wide border-b border-ink-100">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Age/Gender</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Last Visit</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-ink-400 text-sm">No patients match your search.</td></tr>
              ) : (
                paged.map((p) => (
                  <tr key={p.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          {p.avatar}
                        </div>
                        <span className="font-medium text-ink-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500 font-mono-num text-xs">{p.id}</td>
                    <td className="px-5 py-3 text-ink-600">{p.age} / {p.gender}</td>
                    <td className="px-5 py-3 text-ink-600">{p.department}</td>
                    <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{p.lastVisit}</td>
                    <td className="px-5 py-3"><Badge status={p.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewPatient(p)} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50" aria-label="View details"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg text-ink-400 hover:text-accent-600 hover:bg-accent-50" aria-label="Edit patient"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-lg text-ink-400 hover:text-danger-500 hover:bg-danger-100/60" aria-label="Delete patient"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
        </div>
      </Card>

      {/* Add patient modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Patient" size="lg">
        <form id="add-patient-form" onSubmit={handleAdd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Full Name"><Input name="name" required placeholder="e.g. Zainab Iqbal" /></Field>
            <Field label="Phone Number"><Input name="phone" icon={Phone} required placeholder="+92 300 0000000" /></Field>
            <Field label="Age"><Input name="age" type="number" min="0" required placeholder="e.g. 29" /></Field>
            <Field label="Gender">
              <Select name="gender" defaultValue="Female">
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Department" className="sm:col-span-2">
              <Select name="department" defaultValue="Cardiology">
                {departments.filter((d) => d !== "All").map((d) => <option key={d}>{d}</option>)}
              </Select>
            </Field>
          </div>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button type="submit" form="add-patient-form">Save Patient</Button>
        </div>
      </Modal>

      {/* View patient modal */}
      <Modal open={!!viewPatient} onClose={() => setViewPatient(null)} title="Patient Details">
        {viewPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-semibold">
                {viewPatient.avatar}
              </div>
              <div>
                <p className="font-display font-semibold text-lg text-ink-900">{viewPatient.name}</p>
                <p className="text-xs text-ink-400 font-mono-num">{viewPatient.id}</p>
              </div>
              <Badge status={viewPatient.status} className="ml-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-ink-400 text-xs mb-0.5">Age / Gender</p><p className="text-ink-800 font-medium">{viewPatient.age} / {viewPatient.gender}</p></div>
              <div><p className="text-ink-400 text-xs mb-0.5">Phone</p><p className="text-ink-800 font-medium">{viewPatient.phone}</p></div>
              <div><p className="text-ink-400 text-xs mb-0.5">Department</p><p className="text-ink-800 font-medium">{viewPatient.department}</p></div>
              <div><p className="text-ink-400 text-xs mb-0.5">Last Visit</p><p className="text-ink-800 font-medium">{viewPatient.lastVisit}</p></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Patient" size="sm">
        <p className="text-sm text-ink-600">
          Are you sure you want to remove <span className="font-medium text-ink-900">{deleteTarget?.name}</span> from records? This can't be undone.
        </p>
        <div className="flex justify-end gap-3 pt-5">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Remove</Button>
        </div>
      </Modal>
    </div>
  );
}
