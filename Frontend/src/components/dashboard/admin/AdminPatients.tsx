import {
  Users, Search, CalendarDays, Ticket, MoreHorizontal,
  X, Phone, MapPin, Calendar, Clock, CreditCard,
  Loader2, AlertTriangle, Trash2, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchPatientsAdmin, fetchPatientDetail, removePatientAdmin } from "../../../Features/admin/adminSlice";
import type { AdminPatient } from "../../../Features/admin/adminType";

const AdminPatients = () => {
  const dispatch = useAppDispatch();
  const { patients: allPatients, loading, error } = useAppSelector((state) => state.admin);

  useEffect(() => { dispatch(fetchPatientsAdmin()); }, [dispatch]);

  const [query, setQuery]                     = useState("");
  const [showDetail, setShowDetail]           = useState(false);
  const [patientInfo, setPatientInfo]         = useState<any>(null);
  const [detailLoading, setDetailLoading]     = useState(false);
  const [showDangerZone, setShowDangerZone]   = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  const filtered = allPatients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) || p.phone.includes(query)
  );

  const openDetail = async (patient: AdminPatient) => {
    setShowDetail(true);
    setDetailLoading(true);
    setShowDangerZone(false);
    setShowDeleteConfirm(false);
    setPatientInfo({ ...patient, appointments: [] });
    try {
      const result = await dispatch(fetchPatientDetail(patient.id));
      if (fetchPatientDetail.fulfilled.match(result)) {
        const payload = result.payload;
        if (payload?.patient) {
          setPatientInfo({
            ...payload.patient,
            total_appointments: payload.stats?.totalAppointments ?? payload.patient.appointments?.length ?? 0
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!patientInfo?.id) return;
    setDeleteLoading(true);
    try {
      await dispatch(removePatientAdmin(patientInfo.id)).unwrap();
      setShowDeleteConfirm(false);
      setShowDetail(false);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && allPatients.length === 0) {
    return <div className="loading-state"><Loader2 size={16} className="animate-spin" /> Loading patients...</div>;
  }

  if (error) {
    return <div className="alert-error mt-2"><AlertTriangle size={16} className="shrink-0" /> {error}</div>;
  }

  return (
    <div className="dash-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients Directory</h1>
          <p className="page-subtitle mt-1">Search, view, and manage all registered patients.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-[#fafafa] px-3 py-1.5 dark:border-white/[0.08] dark:bg-white/[0.04]">
          <Users size={13} className="text-[#a3a3a3]" />
          <span className="data-text-sm">{allPatients.length} Registered</span>
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
        <input
          id="patient-search"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or phone..."
          className="field-input pl-9"
        />
      </div>

      {/* Patient Table */}
      <div className="card overflow-hidden">
        {/* Table Header */}
        <div className="table-header hidden md:grid grid-cols-[1fr_70px_150px_110px_130px_40px] gap-4">
          {["Patient", "Age", "Phone", "Visits", "Last Visit", ""].map(h => (
            <span key={h} className="table-col-header">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="empty-state py-20">
            <Users size={22} className="text-[#a3a3a3]" />
            <p className="page-subtitle">No patients match your search.</p>
          </div>
        ) : filtered.map((patient, idx) => (
          <div
            key={patient.id}
            onClick={() => openDetail(patient)}
            className={`group flex flex-col md:grid md:grid-cols-[1fr_70px_150px_110px_130px_40px] gap-2 md:gap-4 px-5 py-4 items-start md:items-center cursor-pointer transition-colors hover:bg-[#fafafa] dark:hover:bg-white/[0.02] ${
              idx !== filtered.length - 1 ? "border-b border-[#e5e5e5] dark:border-white/[0.04]" : ""
            }`}
          >
            {/* Name */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full card-inset text-[13px] font-medium text-[#0a0a0a] dark:text-white">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <span className="card-title group-hover:text-[#404040] dark:group-hover:text-[#e5e5e5] transition-colors">
                {patient.name}
              </span>
            </div>

            <span className="data-text">{patient.age != null ? `${patient.age} yrs` : "—"}</span>

            <span className="data-text">{patient.phone}</span>

            <span className="data-text flex items-center gap-1.5">
              <Ticket size={12} className="text-[#a3a3a3]" /> {patient.total_appointments}
            </span>

            <span className="data-text-sm flex items-center gap-1.5">
              <CalendarDays size={12} className="text-[#a3a3a3]" />
              {patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : "Never"}
            </span>

            <button
              id={`btn-patient-menu-${patient.id}`}
              onClick={e => { e.stopPropagation(); openDetail(patient); }}
              className="btn-icon"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Patient Detail Modal ───────────────────────────────────── */}
      {showDetail && patientInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card p-6 space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between pb-4 section-divider">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full card-inset text-[17px] font-medium text-[#0a0a0a] dark:text-white">
                  {patientInfo.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="section-title">{patientInfo.name}</h2>
                  <p className="data-text-sm mt-0.5">ID: {patientInfo.id}</p>
                </div>
              </div>
              <button onClick={() => setShowDetail(false)} className="btn-icon -mt-1 -mr-1">
                <X size={16} />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Phone,    label: "Phone",    value: patientInfo.phone || "N/A" },
                { icon: Calendar, label: "Age",      value: patientInfo.age ? `${patientInfo.age} yrs` : "N/A" },
                { icon: MapPin,   label: "Address",  value: patientInfo.address || "N/A" },
                { icon: Ticket,   label: "Visits",   value: `${patientInfo.total_appointments ?? 0} total` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="card-muted p-3.5 flex items-center gap-3">
                  <Icon size={14} className="text-[#a3a3a3] shrink-0" />
                  <div className="min-w-0">
                    <p className="label-eyebrow">{label}</p>
                    <p className="data-text mt-0.5 truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Appointments */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="section-title text-[15px] flex items-center gap-2">
                  <CalendarDays size={15} className="text-[#a3a3a3]" /> Appointment History
                </h3>
                {detailLoading && (
                  <span className="data-text-sm flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" /> Loading...
                  </span>
                )}
              </div>

              {patientInfo.appointments?.length > 0 ? (
                <div className="card overflow-hidden">
                  {patientInfo.appointments.map((apt: any, i: number) => (
                    <div key={apt.id} className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? "border-t border-[#e5e5e5] dark:border-white/[0.04]" : ""}`}>
                      <div>
                        <p className="data-text">Token #{apt.tokenNumber || "N/A"}</p>
                        <p className="data-text-sm flex items-center gap-1.5 mt-0.5">
                          <Clock size={11} />
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                          {apt.appointmentTime && ` at ${apt.appointmentTime}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {apt.payment?.totalAmount && (
                          <span className="data-text-sm flex items-center gap-1">
                            <CreditCard size={11} className="text-[#a3a3a3]" /> ₹{apt.payment.totalAmount}
                          </span>
                        )}
                        <span className={`badge ${
                          apt.status === "COMPLETED" ? "badge-completed" :
                          apt.status === "CANCELLED" ? "badge-cancelled" : "badge-pending"
                        }`}>
                          {apt.status || "BOOKED"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-muted p-6 text-center">
                  <p className="page-subtitle">{detailLoading ? "Loading history..." : "No appointments found."}</p>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] dark:border-[#dc2626]/20 dark:bg-[#dc2626]/[0.04] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowDangerZone(!showDangerZone)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#fee2e2]/60 dark:hover:bg-[#dc2626]/[0.06] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle size={15} className="text-[#dc2626] shrink-0" />
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-[#991b1b] dark:text-[#fca5a5]">Danger Zone</p>
                    <p className="text-[12px] text-[#b91c1c]/70 dark:text-[#fca5a5]/60">Destructive actions — proceed carefully.</p>
                  </div>
                </div>
                <span className="label-eyebrow text-[#dc2626] underline">{showDangerZone ? "Hide" : "Show"}</span>
              </button>

              {showDangerZone && (
                <div className="px-4 pb-4 pt-2 border-t border-[#fecaca] dark:border-[#dc2626]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-medium text-[#991b1b] dark:text-[#fca5a5]">Delete Patient Record</p>
                    <p className="text-[12px] text-[#b91c1c]/70 dark:text-[#fca5a5]/60">Permanently removes all associated data.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-danger shrink-0 text-[13px]"
                  >
                    <Trash2 size={14} /> Delete Patient
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-1">
              <button type="button" onClick={() => setShowDetail(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────── */}
      {showDeleteConfirm && patientInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md card p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] dark:bg-[#dc2626]/10 dark:border-[#dc2626]/20">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="section-title text-[15px]">Confirm Deletion</h3>
                <p className="label-eyebrow text-[#dc2626] mt-0.5">This action is irreversible</p>
              </div>
            </div>

            <p className="body-text text-[13px] leading-relaxed">
              You are about to permanently delete <strong className="font-semibold text-[#0a0a0a] dark:text-white">{patientInfo.name}</strong> and all
              their associated appointment records. This <strong>cannot be undone</strong>.
            </p>

            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="btn-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="btn-danger disabled:opacity-50"
              >
                {deleteLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPatients;
