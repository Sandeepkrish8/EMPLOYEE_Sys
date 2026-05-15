import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, HelpCircle, FileText, Users, DollarSign, Calendar, Award, TrendingUp, Clock, ThumbsUp, ThumbsDown, Download, Trash2, Search, Filter, ExternalLink, Globe, Book, BarChart3, CheckCircle, User, Zap } from "lucide-react";
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
    placeholder: "Type /help for commands...",
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
    greeting: (role: string, time: string) => `${time}, ${role}! 👋\n\nSoy tu asistente de EMS.`,
    placeholder: "Escribe /help para comandos...",
    quickActions: "Acciones Rápidas",
    browseTopics: "Ver Todos",
    clearChat: "Limpiar",
    exportChat: "Exportar",
    typing: "Escribiendo",
    helpfulQuestion: "¿Útil?",
    tutorial: "Tutorial",
    search: "Buscar...",
    allCategories: "Todas",
  },
  hi: {
    greeting: (role: string, time: string) => `${time}, ${role}! 👋\n\nमैं आपका EMS सहायक हूं।`,
    placeholder: "कमांड के लिए /help टाइप करें...",
    quickActions: "त्वरित क्रियाएं",
    browseTopics: "सभी विषय",
    clearChat: "साफ़ करें",
    exportChat: "निर्यात",
    typing: "टाइप कर रहा है",
    helpfulQuestion: "मददगार?",
    tutorial: "ट्यूटोरियल",
    search: "खोजें...",
    allCategories: "सभी",
  },
};

// Role-based FAQs
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
      answer: "Navigate to **Leave Management** page, click 'Request Leave', select the date range and leave type, then submit.\n\n**Tip**: Check your leave balance before requesting.",
      icon: Calendar,
      category: "Leave",
      path: "/leave",
      relatedQuestions: ["Check attendance", "View leave balance"],
    },
    {
      question: "Where can I view my payslip?",
      answer: "Visit the **Payroll** page to view and download your monthly payslips.\n\n**Available**: PDF download for tax filing.",
      icon: DollarSign,
      category: "Payroll",
      path: "/payroll",
      relatedQuestions: ["Salary breakdown", "Tax information"],
    },
    {
      question: "How do I update my profile?",
      answer: "Click your **profile icon** in the top right, then select 'Profile'.\n\n**Important**: Keep contact details current.",
      icon: User,
      category: "Profile",
      path: "/profile",
      relatedQuestions: ["Change password", "Update contact"],
    },
    {
      question: "How do I view my performance rating?",
      answer: "Go to **Performance** page to see ratings, feedback, and history.\n\n**Leaderboard**: Check your ranking!",
      icon: TrendingUp,
      category: "Performance",
      path: "/performance",
      relatedQuestions: ["View goals", "Performance leaderboard"],
    },
    {
      question: "What are the wellness benefits?",
      answer: "Check **Wellness Report** for programs, health metrics, and challenges!\n\n**Rewards**: Complete challenges for points.",
      icon: Award,
      category: "Wellness",
      path: "/wellness",
      relatedQuestions: ["Wellness challenges", "Health tracking"],
    },
  ],
  [UserRole.HR]: [
    {
      question: "How do I manage employee records?",
      answer: "Go to **Employees** page to view, edit, and manage all records.\n\n**Bulk Actions**: Import/export via CSV.",
      icon: Users,
      category: "Employee Management",
      path: "/employees",
      relatedQuestions: ["Add employee", "Export data"],
    },
    {
      question: "How do I process payroll?",
      answer: "Navigate to **Payroll** to process monthly payroll and generate payslips.\n\n**Automation**: Set up automated schedules.",
      icon: DollarSign,
      category: "Payroll",
      path: "/payroll",
      relatedQuestions: ["Generate payslips", "Payroll settings"],
    },
    {
      question: "How do I approve leave requests?",
      answer: "Visit **Leave Management** to view pending requests and approve/reject.\n\n**Filters**: Sort by department, date, or type.",
      icon: Calendar,
      category: "Leave",
      path: "/leave",
      relatedQuestions: ["View balance", "Leave policies"],
    },
    {
      question: "How do I track attendance?",
      answer: "Access **Attendance** page to monitor employee attendance and generate reports.\n\n**Reports**: Export for analysis.",
      icon: Clock,
      category: "Attendance",
      path: "/attendance",
      relatedQuestions: ["Generate report", "Track late arrivals"],
    },
    {
      question: "How do I manage recruitment?",
      answer: "Go to **Recruitment** to post jobs, review applications, and track candidates.\n\n**ATS**: Full applicant tracking integrated.",
      icon: Users,
      category: "Recruitment",
      path: "/recruitment",
      relatedQuestions: ["Post job", "Schedule interview"],
    },
    {
      question: "How do I conduct performance reviews?",
      answer: "Navigate to **Performance** to initiate reviews and set goals.\n\n**360° Reviews**: Enable peer assessments.",
      icon: TrendingUp,
      category: "Performance",
      path: "/performance",
      relatedQuestions: ["Set goals", "View trends"],
    },
  ],
  [UserRole.ADMIN]: [
    {
      question: "How do I manage user roles?",
      answer: "Assign roles when creating/editing user accounts.\n\n**RBAC**: Fine-grained permission control.",
      icon: Users,
      category: "User Management",
      path: "/employees",
      relatedQuestions: ["Add admin", "Manage permissions"],
    },
    {
      question: "How do I view system reports?",
      answer: "Go to **Reports** for comprehensive analytics.\n\n**Export**: Download in PDF, Excel, CSV.",
      icon: FileText,
      category: "Reports",
      path: "/reports",
      relatedQuestions: ["Export reports", "Schedule reports"],
    },
    {
      question: "How do I approve increments?",
      answer: "Visit **Increment Appraisal** to review recommendations.\n\n**Budget**: Track impact on budget.",
      icon: TrendingUp,
      category: "Appraisal",
      path: "/increment",
      relatedQuestions: ["Set budget", "Performance increments"],
    },
    {
      question: "How do I configure system settings?",
      answer: "Access **Settings** for global configuration.\n\n**Customization**: Brand with your logo and colors.",
      icon: Award,
      category: "Settings",
      path: "/settings",
      relatedQuestions: ["Add holidays", "Configure notifications"],
    },
  ],
};

const QUICK_REPLIES: Record<UserRole, string[]> = {
  [UserRole.EMPLOYEE]: ["Check attendance", "Request leave", "View payslip", "/stats", "/help"],
  [UserRole.HR]: ["Approve leaves", "Process payroll", "Track attendance", "/stats", "/help"],
  [UserRole.ADMIN]: ["View reports", "Approve increments", "System settings", "/stats", "/help"],
};

// Slash commands
const SLASH_COMMANDS: Record<string, { description: string; execute: (role: UserRole) => string }> = {
  "/help": {
    description: "Show all commands",
    execute: () => `**Available Commands:**\n\n/help - Show this help\n/clear - Clear chat\n/stats - Your quick stats\n/tutorial - Start tutorial\n/export - Export chat\n\n**Tips:**\n• Type naturally\n• Use quick actions\n• Rate responses`,
  },
  "/stats": {
    description: "Show your statistics",
    execute: (role) => {
      if (role === UserRole.EMPLOYEE) {
        return `**Your Stats** 📊\n\n✅ Attendance: 95%\n🏖️ Leaves: 3/20\n⭐ Rating: 4.5/5\n🎯 Goals: 8/10\n🔥 Streak: 15 days`;
      } else if (role === UserRole.HR) {
        return `**HR Stats** 📊\n\n👥 Employees: 247\n⏳ Pending: 12\n📝 Open Positions: 8\n📈 Avg Performance: 4.2/5`;
      } else {
        return `**System Stats** 📊\n\n👥 Users: 247\n🟢 Active: 142\n⚡ Health: 99.8%\n📊 DB Size: 2.4 GB`;
      }
    },
  },
  "/tutorial": {
    description: "Start tutorial",
    execute: () => `**EMS Tutorial!** 📚\n\n**Step 1/5: Navigation**\nUse the sidebar to navigate modules.\n\nType **/tutorial next** to continue!`,
  },
  "/clear": {
    description: "Clear chat",
    execute: () => "CLEAR_CHAT",
  },
  "/export": {
    description: "Export chat",
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
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const userRole = getCurrentUserRole();
  const faqs = ROLE_FAQS[userRole] || [];
  const quickReplies = QUICK_REPLIES[userRole] || [];
  const t = TRANSLATIONS[language];

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem(`chatHistory_${userRole}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {}
    }
  }, [userRole]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatHistory_${userRole}`, JSON.stringify(messages));
    }
  }, [messages, userRole]);

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const greeting = getGreetingMessage();
      setMessages([{ id: Date.now(), text: greeting, sender: "bot", timestamp: new Date() }]);
    } else if (!isOpen && messages.length > 0) {
      const lastUserMessageIndex = messages.map(m => m.sender).lastIndexOf("user");
      if (lastUserMessageIndex !== -1) {
        const unread = messages.slice(lastUserMessageIndex + 1).filter(m => m.sender === "bot").length;
        setUnreadCount(unread);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  function getGreetingMessage(): string {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const roleText = userRole === UserRole.ADMIN ? "Admin" : userRole === UserRole.HR ? "HR" : "there";
    return t.greeting(roleText, timeGreeting) + `\n\n**Quick Commands:**\n• /help - All commands\n• /stats - Your stats\n• /tutorial - Start tutorial\n\nHow can I assist you?`;
  }

  function findAnswer(query: string): { answer: string; faq: FAQ | null } {
    const lowerQuery = query.toLowerCase();
    const exactMatch = faqs.find(faq => faq.question.toLowerCase() === lowerQuery);
    if (exactMatch) return { answer: exactMatch.answer, faq: exactMatch };

    const keywordMatch = faqs.find(faq => {
      const questionWords = faq.question.toLowerCase().split(' ');
      const queryWords = lowerQuery.split(' ');
      return queryWords.some(word => questionWords.some(qWord => qWord.includes(word) || word.includes(qWord)));
    });
    if (keywordMatch) return { answer: keywordMatch.answer, faq: keywordMatch };

    const categoryMatch = faqs.find(faq => lowerQuery.includes(faq.category.toLowerCase()));
    if (categoryMatch) return { answer: categoryMatch.answer, faq: categoryMatch };

    return { 
      answer: `Not sure about that. Try:\n\n${faqs.slice(0, 3).map(f => `• ${f.question}`).join('\n')}\n\n**Tip:** Use /help for commands!`,
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

    if (messageText.startsWith("/")) {
      const command = messageText.split(" ")[0].toLowerCase();
      if (SLASH_COMMANDS[command]) {
        const result = SLASH_COMMANDS[command].execute(userRole);
        
        if (result === "CLEAR_CHAT") {
          setMessages([]);
          localStorage.removeItem(`chatHistory_${userRole}`);
          setTimeout(() => {
            const greeting = getGreetingMessage();
            setMessages([{ id: Date.now(), text: greeting, sender: "bot", timestamp: new Date() }]);
            setShowQuickReplies(true);
          }, 100);
          return;
        } else if (result === "EXPORT_CHAT") {
          exportChat();
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now(),
              text: "✅ Chat exported! Check your downloads.",
              sender: "bot",
              timestamp: new Date(),
            }]);
          }, 500);
          return;
        } else {
          setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: result, sender: "bot", timestamp: new Date() }]);
          }, 500);
          return;
        }
      }
    }

    setIsTyping(true);
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

  function handleFeedback(messageId: number, feedback: "positive" | "negative") {
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, feedback } : msg));
    setTimeout(() => {
      const thankYou: Message = {
        id: Date.now(),
        text: feedback === "positive" ? "Thanks for feedback! 😊" : "Sorry! Try: " + faqs.slice(0, 2).map(f => f.question).join(", "),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, thankYou]);
    }, 300);
  }

  function exportChat() {
    const chatText = messages.map(m => `[${m.timestamp.toLocaleString()}] ${m.sender === "user" ? "You" : "Bot"}: ${m.text}`).join('\n\n');
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

  const categories = ["all", ...Array.from(new Set(faqs.map(f => f.category)))];
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === "" || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } }
        @keyframes dotPulse { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
        .chat-message { animation: slideUp 0.3s ease-out; }
        .chat-button-pulse { animation: pulse 2s infinite; }
      `}</style>

      {isOpen && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: 400, height: 650,
          background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column",
          zIndex: 1000, overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                background: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Bot size={22} color="#fff" />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>EMS Assistant</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 500 }}>
                  {userRole === UserRole.ADMIN ? "Admin" : userRole === UserRole.HR ? "HR" : "Employee"} Support
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}
                style={{
                  background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
                  padding: "4px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                }}>
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="hi">HI</option>
              </select>
              <button onClick={() => setShowSearch(!showSearch)}
                style={{
                  background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6,
                  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                <Search size={14} color="#fff" />
              </button>
              <button onClick={exportChat}
                style={{
                  background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6,
                  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                <Download size={14} color="#fff" />
              </button>
              <button onClick={toggleChat}
                style={{
                  background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6,
                  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                <X size={16} color="#fff" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--foreground)", outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: selectedCategory === cat ? "#10B981" : "var(--secondary)",
                      color: selectedCategory === cat ? "#fff" : "var(--foreground)",
                      border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11,
                      cursor: "pointer", fontWeight: 600,
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
              {searchQuery && (
                <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted-foreground)" }}>
                  {filteredFAQs.length} results found
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", background: "var(--background)" }}>
            {messages.map((message) => (
              <div key={message.id} className="chat-message" style={{
                marginBottom: 14, display: "flex", flexDirection: "column",
                alignItems: message.sender === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  background: message.sender === "user" 
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : "var(--card)",
                  color: message.sender === "user" ? "#fff" : "var(--foreground)",
                  padding: "10px 14px", borderRadius: message.sender === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  maxWidth: "85%", border: message.sender === "bot" ? "1px solid var(--border)" : "none",
                  boxShadow: message.sender === "user" ? "0 2px 8px rgba(16, 185, 129, 0.3)" : "0 2px 4px rgba(0,0,0,0.05)",
                  whiteSpace: "pre-line", fontSize: 13, fontWeight: 500, lineHeight: 1.4,
                }}>
                  {message.text.split('**').map((part, i) => 
                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                  )}
                </div>

                {/* Action Buttons */}
                {message.actions && (
                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {message.actions.map((action, i) => (
                      <button key={i} onClick={() => handleNavigate(action.path)}
                        style={{
                          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                          color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px",
                          fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex",
                          alignItems: "center", gap: 5,
                        }}>
                        <ExternalLink size={12} />
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Follow-ups */}
                {message.followUps && (
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 10, color: "var(--muted-foreground)", fontWeight: 700, marginBottom: 4 }}>
                      RELATED
                    </div>
                    {message.followUps.map((q, i) => (
                      <button key={i} onClick={() => handleSendMessage(q)}
                        style={{
                          background: "var(--secondary)", border: "1px solid var(--border)",
                          borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "var(--foreground)",
                          cursor: "pointer", textAlign: "left", fontWeight: 500,
                        }}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Feedback */}
                {message.sender === "bot" && message.feedback === null && messages.indexOf(message) > 0 && (
                  <div style={{ marginTop: 6, display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>Helpful?</span>
                    <button onClick={() => handleFeedback(message.id, "positive")}
                      style={{
                        background: "none", border: "1px solid var(--border)", borderRadius: 6,
                        padding: "3px 6px", cursor: "pointer", display: "flex", alignItems: "center",
                      }}>
                      <ThumbsUp size={11} color="var(--muted-foreground)" />
                    </button>
                    <button onClick={() => handleFeedback(message.id, "negative")}
                      style={{
                        background: "none", border: "1px solid var(--border)", borderRadius: 6,
                        padding: "3px 6px", cursor: "pointer", display: "flex", alignItems: "center",
                      }}>
                      <ThumbsDown size={11} color="var(--muted-foreground)" />
                    </button>
                  </div>
                )}
                {message.feedback && (
                  <div style={{ marginTop: 4, fontSize: 10, color: "#10B981" }}>
                    ✓ Feedback received
                  </div>
                )}

                <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 3, fontWeight: 500 }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ marginBottom: 14, display: "flex", alignItems: "flex-start" }}>
                <div style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
                  display: "flex", gap: 4,
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#10B981",
                      animation: `dotPulse 1.4s infinite ease-in-out both`,
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {showQuickReplies && messages.length <= 1 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ 
                  fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)",
                  marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px",
                }}>
                  {t.quickActions}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {quickReplies.map((reply, i) => (
                    <button key={i} onClick={() => handleSendMessage(reply)}
                      style={{
                        background: "var(--card)", border: "1px solid var(--border)",
                        borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 600,
                        color: "var(--foreground)", cursor: "pointer", textAlign: "left",
                        transition: "all 0.2s",
                      }}>
                      {reply.startsWith("/") ? <Zap size={12} style={{ display: "inline", marginRight: 6 }} /> : null}
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)", background: "var(--card)" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input ref={inputRef} type="text" value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={t.placeholder}
                style={{
                  flex: 1, background: "var(--background)", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "9px 12px", fontSize: 13, color: "var(--foreground)",
                  outline: "none", fontWeight: 500,
                }}
              />
              <button onClick={() => handleSendMessage()} disabled={!inputValue.trim()}
                style={{
                  background: inputValue.trim() 
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : "var(--secondary)",
                  border: "none", borderRadius: 10, width: 40, height: 40,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: inputValue.trim() ? "pointer" : "not-allowed",
                  boxShadow: inputValue.trim() ? "0 2px 8px rgba(16, 185, 129, 0.3)" : "none",
                }}>
                <Send size={16} color={inputValue.trim() ? "#fff" : "var(--muted-foreground)"} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button onClick={toggleChat} className={!isOpen ? "chat-button-pulse" : ""}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56,
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          border: "none", borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)", zIndex: 999,
        }}>
        {unreadCount > 0 && !isOpen && (
          <div style={{
            position: "absolute", top: -4, right: -4, background: "#EF4444",
            color: "#fff", borderRadius: "50%", width: 20, height: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, border: "2px solid var(--background)",
          }}>
            {unreadCount}
          </div>
        )}
        {isOpen ? <X size={24} color="#fff" /> : <MessageCircle size={24} color="#fff" />}
      </button>
    </>
  );
}
