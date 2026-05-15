import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, HelpCircle, FileText, Users, DollarSign, Calendar, Award, TrendingUp, Clock, ThumbsUp, ThumbsDown, Download, Trash2, Search, Filter, ExternalLink, Globe, Book, BarChart3, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { getCurrentUserRole, UserRole } from "../config/roles";

type Language = "en" | "es" | "hi";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  actions?: ActionButton[];
  followUps?: string[];
  feedback?: "positive" | "negative" | null;
}

interface ActionButton {
  label: string;
  path: string;
  icon?: any;
}

interface FAQ {
  question: string;
  answer: string;
  icon: any;
  category: string;
  path?: string;
  relatedQuestions?: string[];
}

// Translation dictionaries
const TRANSLATIONS: Record<Language, any> = {
  en: {
    greeting: (role: string, time: string) => `${time}, ${role}! 👋\n\nI'm your EMS assistant. I can help you with various tasks.`,
    placeholder: "Type your question or use /help...",
    quickActions: "Quick Actions",
    browseTopics: "Browse All Topics",
    clearChat: "Clear Chat",
    exportChat: "Export Chat",
    typing: "Bot is typing",
    helpfulQuestion: "Was this helpful?",
    tutorial: "Start Tutorial",
    search: "Search FAQs...",
    allCategories: "All Categories",
  },
  es: {
    greeting: (role: string, time: string) => `${time}, ${role}! 👋\n\nSoy tu asistente de EMS. Puedo ayudarte con varias tareas.`,
    placeholder: "Escribe tu pregunta o usa /help...",
    quickActions: "Acciones Rápidas",
    browseTopics: "Ver Todos los Temas",
    clearChat: "Limpiar Chat",
    exportChat: "Exportar Chat",
    typing: "Bot está escribiendo",
    helpfulQuestion: "¿Fue útil?",
    tutorial: "Iniciar Tutorial",
    search: "Buscar preguntas...",
    allCategories: "Todas las Categorías",
  },
  hi: {
    greeting: (role: string, time: string) => `${time}, ${role}! 👋\n\nमैं आपका EMS सहायक हूं। मैं विभिन्न कार्यों में आपकी सहायता कर सकता हूं।`,
    placeholder: "अपना प्रश्न टाइप करें या /help का उपयोग करें...",
    quickActions: "त्वरित क्रियाएं",
    browseTopics: "सभी विषय देखें",
    clearChat: "चैट साफ़ करें",
    exportChat: "चैट निर्यात करें",
    typing: "बॉट टाइप कर रहा है",
    helpfulQuestion: "क्या यह मददगार था?",
    tutorial: "ट्यूटोरियल शुरू करें",
    search: "प्रश्न खोजें...",
    allCategories: "सभी श्रेणियां",
  },
};

// Role-based FAQs and information
const ROLE_FAQS: Record<UserRole, FAQ[]> = {
  [UserRole.EMPLOYEE]: [
    {
      question: "How do I check my attendance?",
      answer: "Go to the **Attendance** page from the sidebar. You can view your attendance history, clock in/out times, and monthly summary.\n\n**Quick Stats**: Track your presence, late arrivals, and leave balance.",
      icon: Clock,
      category: "Attendance",
      path: "/attendance",
      relatedQuestions: ["Request leave", "View my schedule"],
    },
    {
      question: "How do I request leave?",
      answer: "Navigate to **Leave Management** page, click 'Request Leave', select the date range and leave type, then submit. Your manager will review the request.\n\n**Tip**: Check your leave balance before requesting.",
      icon: Calendar,
      category: "Leave",
      path: "/leave",
      relatedQuestions: ["Check my attendance", "View leave balance"],
    },
    {
      question: "Where can I view my payslip?",
      answer: "Visit the **Payroll** page to view and download your monthly payslips. You can see salary breakdown, deductions, and payment history.\n\n**Available**: PDF download for tax filing.",
      icon: DollarSign,
      category: "Payroll",
      path: "/payroll",
      relatedQuestions: ["Salary breakdown", "Tax information"],
    },
    {
      question: "How do I update my profile?",
      answer: "Click on your **profile icon** in the top right corner and select 'Profile'. You can update personal information, contact details, and emergency contacts.\n\n**Important**: Keep your contact details current.",
      icon: User,
      category: "Profile",
      path: "/profile",
      relatedQuestions: ["Change password", "Update contact info"],
    },
    {
      question: "How do I view my performance rating?",
      answer: "Go to the **Performance** page to see your current rating, feedback from managers, and performance history. Track goals and achievements.\n\n**Leaderboard**: Check your ranking among peers.",
      icon: TrendingUp,
      category: "Performance",
      path: "/performance",
      relatedQuestions: ["View goals", "Performance leaderboard"],
    },
    {
      question: "What are the wellness benefits?",
      answer: "Check the **Wellness Report** page to see available wellness programs, health metrics tracking, and wellness activities. Participate in challenges and earn rewards!\n\n**Rewards**: Complete challenges for points.",
      icon: Award,
      category: "Wellness",
      path: "/wellness",
      relatedQuestions: ["Wellness challenges", "Health tracking"],
    },
    {
      question: "How do I see my stats?",
      answer: "Use the command **/stats** to see your quick stats including attendance, leaves taken, performance rating, and pending tasks.\n\n**Dashboard**: Visit your dashboard for detailed analytics.",
      icon: BarChart3,
      category: "Stats",
      path: "/",
      relatedQuestions: ["Check attendance", "View performance"],
    },
  ],
  [UserRole.HR]: [
    {
      question: "How do I manage employee records?",
      answer: "Go to the **Employees** page to view, edit, and manage all employee records. Add new employees, update information, and track employee status.\n\n**Bulk Actions**: Import/export employee data via CSV.",
      icon: Users,
      category: "Employee Management",
      path: "/employees",
      relatedQuestions: ["Add new employee", "Export employee data"],
    },
    {
      question: "How do I process payroll?",
      answer: "Navigate to the **Payroll** page to process monthly payroll, generate payslips, manage salary components, and track payment history.\n\n**Automation**: Set up automated payroll processing schedules.",
      icon: DollarSign,
      category: "Payroll",
      path: "/payroll",
      relatedQuestions: ["Generate payslips", "Payroll settings"],
    },
    {
      question: "How do I approve leave requests?",
      answer: "Visit the **Leave Management** page to view pending leave requests. Approve or reject requests and add comments. Employees receive instant notifications.\n\n**Filters**: Sort by department, date, or leave type.",
      icon: Calendar,
      category: "Leave Management",
      path: "/leave",
      relatedQuestions: ["View leave balance", "Leave policies"],
    },
    {
      question: "How do I track attendance?",
      answer: "Access the **Attendance** page to monitor employee attendance, view late arrivals, absences, and generate reports for any time period.\n\n**Reports**: Export attendance data for analysis.",
      icon: Clock,
      category: "Attendance",
      path: "/attendance",
      relatedQuestions: ["Generate report", "Track late arrivals"],
    },
    {
      question: "How do I manage recruitment?",
      answer: "Go to the **Recruitment** page to post job openings, review applications, schedule interviews, and track candidates through the hiring pipeline.\n\n**ATS**: Full applicant tracking system integrated.",
      icon: Users,
      category: "Recruitment",
      path: "/recruitment",
      relatedQuestions: ["Post job opening", "Schedule interview"],
    },
    {
      question: "How do I conduct performance reviews?",
      answer: "Navigate to **Performance** page to initiate reviews, provide feedback, set goals, and track employee performance ratings.\n\n**360° Reviews**: Enable peer and self-assessments.",
      icon: TrendingUp,
      category: "Performance",
      path: "/performance",
      relatedQuestions: ["Set employee goals", "View performance trends"],
    },
    {
      question: "How do I manage departments?",
      answer: "Visit the **Departments** page to create, edit, and manage department structures, assign managers, and view department-wise analytics.\n\n**Org Chart**: Visual department hierarchy available.",
      icon: Users,
      category: "Departments",
      path: "/departments",
      relatedQuestions: ["Create department", "Assign manager"],
    },
    {
      question: "How do I view HR stats?",
      answer: "Use **/stats** command to see quick HR metrics including pending approvals, headcount, turnover rate, and recruitment pipeline.\n\n**Analytics**: Deep dive into HR metrics on Reports page.",
      icon: BarChart3,
      category: "Stats",
      path: "/reports",
      relatedQuestions: ["View reports", "Track metrics"],
    },
  ],
  [UserRole.ADMIN]: [
    {
      question: "How do I manage user roles and permissions?",
      answer: "As an admin, assign roles (**Admin**, **HR**, **Employee**) when creating or editing user accounts. Each role has specific permissions and access levels.\n\n**RBAC**: Fine-grained permission control available.",
      icon: Users,
      category: "User Management",
      path: "/employees",
      relatedQuestions: ["Add admin user", "Manage permissions"],
    },
    {
      question: "How do I view system reports?",
      answer: "Go to the **Reports** page to access comprehensive reports including headcount trends, payroll summaries, attendance analytics, and performance metrics.\n\n**Export**: Download reports in PDF, Excel, or CSV format.",
      icon: FileText,
      category: "Reports",
      path: "/reports",
      relatedQuestions: ["Export reports", "Schedule reports"],
    },
    {
      question: "How do I manage payroll settings?",
      answer: "Navigate to **Settings** > Payroll to configure salary components, tax rates, deductions, and payment schedules. Set up automated payroll processing.\n\n**Compliance**: Built-in tax calculation for multiple regions.",
      icon: DollarSign,
      category: "Settings",
      path: "/settings",
      relatedQuestions: ["Configure taxes", "Set up allowances"],
    },
    {
      question: "How do I approve increment requests?",
      answer: "Visit the **Increment Appraisal** page to review salary increment recommendations. Approve or reject increments and add comments for each employee.\n\n**Budget**: Track total increment impact on budget.",
      icon: TrendingUp,
      category: "Appraisal",
      path: "/increment",
      relatedQuestions: ["Set increment budget", "Performance-based increments"],
    },
    {
      question: "How do I manage departments?",
      answer: "Go to the **Departments** page to create new departments, assign managers, manage budgets, and track department-wise performance metrics.\n\n**Budgets**: Set and monitor department budgets.",
      icon: Users,
      category: "Departments",
      path: "/departments",
      relatedQuestions: ["Create department", "Set budget"],
    },
    {
      question: "How do I configure system settings?",
      answer: "Access the **Settings** page to configure global system settings, company information, working hours, holidays, and notification preferences.\n\n**Customization**: Brand the system with your company logo and colors.",
      icon: Award,
      category: "Settings",
      path: "/settings",
      relatedQuestions: ["Add holidays", "Configure notifications"],
    },
    {
      question: "How do I track employee wellness?",
      answer: "Visit the **Wellness Report** page to monitor team wellness metrics, identify at-risk employees, and view wellness program participation rates.\n\n**Insights**: AI-powered wellness recommendations.",
      icon: Award,
      category: "Wellness",
      path: "/wellness",
      relatedQuestions: ["View wellness trends", "Create wellness program"],
    },
    {
      question: "How do I manage training programs?",
      answer: "Navigate to the **Training** page to create training programs, assign courses to employees, track completion rates, and measure training effectiveness.\n\n**Certifications**: Issue completion certificates automatically.",
      icon: FileText,
      category: "Training",
      path: "/training",
      relatedQuestions: ["Create course", "Track completion"],
    },
    {
      question: "How do I view admin stats?",
      answer: "Use **/stats** to see system-wide metrics including total users, active sessions, system health, and key performance indicators.\n\n**Dashboard**: Admin dashboard shows real-time system status.",
      icon: BarChart3,
      category: "Stats",
      path: "/",
      relatedQuestions: ["System health", "User activity"],
    },
  ],
};

const QUICK_REPLIES: Record<UserRole, string[]> = {
  [UserRole.EMPLOYEE]: [
    "Check my attendance",
    "Request leave",
    "View payslip",
    "Performance rating",
    "/stats",
    "/help",
  ],
  [UserRole.HR]: [
    "Approve leaves",
    "Process payroll",
    "Track attendance",
    "Manage recruitment",
    "/stats",
    "/help",
  ],
  [UserRole.ADMIN]: [
    "View reports",
    "Approve increments",
    "System settings",
    "Manage departments",
    "/stats",
    "/help",
  ],
};

// Slash commands
const SLASH_COMMANDS: Record<string, { description: string; execute: (role: UserRole) => string }> = {
  "/help": {
    description: "Show all available commands and topics",
    execute: (role) => `**Available Commands:**\n\n/help - Show this help\n/clear - Clear chat history\n/stats - Show your quick stats\n/tutorial - Start interactive tutorial\n/export - Export chat history\n\n**Quick Tips:**\n• Type your question naturally\n• Use quick action buttons\n• Rate responses to help improve answers\n• Browse all topics for comprehensive list`,
  },
  "/stats": {
    description: "Show your quick statistics",
    execute: (role) => {
      if (role === UserRole.EMPLOYEE) {
        return `**Your Quick Stats** 📊\n\n✅ Attendance: 95% (This Month)\n🏖️ Leaves Taken: 3/20\n⭐ Performance Rating: 4.5/5\n🎯 Goals Completed: 8/10\n🔥 Current Streak: 15 days\n\nVisit your **Dashboard** for detailed analytics!`;
      } else if (role === UserRole.HR) {
        return `**HR Quick Stats** 📊\n\n👥 Total Employees: 247\n⏳ Pending Approvals: 12\n📝 Open Positions: 8\n📈 Avg Performance: 4.2/5\n🏖️ Leave Requests: 5 pending\n\nVisit **Reports** for detailed analytics!`;
      } else {
        return `**Admin System Stats** 📊\n\n👥 Total Users: 247\n🟢 Active Sessions: 142\n⚡ System Health: 99.8%\n📊 Database Size: 2.4 GB\n🔄 Last Backup: 2 hours ago\n💼 Departments: 15\n\nVisit **Dashboard** for system overview!`;
      }
    },
  },
  "/tutorial": {
    description: "Start interactive tutorial",
    execute: (role) => `**Welcome to EMS Tutorial!** 📚\n\nI'll guide you through the key features:\n\n**Step 1/5: Navigation**\nUse the sidebar to navigate between different modules. Each module has role-specific features.\n\n**Try asking**: "How do I navigate the dashboard?"\n\nType **/tutorial next** to continue or ask any question!`,
  },
  "/clear": {
    description: "Clear chat history",
    execute: () => "CLEAR_CHAT",
  },
  "/export": {
    description: "Export chat history",
    execute: () => "EXPORT_CHAT",
  },
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [language, setLanguage] = useState<Language>("en");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const userRole = getCurrentUserRole();
  const faqs = ROLE_FAQS[userRole] || [];
  const quickReplies = QUICK_REPLIES[userRole] || [];
  const t = TRANSLATIONS[language];

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`chatHistory_${userRole}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
  }, [userRole]);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatHistory_${userRole}`, JSON.stringify(messages));
    }
  }, [messages, userRole]);

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const greeting = getGreetingMessage();
      setMessages([
        {
          id: Date.now(),
          text: greeting,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } else if (!isOpen && messages.length > 0) {
      // Count unread messages from bot
      const lastUserMessageIndex = messages.map(m => m.sender).lastIndexOf("user");
      if (lastUserMessageIndex !== -1) {
        const unread = messages.slice(lastUserMessageIndex + 1).filter(m => m.sender === "bot").length;
        setUnreadCount(unread);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function getGreetingMessage(): string {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const roleText = userRole === UserRole.ADMIN ? "Admin" : userRole === UserRole.HR ? "HR" : "there";
    
    return t.greeting(roleText, timeGreeting) + `\n\n**Quick Commands:**\n• /help - View all commands\n• /stats - Your quick stats\n• /tutorial - Start tutorial\n\nHow can I assist you today?`;
  }

  function findAnswer(query: string): { answer: string; faq: FAQ | null } {
    const lowerQuery = query.toLowerCase();
    
    // Exact match
    const exactMatch = faqs.find(faq => 
      faq.question.toLowerCase() === lowerQuery
    );
    if (exactMatch) return { answer: exactMatch.answer, faq: exactMatch };

    // Keyword match
    const keywordMatch = faqs.find(faq => {
      const questionWords = faq.question.toLowerCase().split(' ');
      const queryWords = lowerQuery.split(' ');
      return queryWords.some(word => 
        questionWords.some(qWord => qWord.includes(word) || word.includes(qWord))
      );
    });
    if (keywordMatch) return { answer: keywordMatch.answer, faq: keywordMatch };

    // Category match
    const categoryMatch = faqs.find(faq =>
      lowerQuery.includes(faq.category.toLowerCase()) ||
      faq.category.toLowerCase().includes(lowerQuery)
    );
    if (categoryMatch) return { answer: categoryMatch.answer, faq: categoryMatch };

    return { 
      answer: `I'm not sure about that specific question. Here are some topics I can help with:\n\n${faqs.slice(0, 5).map((faq, i) => `• ${faq.question}`).join('\n')}\n\n**Tip:** Use /help to see all available commands!`,
      faq: null 
    };
  }

  function handleSendMessage(text?: string) {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setShowQuickReplies(false);

    // Check for slash commands
    if (messageText.startsWith("/")) {
      const command = messageText.split(" ")[0].toLowerCase();
      if (SLASH_COMMANDS[command]) {
        const result = SLASH_COMMANDS[command].execute(userRole);
        
        if (result === "CLEAR_CHAT") {
          setMessages([]);
          localStorage.removeItem(`chatHistory_${userRole}`);
          setTimeout(() => {
            const greeting = getGreetingMessage();
            setMessages([{
              id: Date.now(),
              text: greeting,
              sender: "bot",
              timestamp: new Date(),
            }]);
            setShowQuickReplies(true);
          }, 100);
          return;
        } else if (result === "EXPORT_CHAT") {
          exportChat();
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now(),
              text: "✅ Chat history exported successfully! Check your downloads folder.",
              sender: "bot",
              timestamp: new Date(),
            }]);
          }, 500);
          return;
        } else {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now(),
              text: result,
              sender: "bot",
              timestamp: new Date(),
            }]);
          }, 500);
          return;
        }
      }
    }

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const { answer, faq } = findAnswer(messageText);
      const botResponse: Message = {
        id: Date.now() + 1,
        text: answer,
        sender: "bot",
        timestamp: new Date(),
        actions: faq?.path ? [{ label: `Go to ${faq.category}`, path: faq.path, icon: ExternalLink }] : undefined,
        followUps: faq?.relatedQuestions?.slice(0, 3),
        feedback: null,
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1200);
  }

  function handleQuickReply(reply: string) {
    handleSendMessage(reply);
  }

  function toggleChat() {
    setIsOpen(!isOpen);
  }

  function handleFeedback(messageId: number, feedback: "positive" | "negative") {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
    
    // Show thank you message
    setTimeout(() => {
      const thankYou: Message = {
        id: Date.now(),
        text: feedback === "positive" 
          ? "Thank you for your feedback! 😊" 
          : "Sorry that wasn't helpful. Let me show you more options:\n\n" + faqs.slice(0, 3).map(f => `• ${f.question}`).join('\n'),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, thankYou]);
    }, 300);
  }

  function exportChat() {
    const chatText = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.sender === "user" ? "You" : "Bot"}: ${m.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMS-Chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleNavigate(path: string) {
    navigate(path);
    setIsOpen(false);
  }

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(faqs.map(f => f.category)))];

  // Filter FAQs by search and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Rich text formatting helper
  function formatText(text: string) {
    // Bold text with **text**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links (though we'll keep it simple for now)
    return { __html: formatted };
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
        }
        .chat-message {
          animation: slideUp 0.3s ease-out;
        }
        .chat-button-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 380,
            height: 600,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: 10,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={24} color="#fff" />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                  EMS Assistant
                </div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 500 }}>
                  {userRole === UserRole.ADMIN ? "Admin Support" : userRole === UserRole.HR ? "HR Support" : "Employee Support"}
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: 8,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
            >
              <X size={18} color="#fff" />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "20px 24px",
              overflowY: "auto",
              background: "var(--background)",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className="chat-message"
                style={{
                  marginBottom: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    background: message.sender === "user" 
                      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                      : "var(--card)",
                    color: message.sender === "user" ? "#fff" : "var(--foreground)",
                    padding: "12px 16px",
                    borderRadius: message.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    maxWidth: "80%",
                    border: message.sender === "bot" ? "1px solid var(--border)" : "none",
                    boxShadow: message.sender === "user" 
                      ? "0 2px 8px rgba(16, 185, 129, 0.3)"
                      : "0 2px 4px rgba(0,0,0,0.05)",
                    whiteSpace: "pre-line",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {message.text}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {/* Quick Replies */}
            {showQuickReplies && messages.length <= 1 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 700, 
                  color: "var(--muted-foreground)",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  Quick Actions
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quickReplies.slice(0, 4).map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(reply)}
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--foreground)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--secondary)";
                        e.currentTarget.style.borderColor = "#10B981";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--card)";
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Browse FAQs */}
            {messages.length > 1 && (
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => {
                    const faqList = faqs.map((faq, i) => `${i + 1}. ${faq.question}`).join('\n');
                    const botMessage: Message = {
                      id: Date.now(),
                      text: `Here are all the topics I can help with:\n\n${faqList}\n\nClick on any topic or type your question!`,
                      sender: "bot",
                      timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, botMessage]);
                  }}
                  style={{
                    background: "var(--secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--foreground)",
                    cursor: "pointer",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--secondary)";
                  }}
                >
                  <HelpCircle size={16} />
                  Browse All Topics
                </button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid var(--border)",
              background: "var(--card)",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 14,
                  color: "var(--foreground)",
                  outline: "none",
                  fontWeight: 500,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#10B981";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                style={{
                  background: inputValue.trim() 
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : "var(--secondary)",
                  border: "none",
                  borderRadius: 10,
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: inputValue.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  boxShadow: inputValue.trim() 
                    ? "0 2px 8px rgba(16, 185, 129, 0.3)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (inputValue.trim()) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = inputValue.trim()
                    ? "0 2px 8px rgba(16, 185, 129, 0.3)"
                    : "none";
                }}
              >
                <Send size={18} color={inputValue.trim() ? "#fff" : "var(--muted-foreground)"} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={!isOpen ? "chat-button-pulse" : ""}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          border: "none",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
          zIndex: 999,
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.4)";
        }}
      >
        {isOpen ? (
          <X size={24} color="#fff" />
        ) : (
          <MessageCircle size={24} color="#fff" />
        )}
      </button>
    </>
  );
}
