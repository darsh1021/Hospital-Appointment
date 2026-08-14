import React, { useState } from "react";
import { useAppDispatch } from "../../app/store";
import { addDoctorAdmin, addReceptionistAdmin } from "../../Features/admin/adminSlice";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Sparkles, 
  Briefcase, 
  Users, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

type Props = {
    role: string;
    hospitalId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface Body {
    name: string;
    email: string;
    password: string;
    dob: string;
    phone: string;
    gender: "MALE" | "FEMALE" | "OTHER" | "";
    qualification: string;
    specialization: string;
    experience: number;
    address: string;
}

const CreateStaffForm = ({ role, hospitalId, onSuccess, onCancel }: Props) => {
    const dispatch = useAppDispatch();
    
    const [formData, setFormData] = useState<Body>({
        name: "",
        email: "",
        password: "",
        dob: "",
        phone: "",
        gender: "",
        qualification: "",
        specialization: "",
        experience: 0,
        address: ""
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const isDoctor = role.toLowerCase() === "doctor";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "experience" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!formData.gender) {
            setError("Please select a gender.");
            return;
        }

        setLoading(true);

        try {
            const dataToSubmit: any = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                gender: formData.gender,
                qualification: formData.qualification || undefined,
                address: formData.address || undefined,
                dob: formData.dob || undefined,
                hospital_id: hospitalId,
            };

            if (isDoctor) {
                dataToSubmit.specialization = formData.specialization;
                dataToSubmit.experience = formData.experience ? Number(formData.experience) : undefined;
                
                await dispatch(addDoctorAdmin(dataToSubmit)).unwrap();
            } else {
                await dispatch(addReceptionistAdmin(dataToSubmit)).unwrap();
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            setError(err || `Failed to create ${role.toLowerCase()}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-3xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="card-header flex items-center justify-between">
                <div>
                    <h2 className="section-title">
                        Create New {isDoctor ? "Doctor" : "Receptionist"}
                    </h2>
                    <p className="page-subtitle text-xs mt-0.5">
                        Fill in the required information to register a new staff member.
                    </p>
                </div>
                <span className={`badge ${isDoctor ? "badge-active" : "badge-neutral"}`}>
                    {role.toUpperCase()}
                </span>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-5 mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start gap-2.5 text-[13px]">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="field-label flex items-center gap-1.5">
                            <User size={14} className="text-muted-foreground" /> Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Dr. John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="field-input"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                        <label className="field-label flex items-center gap-1.5">
                            <Mail size={14} className="text-muted-foreground" /> Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="john.doe@clinic.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="field-input"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                        <label className="field-label flex items-center gap-1.5">
                            <Phone size={14} className="text-muted-foreground" /> Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleChange}
                            className="field-input"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="field-label flex items-center gap-1.5">
                            <Lock size={14} className="text-muted-foreground" /> Initial Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="field-input"
                        />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                        <label className="field-label flex items-center gap-1.5">
                            <Users size={14} className="text-muted-foreground" /> Gender *
                        </label>
                        <select
                            name="gender"
                            required
                            value={formData.gender}
                            onChange={handleChange}
                            className="field-input"
                        >
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                        <label className="field-label flex items-center gap-1.5">
                            <Calendar size={14} className="text-muted-foreground" /> Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="field-input"
                        />
                    </div>

                    {/* Qualification (Shown for both Doctor and Receptionist) */}
                    <div className="space-y-1.5">
                        <label className="field-label flex items-center gap-1.5">
                            <GraduationCap size={14} className="text-muted-foreground" /> Qualification
                        </label>
                        <input
                            type="text"
                            name="qualification"
                            placeholder={isDoctor ? "e.g., MBBS, MD" : "e.g., Bachelor of Commerce, Diploma"}
                            value={formData.qualification}
                            onChange={handleChange}
                            className="field-input"
                        />
                    </div>

                    {/* Role Specific Fields (Doctor Specialization & Experience) */}
                    {isDoctor && (
                        <>
                            {/* Specialization */}
                            <div className="space-y-1.5">
                                <label className="field-label flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-muted-foreground" /> Specialization *
                                </label>
                                <select
                                    name="specialization"
                                    required={isDoctor}
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="field-input"
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="General Medicine">General Medicine</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="ENT">ENT</option>
                                </select>
                            </div>

                            {/* Experience */}
                            <div className="space-y-1.5">
                                <label className="field-label flex items-center gap-1.5">
                                    <Briefcase size={14} className="text-muted-foreground" /> Experience (Years)
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    min="0"
                                    placeholder="e.g., 5"
                                    value={formData.experience || ""}
                                    onChange={handleChange}
                                    className="field-input"
                                />
                            </div>
                        </>
                    )}

                    {/* Address */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="field-label flex items-center gap-1.5">
                            <MapPin size={14} className="text-muted-foreground" /> Address
                        </label>
                        <textarea
                            name="address"
                            rows={3}
                            placeholder="Enter contact address..."
                            value={formData.address}
                            onChange={handleChange}
                            className="field-input resize-none"
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e5e5] dark:border-white/[0.06]">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Staff Account"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateStaffForm;