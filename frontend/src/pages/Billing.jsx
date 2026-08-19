import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Search } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { Field, Input, Select } from "../components/ui/Input";
import { TableSkeleton } from "../components/ui/Skeleton";
import { billingApi } from "../api/billing";
import { patientsApi } from "../api/patients";

const statusLabel = { PAID: "Paid", UNPAID: "Unpaid", PENDING: "Pending" };

function normalize(b) {
  return {
    id: b.id,
    patient: b.patient?.user?.name || "—",
    department: b.patient?.department?.name || "—",
    date: b.invoiceDate?.slice(0, 10),
    amount: Number(b.amount),
    status: statusLabel[b.status] || b.status,
  };
}

export default function Billing() {
  const [billing, setBilling] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [billingRes, patientsRes] = await Promise.all([
        billingApi.getAll(),
        patientsApi.getAll({ limit: 1000 }),
      ]);
      setBilling(billingRes.map(normalize));
      setPatients(patientsRes);
    } catch (err) {
      toast.error(err.message || "Failed to load billing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(
    () => billing.filter((b) => b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())),
    [billing, search]
  );

  const totalRevenue = billing.filter((b) => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0);
  const totalPending = billing.filter((b) => b.status !== "Paid").reduce((sum, b) => sum + b.amount, 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setSaving(true);
    try {
      await billingApi.create({
        patientId: form.get("patientId"),
        amount: Number(form.get("amount")),
        status: form.get("status"),
      });
      toast.success("Invoice created.");
      setAddOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to create invoice.");
    } finally {
      setSaving(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await billingApi.update(id, { status: "PAID" });
      toast.success("Marked as paid.");
      loadData();
      setInvoice(null);
    } catch (err) {
      toast.error(err.message || "Failed to update invoice.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Billing</h2>
          <p className="text-sm text-ink-500 mt-0.5">{billing.length} invoices</p>
        </div>
        <Button icon={Plus} onClick={() => setAddOpen(true)}>Create Invoice</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
          <p className="text-primary-100 text-sm">Total Collected</p>
          <p className="text-3xl font-display font-bold mt-1 font-mono-num">${totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="bg-gradient-to-br from-accent-600 to-accent-700 text-white border-0">
          <p className="text-accent-100 text-sm">Pending / Unpaid</p>
          <p className="text-3xl font-display font-bold mt-1 font-mono-num">${totalPending.toLocaleString()}</p>
        </Card>
      </div>

      <Card padded={false}>
        <div className="p-5 border-b border-ink-100">
          <Input icon={Search} placeholder="Search by patient or invoice ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs uppercase tracking-wide border-b border-ink-100">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-6"><TableSkeleton rows={5} cols={7} /></td></tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                    <td className="px-5 py-3 font-mono-num text-xs text-ink-500">{b.id.slice(0, 8)}</td>
                    <td className="px-5 py-3 font-medium text-ink-800">{b.patient}</td>
                    <td className="px-5 py-3 text-ink-600">{b.department}</td>
                    <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{b.date}</td>
                    <td className="px-5 py-3 font-mono-num font-medium text-ink-800">${b.amount.toLocaleString()}</td>
                    <td className="px-5 py-3"><Badge status={b.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setInvoice(b)} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50" aria-label="View invoice"><Eye className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create Invoice">
        <form id="add-invoice-form" onSubmit={handleAdd}>
          <Field label="Patient">
            <Select name="patientId" defaultValue={patients[0]?.id || ""}>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.user?.name}</option>)}
            </Select>
          </Field>
          <Field label="Amount"><Input name="amount" type="number" min="0" step="0.01" required placeholder="e.g. 5000" /></Field>
          <Field label="Status">
            <Select name="status" defaultValue="PENDING">
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </Select>
          </Field>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button type="submit" form="add-invoice-form" loading={saving}>Create</Button>
        </div>
      </Modal>

      <Modal open={!!invoice} onClose={() => setInvoice(null)} title="Invoice Details">
        {invoice && (
          <div>
            <div className="flex items-center justify-between border-b border-ink-100 pb-4 mb-4">
              <div>
                <p className="font-display font-bold text-lg text-ink-900">MediCare Hospital</p>
                <p className="text-xs text-ink-400">123 Wellness Avenue, Lahore</p>
              </div>
              <Badge status={invoice.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              <div><p className="text-ink-400 text-xs">Invoice ID</p><p className="font-medium text-ink-800 font-mono-num">{invoice.id.slice(0, 8)}</p></div>
              <div><p className="text-ink-400 text-xs">Date</p><p className="font-medium text-ink-800">{invoice.date}</p></div>
              <div><p className="text-ink-400 text-xs">Patient</p><p className="font-medium text-ink-800">{invoice.patient}</p></div>
              <div><p className="text-ink-400 text-xs">Department</p><p className="font-medium text-ink-800">{invoice.department}</p></div>
            </div>
            <div className="flex items-center justify-between bg-ink-50 rounded-xl px-4 py-3 mb-5">
              <span className="text-sm font-medium text-ink-700">Total Amount</span>
              <span className="text-xl font-display font-bold text-ink-900 font-mono-num">${invoice.amount.toLocaleString()}</span>
            </div>
            {invoice.status !== "Paid" && (
              <Button className="w-full" onClick={() => markPaid(invoice.id)}>Mark as Paid</Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
