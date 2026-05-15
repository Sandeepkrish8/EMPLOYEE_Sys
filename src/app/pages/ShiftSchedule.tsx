import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Users,
  CheckSquare,
  Clock,
  ArrowLeftRight,
  MoreVertical,
  CalendarPlus,
  X,
  Search,
  Check,
  Calendar as CalendarIcon,
  Filter,
  BarChart2,
  FileText,
  AlertTriangle,
  Download,
  CheckCircle2,
  Info,
  CalendarDays,
  Activity,
  UserCheck,
  MoreVertical as MoreIcon
} from 'lucide-react';
import { employees as globalEmployees } from '../data/mockData';
import { useShifts } from '../context/AppContext';
import type { ShiftSchedule as ShiftScheduleType, ShiftSwapRequest } from '../context/AppContext';
import './ShiftSchedule.css';

interface Shift {
  type: 'Morning' | 'Evening' | 'Night' | 'Full Day';
  time: string;
  isOT?: boolean;
}

interface EmployeeSchedule {
  id: string;
  name: string;
  dept: string;
  avatar: string;
  shifts: { [key: string]: Shift | null };
}

export const ShiftSchedule: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [currentWeek, setCurrentWeek] = useState('Apr 6 - Apr 12, 2026');
  const [showExportModal, setShowExportModal] = useState(false);
  const [view, setView] = useState<'Week' | 'Month' | 'Day'>('Week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeBrush, setActiveBrush] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [swaps, setSwaps] = useState([
    { id: 'SW001', p1: 'Sarah J.', p1Init: 'SJ', p2: 'Marcus W.', p2Init: 'MW', reason: 'Doctor appointment', detail: 'Mon Apr 7 Morning ↔ Tue Apr 8 Evening', p1Color: 'linear-gradient(135deg, #059669, #047857)', p2Color: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
    { id: 'SW002', p1: 'Ravi K.', p1Init: 'RK', p2: 'Sneha P.', p2Init: 'SP', reason: 'Family event', detail: 'Wed Apr 9 Night ↔ Fri Apr 11 Night', p1Color: 'linear-gradient(135deg, #14B8A6, #0D9488)', p2Color: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
    { id: 'SW003', p1: 'James C.', p1Init: 'JC', p2: 'Emily R.', p2Init: 'ER', reason: 'Transport issues', detail: 'Thu Apr 10 Evening ↔ Fri Apr 11 Morning', p1Color: 'linear-gradient(135deg, #F59E0B, #D97706)', p2Color: 'linear-gradient(135deg, #EC4899, #DB2777)' },
  ]);
  const [fixingOT, setFixingOT] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const navigate = useNavigate();

  // Context hooks
  const { addShift, approveSwapRequest, rejectSwapRequest, createSwapRequest, updateShift, deleteShift } = useShifts();

  // Local overrides for the display schedule (key: empId_day)
  const [localShiftOverrides, setLocalShiftOverrides] = useState<Record<string, Shift | null>>({});
  const [editShiftTarget, setEditShiftTarget] = useState<{ empId: string; empName: string; day: string; shift: Shift } | null>(null);

  // Add shift modal form state
  const [shiftForm, setShiftForm] = useState({
    employeeSearch: '',
    shiftType: 'Morning' as 'Morning' | 'Afternoon' | 'Night',
    date: '2026-04-06',
    notes: '',
  });
  const [shiftFormError, setShiftFormError] = useState('');
  const [shiftSuccess, setShiftSuccess] = useState(false);

  const SHIFT_TIMES: Record<string, string> = {
    Morning: '06:00 – 14:00',
    Afternoon: '14:00 – 22:00',
    Night: '22:00 – 06:00',
  };

  const handleAssignShift = () => {
    if (!shiftForm.employeeSearch.trim()) { setShiftFormError('Please enter an employee name or ID.'); return; }
    if (!shiftForm.date) { setShiftFormError('Please select a date.'); return; }
    const matched = globalEmployees.find(
      (e) =>
        e.name.toLowerCase().includes(shiftForm.employeeSearch.toLowerCase()) ||
        e.id.toLowerCase() === shiftForm.employeeSearch.toLowerCase()
    );
    if (!matched) { setShiftFormError('No employee found matching that name/ID.'); return; }

    const newShift: ShiftScheduleType = {
      id: `SHIFT-${Date.now()}`,
      employeeId: matched.id,
      employeeName: matched.name,
      date: shiftForm.date,
      startTime: SHIFT_TIMES[shiftForm.shiftType].split(' – ')[0],
      endTime: SHIFT_TIMES[shiftForm.shiftType].split(' – ')[1],
      shiftType: shiftForm.shiftType,
    };
    addShift(newShift);
    setShiftSuccess(true);
    setTimeout(() => {
      setShiftSuccess(false);
      setShowAddModal(false);
      setShiftForm({ employeeSearch: '', shiftType: 'Morning', date: '2026-04-06', notes: '' });
      setShiftFormError('');
    }, 1200);
  };

  const handleSwapApprove = (swapId: string) => {
    approveSwapRequest(swapId);
    setSwaps((prev) => prev.filter((s) => s.id !== swapId));
  };

  const handleSwapReject = (swapId: string) => {
    rejectSwapRequest(swapId);
    setSwaps((prev) => prev.filter((s) => s.id !== swapId));
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const dates = useMemo(() => {
    const baseDate = new Date(2026, 3, 6); // Apr 6, 2026
    return days.map((_, i) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + (weekOffset * 7) + i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  }, [weekOffset]);

  // Generate dynamic schedule from global data
  const scheduleData = useMemo(() => {
    return globalEmployees.map(emp => ({
      id: emp.id,
      name: emp.name,
      dept: emp.department,
      initials: emp.name.split(' ').map(n => n[0]).join(''),
      avatar: emp.avatar,
      shifts: days.reduce((acc, day) => {
        // Randomly assign shifts for demo purposes
        const rand = Math.random();
        if (rand > 0.3) {
          const types: ('Morning' | 'Evening' | 'Night' | 'Full Day')[] = ['Morning', 'Evening', 'Night', 'Full Day'];
          const type = types[Math.floor(Math.random() * types.length)];
          const times = {
            'Morning': '06:00 – 14:00',
            'Evening': '14:00 – 22:00',
            'Night': '22:00 – 06:00',
            'Full Day': '09:00 – 18:00'
          };
          acc[day] = { type, time: times[type], isOT: Math.random() > 0.8 };
        }
        return acc;
      }, {} as any)
    }));
  }, []);

  const departments = ['All Departments', ...new Set(globalEmployees.map(e => e.department))];

  const filteredSchedule = useMemo(() => {
    if (selectedDept === 'All Departments') return scheduleData;
    return scheduleData.filter(s => s.dept === selectedDept);
  }, [selectedDept, scheduleData]);

  const handleExport = () => {
    setShowExportModal(true);
    setTimeout(() => {
      setShowExportModal(false);
    }, 1500);
  };

  const weekLabel = useMemo(() => {
    if (weekOffset === 0) return 'Apr 6 - Apr 12, 2026';
    if (weekOffset === 1) return 'Apr 13 - Apr 19, 2026';
    if (weekOffset === -1) return 'Mar 30 - Apr 5, 2026';
    return weekOffset > 0 ? `Next ${weekOffset} Weeks` : `Prev ${Math.abs(weekOffset)} Weeks`;
  }, [weekOffset]);

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>Shift & Schedule Manager</h2>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>Efficiently manage workforce rotations, overtime limits, and shift swap approvals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-bold rounded-xl border border-dashed transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800 active:scale-95"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
            <div className="flex items-center gap-2">
              <Download size={16} />
              {showExportModal ? 'Exporting...' : 'Export Schedule'}
            </div>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-lg shadow-emerald-600/20 transition-all hover:opacity-90 hover:-translate-y-1 active:scale-95"
            style={{ background: "linear-gradient(135deg, #059669, #0D9488)" }}>
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-bold">Add Shift</span>
          </button>
        </div>
      </div>

      {/* System Health / Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckSquare size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">Coverage Status</p>
            <p className="text-sm font-bold text-foreground">94.2% Optimal Coverage</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-widest">System Alerts</p>
            <p className="text-sm font-bold text-foreground">3 Understaffed Shifts</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 tracking-widest">Ongoing Swaps</p>
            <p className="text-sm font-bold text-foreground">8 Pending Reviews</p>
          </div>
        </div>
      </div>

      {/* Navigation & Controls */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl">
            <button 
              className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted-foreground hover:text-primary active:scale-90" 
              onClick={() => setWeekOffset(prev => prev - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold px-3 text-foreground min-w-[180px] text-center">{weekLabel}</span>
            <button 
              className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted-foreground hover:text-primary active:scale-90" 
              onClick={() => setWeekOffset(prev => prev + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button 
            className="px-4 py-2 text-sm font-bold text-primary bg-secondary border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors active:scale-95" 
            onClick={() => setWeekOffset(0)}
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              className="pl-9 pr-6 py-2 rounded-xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <div className="flex p-1 bg-secondary rounded-xl">
            {['Week', 'Month', 'Day'].map(v => (
              <button
                key={v}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === v ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setView(v as any)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900 group" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Total Employees</p>
              <p className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>248</p>
              <span className="text-[10px] font-bold text-emerald-600 mt-2 inline-block">↑ 4 from last week</span>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary transition-colors group-hover:bg-neutral-100 dark:group-hover:bg-zinc-800">
              <Users size={24} color="var(--primary)" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900 group" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Target Coverage</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold tracking-tight text-emerald-600 group-hover:scale-105 transition-transform">94.2%</p>
                <span className="text-[10px] font-extrabold text-muted-foreground">/ 90%</span>
              </div>
              <div className="w-28 h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <UserCheck size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900 group" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Total Overtime</p>
              <p className="text-3xl font-extrabold tracking-tight text-amber-600">142<span className="text-sm ml-1 font-bold">h</span></p>
              <span className="text-[10px] font-bold text-amber-600 mt-2 inline-block">↑ 12h vs last week</span>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 transition-colors group-hover:bg-amber-100">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900 group" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Pending Swaps</p>
              <p className="text-3xl font-extrabold tracking-tight text-teal-600 group-hover:scale-105 transition-transform">8</p>
              <button
                className="text-[10px] font-black text-teal-700 hover:text-teal-500 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer transition-colors"
                onClick={() => document.getElementById('swaps-panel')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Review Applications <ArrowLeftRight size={10} />
              </button>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-900/20 text-teal-600 transition-colors group-hover:bg-teal-100">
              <CalendarDays size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Shift Legend & Quick Assign Toolbar */}
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <Plus size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Quick Tool</p>
              <p className="text-sm font-bold text-foreground leading-none">Shift Painter</p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-border mx-2"></div>
          <div className="flex gap-3">
            {[
              { type: 'Morning', color: 'bg-emerald-500', label: 'MOR' },
              { type: 'Evening', color: 'bg-amber-500', label: 'EVE' },
              { type: 'Night', color: 'bg-violet-500', label: 'NGT' },
              { type: 'Full Day', color: 'bg-blue-500', label: 'FUL' },
            ].map(type => (
              <button 
                key={type.type} 
                className={`group flex flex-col items-center gap-1 p-1 hover:bg-secondary rounded-xl transition-all ${activeBrush === type.type ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}`}
                title={`Quick assign ${type.type} shift`}
                onClick={() => setActiveBrush(activeBrush === type.type ? null : type.type)}
              >
                <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center text-white text-[10px] font-black shadow-sm group-hover:scale-110 transition-transform`}>
                  {type.label}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none mb-1">Staffing Level</p>
            <p className="text-sm font-bold text-foreground leading-none">Optimal (24/25)</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-8 bg-white dark:bg-zinc-900">
        <div className="grid grid-cols-[240px_repeat(7,1fr)] bg-secondary/50 border-b border-border">
          <div className="px-6 py-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center">Employee</div>
          {days.map((day, i) => (
            <div key={day} className={`px-4 py-4 text-center border-l border-border flex flex-col justify-center ${day === 'Mon' ? 'bg-primary/5' : ''}`}>
              <span className={`text-xs font-extra-bold ${day === 'Mon' ? 'text-primary' : 'text-foreground'}`}>{day}</span>
              <span className="text-[10px] text-muted-foreground font-bold">{dates[i]}</span>
            </div>
          ))}
        </div>
        <div className="grid-body divide-y divide-border">
          {filteredSchedule.map(emp => (
            <div key={emp.id} className="grid grid-cols-[240px_repeat(7,1fr)] hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors h-[90px]">
              <div className="px-6 py-4 flex items-center gap-4 border-r border-border/50">
                <div className="relative flex-shrink-0">
                  <img src={emp.avatar} alt="" className="w-11 h-11 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-extrabold text-foreground leading-tight">{emp.name}</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tight mt-0.5">{emp.dept}</span>
                </div>
              </div>
              {days.map(day => {
                const overrideKey = `${emp.id}_${day}`;
                const shift = overrideKey in localShiftOverrides ? localShiftOverrides[overrideKey] : emp.shifts[day];
                return (
                  <div key={day} className="border-l border-border/50 p-1 flex items-stretch">
                    {shift ? (
                      <div className={`relative flex-1 rounded-xl p-2.5 flex flex-col justify-center text-left transition-all hover:scale-[1.02] cursor-pointer shadow-sm group ${shift.type === 'Morning' ? 'bg-secondary text-primary border-l-4 border-l-primary' :
                          shift.type === 'Evening' ? 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-l-4 border-l-[#F59E0B]' :
                            shift.type === 'Night' ? 'bg-violet-50 text-violet-700 border-l-4 border-l-violet-500' :
                              'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
                        }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase tracking-tight">{shift.type}</span>
                          {shift.isOT && <span className="text-[8px] bg-red-500 text-white px-1.5 rounded-full font-black animate-pulse">OT</span>}
                        </div>
                        <span className="text-[10px] font-bold opacity-80">{shift.time}</span>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditShiftTarget({ empId: emp.id, empName: emp.name, day, shift }); }}
                            className="p-0.5 rounded bg-white/80 hover:bg-white"
                            style={{ color: "var(--primary)", border: "1px solid var(--border)" }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setLocalShiftOverrides((prev) => ({ ...prev, [overrideKey]: null })); }}
                            className="p-0.5 rounded bg-white/80 hover:bg-red-50"
                            style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex-1 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/50 hover:border-primary transition-all cursor-pointer group"
                        onClick={() => setShowAddModal(true)}
                      >
                        <Plus size={14} className="group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100">Assign</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {/* Swap Requests */}
        <div id="swaps-panel" className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm flex flex-col h-full transition-all hover:shadow-md">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-card rounded-t-2xl">
            <div className="flex items-center gap-3">
              <ArrowLeftRight color="var(--primary)" size={18} />
              <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Shift Swap Requests</h3>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100">8 PENDING</span>
          </div>
          <div className="p-6 divide-y divide-border overflow-y-auto max-h-[400px]">
            {swaps.map(swap => (
              <div key={swap.id} className="py-4 first:pt-0 last:pb-0 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ background: swap.p1Color }}>{swap.p1Init}</div>
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ background: swap.p2Color }}>{swap.p2Init}</div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground">{swap.p1} ↔ {swap.p2}</span>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{swap.reason}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 bg-secondary text-foreground rounded-xl hover:bg-neutral-200 transition-colors active:scale-95"
                      title="Reject"
                      onClick={() => handleSwapReject(swap.id)}
                    >
                      <X size={14} />
                    </button>
                    <button
                      className="p-2 bg-primary text-white rounded-xl hover:opacity-90 shadow-sm transition-all shadow-primary/20 active:scale-95"
                      title="Approve"
                      onClick={() => handleSwapApprove(swap.id)}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
                <div className="bg-secondary/40 p-3 rounded-xl border border-secondary">
                  <p className="text-[11px] font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon size={12} className="text-muted-foreground" />
                    {swap.detail}
                  </p>
                </div>
              </div>
            ))}
            {swaps.length === 0 && (
              <div className="py-10 text-center text-muted-foreground font-bold text-sm">No pending requests</div>
            )}
          </div>
          <div className="px-6 py-4 mt-auto border-t border-border bg-card rounded-b-2xl">
            <button className="w-full py-2 text-xs font-bold text-primary hover:bg-secondary rounded-xl transition-colors active:scale-95" onClick={() => navigate('/reports', { state: { activeReport: 'Shift Swap Report' } })}>View All Swap Requests</button>
          </div>
        </div>

        {/* Overtime Summary */}
        <div id="overtime-panel" className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm flex flex-col h-full transition-all hover:shadow-md">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-card rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Clock color="#F59E0B" size={18} />
              <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Overtime Monitoring</h3>
            </div>
            <span className="px-2.5 py-1 bg-secondary text-primary text-[10px] font-bold rounded-full border border-primary/20">142 TOTAL HRS</span>
          </div>
          <div className="p-6 space-y-5 overflow-y-auto max-h-[400px]">
            {[
              { name: 'James Carter', hrs: 18, limit: 15, color: '#EF4444', avatar: 'JC' },
              { name: 'Ravi Kumar', hrs: 15, limit: 15, color: '#F59E0B', avatar: 'RK' },
              { name: 'Sarah Johnson', hrs: 11, limit: 15, color: 'var(--primary)', avatar: 'SJ' },
              { name: 'Robert Chen', hrs: 9, limit: 15, color: 'var(--primary)', avatar: 'RC' },
              { name: 'Yuki Tanaka', hrs: 8, limit: 15, color: 'var(--primary)', avatar: 'YT' },
            ].map(item => (
              <div key={item.name} className="group">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-primary">{item.avatar}</div>
                    <span className="text-xs font-bold text-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-black" style={{ color: item.color }}>{item.hrs}h <span className="text-[10px] font-medium text-muted-foreground ml-1">/ {item.limit}h</span></span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.hrs / 20) * 100}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 mt-auto">
            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600" />
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">3 employees exceed the 15hr limit</p>
              </div>
              <button 
                className="text-[11px] font-black text-amber-800 dark:text-amber-200 hover:underline active:scale-95 disabled:opacity-50"
                onClick={() => {
                  setFixingOT(true);
                  setTimeout(() => setFixingOT(false), 2000);
                }}
                disabled={fixingOT}
              >
                {fixingOT ? 'Fixing...' : 'Fix Now'}
              </button>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-card rounded-b-2xl">
            <button 
              className="w-full py-2 text-xs font-bold text-primary hover:bg-secondary rounded-xl transition-colors active:scale-95 disabled:opacity-50"
              onClick={() => {
                setGeneratingReport(true);
                setTimeout(() => {
                  setGeneratingReport(false);
                  navigate('/reports', { state: { activeReport: 'Overtime Monitoring' } });
                }, 1500);
              }}
              disabled={generatingReport}
            >
              {generatingReport ? 'Generating...' : 'Generate Overtime Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Shift Modal */}
      {editShiftTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={() => setEditShiftTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>Edit Shift</h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{editShiftTarget.empName} · {editShiftTarget.day}</p>
              </div>
              <button onClick={() => setEditShiftTarget(null)} className="p-2 rounded-xl" style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Shift Type</label>
                <select
                  className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  defaultValue={editShiftTarget.shift.type}
                  id="edit-shift-type"
                >
                  {(['Morning', 'Evening', 'Night', 'Full Day'] as const).map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <button onClick={() => setEditShiftTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ border: "1px solid var(--border)", color: "var(--foreground)", backgroundColor: "var(--background)" }}>Cancel</button>
              <button
                onClick={() => {
                  const sel = (document.getElementById("edit-shift-type") as HTMLSelectElement).value as Shift["type"];
                  const times: Record<string, string> = { Morning: "06:00 – 14:00", Evening: "14:00 – 22:00", Night: "22:00 – 06:00", "Full Day": "09:00 – 18:00" };
                  const overrideKey = `${editShiftTarget.empId}_${editShiftTarget.day}`;
                  setLocalShiftOverrides((prev) => ({ ...prev, [overrideKey]: { type: sel, time: times[sel], isOT: editShiftTarget.shift.isOT } }));
                  setEditShiftTarget(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarPlus size={22} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Assign New Shift</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {shiftFormError && (
                <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {shiftFormError}
                </div>
              )}
              {shiftSuccess && (
                <div className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <CheckCircle2 size={16} /> Shift assigned successfully!
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Select Employee</label>
                <div className="relative group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    placeholder="Search name or ID..."
                    value={shiftForm.employeeSearch}
                    onChange={(e) => { setShiftForm({ ...shiftForm, employeeSearch: e.target.value }); setShiftFormError(''); }}
                  />
                </div>
                {shiftForm.employeeSearch && (
                  <div className="rounded-xl border overflow-hidden max-h-32 overflow-y-auto" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
                    {globalEmployees.filter((e) => e.name.toLowerCase().includes(shiftForm.employeeSearch.toLowerCase())).slice(0, 4).map((emp) => (
                      <button key={emp.id} className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary transition-colors" style={{ color: "var(--foreground)" }} onClick={() => setShiftForm({ ...shiftForm, employeeSearch: emp.name })}>
                        <img src={emp.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-medium">{emp.name}</span>
                        <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)" }}>{emp.department}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Shift Type</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    value={shiftForm.shiftType}
                    onChange={(e) => setShiftForm({ ...shiftForm, shiftType: e.target.value as any })}
                  >
                    <option value="Morning">Morning (06:00 – 14:00)</option>
                    <option value="Afternoon">Afternoon (14:00 – 22:00)</option>
                    <option value="Night">Night (22:00 – 06:00)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Department Filter</label>
                  <select className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                    {departments.filter(d => d !== 'All Departments').map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Shift Date</label>
                <div className="relative group">
                  <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    value={shiftForm.date}
                    onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Notes (Optional)</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent resize-none"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  placeholder="Add any special instructions..."
                  value={shiftForm.notes}
                  onChange={(e) => setShiftForm({ ...shiftForm, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <button
                onClick={() => { setShowAddModal(false); setShiftFormError(''); setShiftSuccess(false); }}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-colors hover:bg-neutral-100 dark:hover:bg-zinc-800"
                style={{ color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignShift}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
              >
                Assign Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
