import { useState } from "react"
import { Plus, Trash2, Send, CalendarDays, Pill, FileText } from "lucide-react"

type Medication = {
  id: number
  name: string
  dosage: string
  frequency: string
  duration: string
}

const DoctorPrescription = () => {
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: "Clindamycin Gel 1%", dosage: "Apply thin layer", frequency: "Twice daily", duration: "4 weeks" },
  ])
  const [diagnosis, setDiagnosis] = useState("")
  const [instructions, setInstructions] = useState("")
  const [followUpDate, setFollowUpDate] = useState("")
  const [nextId, setNextId] = useState(2)

  const addMedication = () => {
    setMedications(prev => [
      ...prev,
      { id: nextId, name: "", dosage: "", frequency: "Once daily", duration: "" },
    ])
    setNextId(n => n + 1)
  }

  const removeMedication = (id: number) => {
    setMedications(prev => prev.filter(m => m.id !== id))
  }

  const updateMedication = (id: number, field: keyof Medication, value: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const inputClass =
    "w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-[13px] text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:outline-none resize-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          Write Prescription
        </h1>
        <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
          Issue a prescription for the current patient. The prescription is linked to their token.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">
        {/* ── Form ── */}
        <div className="flex flex-col gap-6">
          {/* Patient info strip */}
          <div className="flex items-center gap-4 rounded-xl border border-[#ebebeb] bg-[#fafafa] p-4 dark:border-white/10 dark:bg-[#171717]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
              <span className="font-mono text-[12px] font-medium text-[#171717] dark:text-white">#42</span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#171717] dark:text-white">Priya Sharma</p>
              <p className="text-[12px] text-[#888888]">Follow-up · ₹200 applied</p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[12px] uppercase text-[#888888]">Diagnosis</label>
            <textarea
              id="prescription-diagnosis"
              rows={2}
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              placeholder="e.g. Acne Vulgars (Grade II), Contact Dermatitis..."
              className={inputClass}
            />
          </div>

          {/* Medications */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[12px] uppercase text-[#888888]">Medications</label>
              <button
                id="btn-add-medication"
                onClick={addMedication}
                className="flex h-7 items-center gap-1.5 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 text-[12px] font-medium text-[#171717] transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <Plus size={12} /> Add
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {medications.map((med, idx) => (
                <div
                  key={med.id}
                  className="flex flex-col gap-3 rounded-lg border border-[#ebebeb] p-4 dark:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill size={14} className="text-[#888888]" />
                      <span className="font-mono text-[11px] uppercase text-[#888888]">Medication {idx + 1}</span>
                    </div>
                    {medications.length > 1 && (
                      <button
                        id={`btn-remove-med-${med.id}`}
                        onClick={() => removeMedication(med.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[#ee0000] transition hover:bg-[#f7d4d6] dark:hover:bg-[#ee0000]/10"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <input
                        id={`med-name-${med.id}`}
                        type="text"
                        value={med.name}
                        onChange={e => updateMedication(med.id, "name", e.target.value)}
                        placeholder="Drug name & strength"
                        className={inputClass}
                      />
                    </div>
                    <input
                      id={`med-dosage-${med.id}`}
                      type="text"
                      value={med.dosage}
                      onChange={e => updateMedication(med.id, "dosage", e.target.value)}
                      placeholder="Dosage / application"
                      className={inputClass}
                    />
                    <select
                      id={`med-freq-${med.id}`}
                      value={med.frequency}
                      onChange={e => updateMedication(med.id, "frequency", e.target.value)}
                      className={inputClass}
                    >
                      {["Once daily", "Twice daily", "Three times daily", "As needed", "At bedtime"].map(f => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                    <input
                      id={`med-duration-${med.id}`}
                      type="text"
                      value={med.duration}
                      onChange={e => updateMedication(med.id, "duration", e.target.value)}
                      placeholder="Duration (e.g. 4 weeks)"
                      className={`${inputClass} col-span-2`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[12px] uppercase text-[#888888]">Additional Instructions</label>
            <textarea
              id="prescription-instructions"
              rows={3}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Lifestyle notes, dietary advice, application technique..."
              className={inputClass}
            />
          </div>

          {/* Follow-up date */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[12px] uppercase text-[#888888]">Follow-up Date (optional)</label>
            <div className="relative">
              <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                id="prescription-followup-date"
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
            <p className="text-[12px] text-[#888888]">
              Setting a follow-up date automatically tags the patient for the ₹200 discounted fee on return.
            </p>
          </div>

          {/* Issue button */}
          <button
            id="btn-issue-prescription"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#171717] text-[15px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90"
          >
            <Send size={16} />
            Issue Prescription &amp; Complete Consultation
          </button>
        </div>

        {/* ── Preview ── */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[12px] uppercase text-[#888888]">Preview</p>
          <div className="flex flex-col rounded-xl border border-[#ebebeb] bg-white p-6 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] gap-5 dark:border-white/10 dark:bg-[#0a0a0a]">
            {/* Clinic header */}
            <div className="border-b border-[#ebebeb] pb-4 dark:border-white/10">
              <p className="text-[13px] font-semibold text-[#171717] dark:text-white">Clearskin Clinic</p>
              <p className="text-[11px] text-[#888888]">Dermatology &amp; Skin Care</p>
            </div>

            {/* Patient */}
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[11px] uppercase text-[#888888]">Patient</p>
              <p className="text-[14px] font-medium text-[#171717] dark:text-white">Priya Sharma, 34</p>
              {followUpDate && (
                <p className="text-[12px] text-[#888888]">Follow-up: {followUpDate}</p>
              )}
            </div>

            {/* Diagnosis */}
            {diagnosis && (
              <div className="flex flex-col gap-1">
                <p className="font-mono text-[11px] uppercase text-[#888888]">Diagnosis</p>
                <p className="text-[13px] text-[#4d4d4d] dark:text-[#888888]">{diagnosis}</p>
              </div>
            )}

            {/* Medications */}
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[11px] uppercase text-[#888888]">Rx</p>
              {medications.map((med, idx) => (
                <div key={med.id} className="flex flex-col rounded-[6px] bg-[#fafafa] px-3 py-2.5 dark:bg-[#171717]">
                  <p className="text-[13px] font-medium text-[#171717] dark:text-white">
                    {idx + 1}. {med.name || "—"}
                  </p>
                  {(med.dosage || med.frequency || med.duration) && (
                    <p className="text-[12px] text-[#888888] mt-0.5">
                      {[med.dosage, med.frequency, med.duration].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            {instructions && (
              <div className="flex flex-col gap-1">
                <p className="font-mono text-[11px] uppercase text-[#888888]">Instructions</p>
                <p className="text-[12px] text-[#888888]">{instructions}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-[#ebebeb] pt-4 flex items-center gap-2 dark:border-white/10">
              <FileText size={13} className="text-[#888888]" />
              <p className="text-[11px] text-[#888888]">Token #42 · {new Date().toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorPrescription
