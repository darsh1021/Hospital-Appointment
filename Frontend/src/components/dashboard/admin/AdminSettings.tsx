import { Save, Building2, Clock, IndianRupee } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="dash-page max-w-3xl">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Clinic Settings</h1>
          <p className="page-subtitle mt-1">Configure clinic details, queue parameters, and fee structure.</p>
        </div>
        <button id="btn-save-settings" className="btn-primary">
          <Save size={15} /> Save Changes
        </button>
      </div>

      {/* Clinic Details */}
      <div className="card overflow-hidden">
        <div className="card-header flex items-center gap-2">
          <Building2 size={14} className="text-[#a3a3a3]" />
          <span className="label-eyebrow">Clinic Details</span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="field-label">Clinic Name</label>
            <input type="text" defaultValue="Clearskin Clinic" className="field-input" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="field-label">Contact Email</label>
            <input type="email" defaultValue="admin@clearskin.clinic" className="field-input" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="field-label">Clinic Address</label>
            <textarea rows={2} defaultValue="123 Health Ave, Medical District" className="field-input resize-none" />
          </div>
        </div>
      </div>

      {/* Queue Settings */}
      <div className="card overflow-hidden">
        <div className="card-header flex items-center gap-2">
          <Clock size={14} className="text-[#a3a3a3]" />
          <span className="label-eyebrow">Queue & Operations</span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="field-label">Online Booking Cap (%)</label>
            <input type="number" defaultValue="70" className="field-input" />
            <p className="field-helper">Percentage of tokens reserved for online bookings.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="field-label">Avg Consultation (mins)</label>
            <input type="number" defaultValue="15" className="field-input" />
            <p className="field-helper">Baseline before rolling average takes over.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="field-label">No-show Recall Buffer</label>
            <input type="number" defaultValue="2" className="field-input" />
            <p className="field-helper">Patients to wait before recalling a no-show.</p>
          </div>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="card overflow-hidden">
        <div className="card-header flex items-center gap-2">
          <IndianRupee size={14} className="text-[#a3a3a3]" />
          <span className="label-eyebrow">Fee Structure</span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="field-label">New Consultation (₹)</label>
            <input type="number" defaultValue="400" className="field-input" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="field-label">Follow-up (₹)</label>
            <input type="number" defaultValue="200" className="field-input" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
