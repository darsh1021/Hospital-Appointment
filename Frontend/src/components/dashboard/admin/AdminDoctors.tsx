import {
  Stethoscope,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  Plus,
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Sparkles,
  Building,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchDoctorsAdmin } from "../../../Features/admin/adminSlice";
import CreateStaffForm from "../../common/CreateStaffForm";
import type { AdminDoctor } from "../../../Features/admin/adminType";

const AdminDoctors = () => {
  const dispatch = useAppDispatch();
  const { doctors, loading, error } = useAppSelector((state) => state.admin);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<AdminDoctor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctorsAdmin());
  }, [dispatch]);

  if (loading && doctors.length === 0) {
    return (
      <div className="loading-state">
        <Loader2 size={16} className="animate-spin" /> Loading doctors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-error mt-2">
        <AlertTriangle size={16} className="shrink-0" /> {error}
      </div>
    );
  }

  return (
    <div className="dash-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctors Directory</h1>
          <p className="page-subtitle mt-1">Manage profiles, availability, and consultation fees.</p>
        </div>
        <button
          id="btn-add-doctor"
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={15} /> Add Doctor
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Total", value: doctors.length },
          { label: "Active", value: doctors.filter(d => d.status === "ACTIVE").length },
          { label: "Off-Duty", value: doctors.filter(d => d.status === "INACTIVE").length },
        ].map(s => (
          <div key={s.label} className="card-muted p-4 md:p-5 flex flex-col gap-1.5">
            <p className="metric-value">{s.value}</p>
            <p className="label-eyebrow">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Doctor List */}
      <div className="card overflow-hidden">
        {doctors.length === 0 ? (
          <div className="empty-state py-20">
            <Stethoscope size={24} className="text-[#a3a3a3]" />
            <p className="page-subtitle">No doctors found in the directory.</p>
          </div>
        ) : (
          <div>
            {doctors.map((doc, idx) => (
              <div
                key={doc.id}
                className={`flex flex-col md:flex-row md:items-center gap-4 px-5 py-4 transition-colors hover:bg-[#fafafa] dark:hover:bg-white/[0.02] cursor-pointer ${idx !== doctors.length - 1 ? "border-b border-[#e5e5e5] dark:border-white/[0.04]" : ""
                  }`}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setShowDetailModal(true);
                }}
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full card-inset font-medium text-[14px] text-[#0a0a0a] dark:text-white">
                  {doc.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="card-title">{doc.name}</span>
                    <span className={`badge ${doc.status === "ACTIVE" ? "badge-active" : "badge-neutral"}`}>
                      {doc.status === "ACTIVE" ? "Active" : "Off-duty"}
                    </span>
                  </div>
                  <p className="data-text-sm mt-0.5">
                    {doc.specialization} &middot; ₹{doc.consultation_fee} fee
                    {doc.phone && ` · ${doc.phone}`}
                  </p>
                </div>

                {/* Action */}
                <button
                  id={`btn-doctor-menu-${doc.id}`}
                  className="btn-icon ml-auto md:ml-0"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MoreHorizontal size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CreateStaffForm
              role="DOCTOR"
              hospitalId=""
              onSuccess={() => {
                setShowAddModal(false);
                dispatch(fetchDoctorsAdmin());
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Doctor Detail Modal */}
      {showDetailModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card p-6 space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between pb-4 section-divider">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full card-inset text-[17px] font-medium text-[#0a0a0a] dark:text-white">
                  {selectedDoctor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="section-title">{selectedDoctor.name}</h2>
                  <p className="data-text-sm mt-0.5">Doctor ID: {selectedDoctor.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="btn-icon -mt-1 -mr-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: Mail, label: "Email", value: selectedDoctor.email || "N/A" },
                { icon: Phone, label: "Phone", value: selectedDoctor.phone || "N/A" },
                { icon: Sparkles, label: "Specialization", value: selectedDoctor.specialization || "N/A" },
                { icon: GraduationCap, label: "Qualification", value: selectedDoctor.qualification || "N/A" },
                { icon: Briefcase, label: "Experience", value: selectedDoctor.experience !== undefined ? `${selectedDoctor.experience} Years` : "N/A" },
                { icon: Calendar, label: "Date of Birth", value: selectedDoctor.dob ? new Date(selectedDoctor.dob).toLocaleDateString() : "N/A" },
                { icon: Building, label: "Hospital", value: selectedDoctor.hospital_name || "N/A" },
                { icon: User, label: "Gender", value: selectedDoctor.gender || "N/A" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="card-muted p-3.5 flex items-center gap-3">
                  <Icon size={14} className="text-[#a3a3a3] shrink-0" />
                  <div className="min-w-0">
                    <p className="label-eyebrow">{label}</p>
                    <p className="data-text mt-0.5 truncate">{value}</p>
                  </div>
                </div>
              ))}

              {/* Address (Span full-width) */}
              <div className="card-muted p-3.5 flex items-start gap-3 md:col-span-2">
                <MapPin size={14} className="text-[#a3a3a3] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="label-eyebrow">Address</p>
                  <p className="data-text mt-0.5 whitespace-pre-wrap">{selectedDoctor.address || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="flex items-center justify-between p-3.5 card-inset">
              <span className="text-[13px] font-medium text-muted-foreground">Current Account Status</span>
              <span className={`badge ${selectedDoctor.status === "ACTIVE" ? "badge-active" : "badge-neutral"}`}>
                {selectedDoctor.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
