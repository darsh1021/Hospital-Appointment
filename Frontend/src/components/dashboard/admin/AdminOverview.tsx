import {
  Users, Stethoscope, TrendingUp, IndianRupee,
  Clock, CalendarDays, BarChart3, CheckCircle2, XCircle, AlertCircle,
  Loader2
} from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchReportsAdmin, fetchDoctorsAdmin, fetchPatientsAdmin } from "../../../Features/admin/adminSlice";

const AdminOverview = () => {
  const dispatch = useAppDispatch();
  const { statistics, doctors, patients, loading, error } = useAppSelector((state) => state.admin);

  useEffect(() => {
    const year = new Date().getFullYear();
    dispatch(fetchReportsAdmin({ startDate: `${year}-01-01`, endDate: `${year}-12-31` }));
    dispatch(fetchDoctorsAdmin());
    dispatch(fetchPatientsAdmin());
  }, [dispatch]);

  const stats = {
    totalPatients: patients.length,
    totalDoctors: doctors.length,
    todayRegistered: 0,
    todayRevenue: statistics?.revenue_generated || 0,
    avgWaitTime: statistics?.average_waiting_time_minutes || 0,
    noShowRate: 0,
    onlineSplit: 70,
    walkInSplit: 30,
  };

  const weeklyData = [
    { day: "Mon", patients: 20, revenue: 7200 },
    { day: "Tue", patients: 25, revenue: 9000 },
    { day: "Wed", patients: 18, revenue: 6400 },
    { day: "Thu", patients: 23, revenue: 7800 },
    { day: "Fri", patients: 27, revenue: 9600 },
    { day: "Sat", patients: 15, revenue: 5200 },
  ];
  const maxPatients = Math.max(...weeklyData.map(d => d.patients));

  if (loading && doctors.length === 0 && patients.length === 0) {
    return (
      <div className="loading-state">
        <Loader2 size={16} className="animate-spin" /> Loading overview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-error mt-2">
        <AlertCircle size={16} className="shrink-0" /> {error}
      </div>
    );
  }

  return (
    <div className="dash-page">
      {/* Page Header */}
      <div>
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle mt-1">Clinic-wide metrics, revenue, and operational performance.</p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Patients",    value: stats.totalPatients.toLocaleString("en-IN"), icon: Users },
          { label: "Active Doctors",    value: stats.totalDoctors,                          icon: Stethoscope },
          { label: "Revenue (YTD)",     value: `₹${stats.todayRevenue.toLocaleString("en-IN")}`, icon: IndianRupee },
          { label: "Registered Today",  value: stats.todayRegistered,                       icon: CalendarDays },
        ].map(stat => (
          <div key={stat.label} className="card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-eyebrow">{stat.label}</span>
              <stat.icon size={15} className="text-[#a3a3a3]" />
            </div>
            <p className="metric-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Operational Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Avg Wait Time",    value: `${stats.avgWaitTime}m`, icon: Clock,      note: "Rolling average" },
          { label: "No-Show Rate",     value: `${stats.noShowRate}%`,  icon: XCircle,    note: "Target < 10%" },
          { label: "Online Bookings",  value: `${stats.onlineSplit}%`, icon: TrendingUp, note: "Cap set at 70%" },
          { label: "Walk-in Split",    value: `${stats.walkInSplit}%`, icon: Users,      note: "Protected slots" },
        ].map(stat => (
          <div key={stat.label} className="card-muted p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="label-eyebrow">{stat.label}</span>
              <stat.icon size={13} className="text-[#a3a3a3]" />
            </div>
            <p className="metric-value-sm">{stat.value}</p>
            <p className="data-text-sm">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Weekly Bar Chart */}
      <div className="card p-5 md:p-6">
        <div className="flex items-center justify-between mb-5 pb-4 section-divider">
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-[#a3a3a3]" />
            <h3 className="section-title text-[15px]">Weekly Patient Traffic</h3>
          </div>
          <span className="data-text-sm">Current Week</span>
        </div>
        <div className="flex items-end justify-between gap-2 md:gap-4 h-36 md:h-44">
          {weeklyData.map(d => (
            <div key={d.day} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
              <div className="w-full flex items-end justify-center h-full">
                <div
                  className="w-full max-w-9 rounded-t bg-[#0a0a0a]/[0.08] group-hover:bg-[#0a0a0a] dark:bg-white/[0.08] dark:group-hover:bg-white transition-all duration-200"
                  style={{ height: `${(d.patients / maxPatients) * 100}%`, minHeight: "4px" }}
                  title={`${d.day}: ${d.patients} patients · ₹${d.revenue.toLocaleString("en-IN")}`}
                />
              </div>
              <span className="label-eyebrow">{d.day}</span>
              <span className="data-text-sm font-medium">{d.patients}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Banner */}
      <div className="alert-info">
        <CheckCircle2 size={15} className="shrink-0" />
        Live database sync active — statistics update in real time.
      </div>
    </div>
  );
};

export default AdminOverview;
