import { useEffect, useState } from "react";
import { Plus, ArrowUpRight, Stethoscope, Users } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { Field, Input } from "../components/ui/Input";
import { CardSkeleton } from "../components/ui/Skeleton";
import { departmentsApi } from "../api/departments";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    departmentsApi
      .getAll()
      .then(setDepartments)
      .catch((err) => toast.error(err.message || "Failed to load departments."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setSaving(true);
    try {
      await departmentsApi.create({ name: form.get("name") });
      toast.success("Department created.");
      setAddOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to create department.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Departments</h2>
          <p className="text-sm text-ink-500 mt-0.5">{departments.length} active departments</p>
        </div>
        <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Department</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          departments.map((d) => (
            <Card key={d.id} hover className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <button className="p-1.5 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-display font-semibold text-ink-900">{d.name}</h3>
              <p className="text-xs text-ink-500 mt-0.5">
                Head: {d.headDoctor?.user?.name || "Not assigned"}
              </p>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-ink-100">
                <div className="flex items-center gap-1.5 text-sm text-ink-600">
                  <Stethoscope className="w-4 h-4 text-primary-500" />
                  <span className="font-mono-num font-medium">{d._count?.doctors ?? 0}</span>
                  <span className="text-xs text-ink-400">doctors</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-ink-600">
                  <Users className="w-4 h-4 text-accent-500" />
                  <span className="font-mono-num font-medium">{d._count?.patients ?? 0}</span>
                  <span className="text-xs text-ink-400">patients</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {!loading && departments.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-ink-400 text-sm">No departments yet. Add your first one.</p>
        </Card>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Department">
        <form id="add-dept-form" onSubmit={handleAdd}>
          <Field label="Department Name"><Input name="name" required placeholder="e.g. Oncology" /></Field>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button type="submit" form="add-dept-form" loading={saving}>Create</Button>
        </div>
      </Modal>
    </div>
  );
}
