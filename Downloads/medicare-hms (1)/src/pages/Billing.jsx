import { useState } from "react";
import { Download, Plus, Eye, Search } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { billing } from "../data/mockData";

export default function Billing() {
  const [search, setSearch] = useState("");
  const [invoice, setInvoice] = useState(null);

  const filtered = billing.filter(
    (b) => b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = billing.filter((b) => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0);
  const totalPending = billing.filter((b) => b.status !== "Paid").reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink-900">Billing</h2>
          <p className="text-sm text-ink-500 mt-0.5">{billing.length} invoices this period</p>
        </div>
        <Button icon={Plus}>Create Invoice</Button>
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
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono-num text-xs text-ink-500">{b.id}</td>
                  <td className="px-5 py-3 font-medium text-ink-800">{b.patient}</td>
                  <td className="px-5 py-3 text-ink-600">{b.department}</td>
                  <td className="px-5 py-3 text-ink-600 font-mono-num text-xs">{b.date}</td>
                  <td className="px-5 py-3 font-mono-num font-medium text-ink-800">${b.amount.toLocaleString()}</td>
                  <td className="px-5 py-3"><Badge status={b.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setInvoice(b)} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50" aria-label="View invoice"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => toast.success(`Downloading ${b.id}.pdf`)} className="p-2 rounded-lg text-ink-400 hover:text-accent-600 hover:bg-accent-50" aria-label="Download PDF"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
              <div><p className="text-ink-400 text-xs">Invoice ID</p><p className="font-medium text-ink-800 font-mono-num">{invoice.id}</p></div>
              <div><p className="text-ink-400 text-xs">Date</p><p className="font-medium text-ink-800">{invoice.date}</p></div>
              <div><p className="text-ink-400 text-xs">Patient</p><p className="font-medium text-ink-800">{invoice.patient}</p></div>
              <div><p className="text-ink-400 text-xs">Department</p><p className="font-medium text-ink-800">{invoice.department}</p></div>
            </div>
            <div className="flex items-center justify-between bg-ink-50 rounded-xl px-4 py-3 mb-5">
              <span className="text-sm font-medium text-ink-700">Total Amount</span>
              <span className="text-xl font-display font-bold text-ink-900 font-mono-num">${invoice.amount.toLocaleString()}</span>
            </div>
            <Button icon={Download} className="w-full" onClick={() => toast.success(`Downloading ${invoice.id}.pdf`)}>Download PDF</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
