import React, { createContext, useContext, useReducer, ReactNode, useState, useEffect } from 'react';
import * as mockData from '../data/mockData';

// ==================== TYPE DEFINITIONS ====================

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  designation: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
  salary: number;
  grossSalary: number;
  deductions: number;
  netPay: number;
  avatar: string;
  location: string;
  manager: string;
  employmentType: string;
  gender: string;
  dob: string;
  address: string;
  emergencyContact: string;
  performance: number;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  employees: number;
  budget: number;
  color: string;
  description?: string;
  growth?: number;
}

export interface LeaveRequest {
  id: string;
  employee: string;
  avatar: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  employeeId?: string;
  reason?: string;
  managerApproval?: 'Pending' | 'Approved' | 'Rejected';
  hrApproval?: 'Pending' | 'Approved' | 'Rejected';
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  date: string;
  avatar: string | null;
  initials: string;
  location?: string;
  rating?: number;
}

export interface RecruitmentPipeline {
  [key: string]: Candidate[];
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netPay: number;
  status: 'Pending' | 'Processed' | 'Paid';
}

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: 'Morning' | 'Afternoon' | 'Night';
}

export interface ShiftSwapRequest {
  id: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  requestedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Holiday' | 'Weekend';
  entryTime?: string;
  exitTime?: string;
}

export interface AppState {
  employees: Employee[];
  departments: Department[];
  leaveRequests: LeaveRequest[];
  recruitmentPipeline: RecruitmentPipeline;
  payroll: PayrollEntry[];
  shifts: ShiftSchedule[];
  shiftSwapRequests: ShiftSwapRequest[];
  attendance: AttendanceRecord[];
}

// ==================== ACTION TYPES ====================

export type AppAction =
  // Employee actions
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  
  // Department actions
  | { type: 'ADD_DEPARTMENT'; payload: Department }
  | { type: 'UPDATE_DEPARTMENT'; payload: Department }
  | { type: 'DELETE_DEPARTMENT'; payload: string }
  | { type: 'SET_DEPARTMENTS'; payload: Department[] }
  
  // Leave request actions
  | { type: 'ADD_LEAVE'; payload: LeaveRequest }
  | { type: 'UPDATE_LEAVE_STATUS'; payload: { id: string; status: LeaveRequest['status'] } }
  | { type: 'DELETE_LEAVE'; payload: string }
  | { type: 'APPROVE_LEAVE'; payload: string }
  | { type: 'REJECT_LEAVE'; payload: string }
  | { type: 'SET_LEAVE_REQUESTS'; payload: LeaveRequest[] }
  
  // Recruitment actions
  | { type: 'ADD_CANDIDATE'; payload: { stage: string; candidate: Candidate } }
  | { type: 'MOVE_CANDIDATE'; payload: { candidateId: string; fromStage: string; toStage: string } }
  | { type: 'UPDATE_CANDIDATE'; payload: { candidateId: string; stage: string; candidate: Candidate } }
  | { type: 'DELETE_CANDIDATE'; payload: { candidateId: string; stage: string } }
  | { type: 'SET_RECRUITMENT_PIPELINE'; payload: RecruitmentPipeline }
  
  // Payroll actions
  | { type: 'ADD_PAYROLL_ENTRY'; payload: PayrollEntry }
  | { type: 'UPDATE_PAYROLL_ENTRY'; payload: PayrollEntry }
  | { type: 'DELETE_PAYROLL_ENTRY'; payload: string }
  | { type: 'SET_PAYROLL'; payload: PayrollEntry[] }
  
  // Shift schedule actions
  | { type: 'ADD_SHIFT'; payload: ShiftSchedule }
  | { type: 'UPDATE_SHIFT'; payload: ShiftSchedule }
  | { type: 'DELETE_SHIFT'; payload: string }
  | { type: 'SET_SHIFTS'; payload: ShiftSchedule[] }
  
  // Shift swap request actions
  | { type: 'CREATE_SWAP_REQUEST'; payload: ShiftSwapRequest }
  | { type: 'APPROVE_SWAP_REQUEST'; payload: string }
  | { type: 'REJECT_SWAP_REQUEST'; payload: string }
  | { type: 'DELETE_SWAP_REQUEST'; payload: string }
  | { type: 'SET_SWAP_REQUESTS'; payload: ShiftSwapRequest[] }
  
  // Attendance actions
  | { type: 'MARK_ATTENDANCE'; payload: AttendanceRecord }
  | { type: 'UPDATE_ATTENDANCE'; payload: AttendanceRecord }
  | { type: 'DELETE_ATTENDANCE'; payload: string }
  | { type: 'SET_ATTENDANCE'; payload: AttendanceRecord[] };

// ==================== REDUCER FUNCTION ====================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // ===== EMPLOYEE ACTIONS =====
    case 'ADD_EMPLOYEE': {
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
    }
    case 'UPDATE_EMPLOYEE': {
      return {
        ...state,
        employees: state.employees.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
    }
    case 'DELETE_EMPLOYEE': {
      return {
        ...state,
        employees: state.employees.filter((emp) => emp.id !== action.payload),
      };
    }
    case 'SET_EMPLOYEES': {
      return {
        ...state,
        employees: action.payload,
      };
    }

    // ===== DEPARTMENT ACTIONS =====
    case 'ADD_DEPARTMENT': {
      return {
        ...state,
        departments: [...state.departments, action.payload],
      };
    }
    case 'UPDATE_DEPARTMENT': {
      return {
        ...state,
        departments: state.departments.map((dept) =>
          dept.id === action.payload.id ? action.payload : dept
        ),
      };
    }
    case 'DELETE_DEPARTMENT': {
      return {
        ...state,
        departments: state.departments.filter((dept) => dept.id !== action.payload),
      };
    }
    case 'SET_DEPARTMENTS': {
      return {
        ...state,
        departments: action.payload,
      };
    }

    // ===== LEAVE REQUEST ACTIONS =====
    case 'ADD_LEAVE': {
      return {
        ...state,
        leaveRequests: [...state.leaveRequests, action.payload],
      };
    }
    case 'UPDATE_LEAVE_STATUS': {
      return {
        ...state,
        leaveRequests: state.leaveRequests.map((leave) =>
          leave.id === action.payload.id
            ? { ...leave, status: action.payload.status }
            : leave
        ),
      };
    }
    case 'DELETE_LEAVE': {
      return {
        ...state,
        leaveRequests: state.leaveRequests.filter((leave) => leave.id !== action.payload),
      };
    }
    case 'APPROVE_LEAVE': {
      return {
        ...state,
        leaveRequests: state.leaveRequests.map((leave) =>
          leave.id === action.payload ? { ...leave, status: 'Approved' } : leave
        ),
      };
    }
    case 'REJECT_LEAVE': {
      return {
        ...state,
        leaveRequests: state.leaveRequests.map((leave) =>
          leave.id === action.payload ? { ...leave, status: 'Rejected' } : leave
        ),
      };
    }
    case 'SET_LEAVE_REQUESTS': {
      return {
        ...state,
        leaveRequests: action.payload,
      };
    }

    // ===== RECRUITMENT ACTIONS =====
    case 'ADD_CANDIDATE': {
      return {
        ...state,
        recruitmentPipeline: {
          ...state.recruitmentPipeline,
          [action.payload.stage]: [
            ...(state.recruitmentPipeline[action.payload.stage] || []),
            action.payload.candidate,
          ],
        },
      };
    }
    case 'MOVE_CANDIDATE': {
      const { candidateId, fromStage, toStage } = action.payload;
      const fromCandidates = state.recruitmentPipeline[fromStage] || [];
      const candidate = fromCandidates.find((c) => c.id === candidateId);
      
      if (!candidate) return state;

      return {
        ...state,
        recruitmentPipeline: {
          ...state.recruitmentPipeline,
          [fromStage]: fromCandidates.filter((c) => c.id !== candidateId),
          [toStage]: [...(state.recruitmentPipeline[toStage] || []), candidate],
        },
      };
    }
    case 'UPDATE_CANDIDATE': {
      const { candidateId, stage, candidate } = action.payload;
      return {
        ...state,
        recruitmentPipeline: {
          ...state.recruitmentPipeline,
          [stage]: (state.recruitmentPipeline[stage] || []).map((c) =>
            c.id === candidateId ? candidate : c
          ),
        },
      };
    }
    case 'DELETE_CANDIDATE': {
      const { candidateId, stage } = action.payload;
      return {
        ...state,
        recruitmentPipeline: {
          ...state.recruitmentPipeline,
          [stage]: (state.recruitmentPipeline[stage] || []).filter((c) => c.id !== candidateId),
        },
      };
    }
    case 'SET_RECRUITMENT_PIPELINE': {
      return {
        ...state,
        recruitmentPipeline: action.payload,
      };
    }

    // ===== PAYROLL ACTIONS =====
    case 'ADD_PAYROLL_ENTRY': {
      return {
        ...state,
        payroll: [...state.payroll, action.payload],
      };
    }
    case 'UPDATE_PAYROLL_ENTRY': {
      return {
        ...state,
        payroll: state.payroll.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    }
    case 'DELETE_PAYROLL_ENTRY': {
      return {
        ...state,
        payroll: state.payroll.filter((entry) => entry.id !== action.payload),
      };
    }
    case 'SET_PAYROLL': {
      return {
        ...state,
        payroll: action.payload,
      };
    }

    // ===== SHIFT SCHEDULE ACTIONS =====
    case 'ADD_SHIFT': {
      return {
        ...state,
        shifts: [...state.shifts, action.payload],
      };
    }
    case 'UPDATE_SHIFT': {
      return {
        ...state,
        shifts: state.shifts.map((shift) =>
          shift.id === action.payload.id ? action.payload : shift
        ),
      };
    }
    case 'DELETE_SHIFT': {
      return {
        ...state,
        shifts: state.shifts.filter((shift) => shift.id !== action.payload),
      };
    }
    case 'SET_SHIFTS': {
      return {
        ...state,
        shifts: action.payload,
      };
    }

    // ===== SHIFT SWAP REQUEST ACTIONS =====
    case 'CREATE_SWAP_REQUEST': {
      return {
        ...state,
        shiftSwapRequests: [...state.shiftSwapRequests, action.payload],
      };
    }
    case 'APPROVE_SWAP_REQUEST': {
      return {
        ...state,
        shiftSwapRequests: state.shiftSwapRequests.map((req) =>
          req.id === action.payload ? { ...req, status: 'Approved' } : req
        ),
      };
    }
    case 'REJECT_SWAP_REQUEST': {
      return {
        ...state,
        shiftSwapRequests: state.shiftSwapRequests.map((req) =>
          req.id === action.payload ? { ...req, status: 'Rejected' } : req
        ),
      };
    }
    case 'DELETE_SWAP_REQUEST': {
      return {
        ...state,
        shiftSwapRequests: state.shiftSwapRequests.filter((req) => req.id !== action.payload),
      };
    }
    case 'SET_SWAP_REQUESTS': {
      return {
        ...state,
        shiftSwapRequests: action.payload,
      };
    }

    // ===== ATTENDANCE ACTIONS =====
    case 'MARK_ATTENDANCE': {
      // Check if record exists for this employee and date
      const exists = state.attendance.find(
        (rec) =>
          rec.employeeId === action.payload.employeeId && rec.date === action.payload.date
      );
      
      if (exists) {
        return {
          ...state,
          attendance: state.attendance.map((rec) =>
            rec.id === exists.id ? action.payload : rec
          ),
        };
      }
      
      return {
        ...state,
        attendance: [...state.attendance, action.payload],
      };
    }
    case 'UPDATE_ATTENDANCE': {
      return {
        ...state,
        attendance: state.attendance.map((rec) =>
          rec.id === action.payload.id ? action.payload : rec
        ),
      };
    }
    case 'DELETE_ATTENDANCE': {
      return {
        ...state,
        attendance: state.attendance.filter((rec) => rec.id !== action.payload),
      };
    }
    case 'SET_ATTENDANCE': {
      return {
        ...state,
        attendance: action.payload,
      };
    }

    default:
      return state;
  }
}

// ==================== INITIAL STATE ====================

const getInitialState = (): AppState => ({
  employees: mockData.employees,
  departments: mockData.departments,
  leaveRequests: mockData.leaveRequests,
  recruitmentPipeline: mockData.recruitmentPipeline,
  payroll: [],
  shifts: [],
  shiftSwapRequests: [],
  attendance: [],
});

// ==================== CONTEXT & PROVIDER ====================

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount (optional persistence)
  useEffect(() => {
    setMounted(true);
    // Uncomment below to enable localStorage persistence
    // const saved = localStorage.getItem('appState');
    // if (saved) {
    //   try {
    //     const parsed = JSON.parse(saved);
    //     Object.keys(parsed).forEach((key) => {
    //       dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsed[key] } as AppAction);
    //     });
    //   } catch (error) {
    //     console.error('Failed to load state from localStorage:', error);
    //   }
    // }
  }, []);

  // Save to localStorage on state change (optional persistence)
  useEffect(() => {
    if (mounted) {
      // Uncomment below to enable localStorage persistence
      // localStorage.setItem('appState', JSON.stringify(state));
    }
  }, [state, mounted]);

  const value: AppContextType = { state, dispatch };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ==================== HOOKS ====================

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Helper hooks for specific modules
export const useEmployees = () => {
  const { state, dispatch } = useAppContext();
  return {
    employees: state.employees,
    addEmployee: (employee: Employee) => dispatch({ type: 'ADD_EMPLOYEE', payload: employee }),
    updateEmployee: (employee: Employee) => dispatch({ type: 'UPDATE_EMPLOYEE', payload: employee }),
    deleteEmployee: (id: string) => dispatch({ type: 'DELETE_EMPLOYEE', payload: id }),
  };
};

export const useDepartments = () => {
  const { state, dispatch } = useAppContext();
  return {
    departments: state.departments,
    addDepartment: (department: Department) => dispatch({ type: 'ADD_DEPARTMENT', payload: department }),
    updateDepartment: (department: Department) => dispatch({ type: 'UPDATE_DEPARTMENT', payload: department }),
    deleteDepartment: (id: string) => dispatch({ type: 'DELETE_DEPARTMENT', payload: id }),
  };
};

export const useLeaveRequests = () => {
  const { state, dispatch } = useAppContext();
  return {
    leaveRequests: state.leaveRequests,
    addLeave: (leave: LeaveRequest) => dispatch({ type: 'ADD_LEAVE', payload: leave }),
    updateLeaveStatus: (id: string, status: LeaveRequest['status']) =>
      dispatch({ type: 'UPDATE_LEAVE_STATUS', payload: { id, status } }),
    deleteLeave: (id: string) => dispatch({ type: 'DELETE_LEAVE', payload: id }),
    approveLeave: (id: string) => dispatch({ type: 'APPROVE_LEAVE', payload: id }),
    rejectLeave: (id: string) => dispatch({ type: 'REJECT_LEAVE', payload: id }),
  };
};

export const useRecruitment = () => {
  const { state, dispatch } = useAppContext();
  return {
    recruitmentPipeline: state.recruitmentPipeline,
    addCandidate: (stage: string, candidate: Candidate) =>
      dispatch({ type: 'ADD_CANDIDATE', payload: { stage, candidate } }),
    moveCandidate: (candidateId: string, fromStage: string, toStage: string) =>
      dispatch({ type: 'MOVE_CANDIDATE', payload: { candidateId, fromStage, toStage } }),
    updateCandidate: (candidateId: string, stage: string, candidate: Candidate) =>
      dispatch({ type: 'UPDATE_CANDIDATE', payload: { candidateId, stage, candidate } }),
    deleteCandidate: (candidateId: string, stage: string) =>
      dispatch({ type: 'DELETE_CANDIDATE', payload: { candidateId, stage } }),
  };
};

export const usePayroll = () => {
  const { state, dispatch } = useAppContext();
  return {
    payroll: state.payroll,
    addPayrollEntry: (entry: PayrollEntry) => dispatch({ type: 'ADD_PAYROLL_ENTRY', payload: entry }),
    updatePayrollEntry: (entry: PayrollEntry) => dispatch({ type: 'UPDATE_PAYROLL_ENTRY', payload: entry }),
    deletePayrollEntry: (id: string) => dispatch({ type: 'DELETE_PAYROLL_ENTRY', payload: id }),
  };
};

export const useShifts = () => {
  const { state, dispatch } = useAppContext();
  return {
    shifts: state.shifts,
    shiftSwapRequests: state.shiftSwapRequests,
    addShift: (shift: ShiftSchedule) => dispatch({ type: 'ADD_SHIFT', payload: shift }),
    updateShift: (shift: ShiftSchedule) => dispatch({ type: 'UPDATE_SHIFT', payload: shift }),
    deleteShift: (id: string) => dispatch({ type: 'DELETE_SHIFT', payload: id }),
    createSwapRequest: (request: ShiftSwapRequest) =>
      dispatch({ type: 'CREATE_SWAP_REQUEST', payload: request }),
    approveSwapRequest: (id: string) => dispatch({ type: 'APPROVE_SWAP_REQUEST', payload: id }),
    rejectSwapRequest: (id: string) => dispatch({ type: 'REJECT_SWAP_REQUEST', payload: id }),
    deleteSwapRequest: (id: string) => dispatch({ type: 'DELETE_SWAP_REQUEST', payload: id }),
  };
};

export const useAttendance = () => {
  const { state, dispatch } = useAppContext();
  return {
    attendance: state.attendance,
    markAttendance: (record: AttendanceRecord) => dispatch({ type: 'MARK_ATTENDANCE', payload: record }),
    updateAttendance: (record: AttendanceRecord) => dispatch({ type: 'UPDATE_ATTENDANCE', payload: record }),
    deleteAttendance: (id: string) => dispatch({ type: 'DELETE_ATTENDANCE', payload: id }),
  };
};
