"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDb } from "@/context/DbContext";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  Coins, 
  Zap, 
  Target, 
  PieChart, 
  Database, 
  User as UserIcon, 
  Settings, 
  Bell, 
  Plus, 
  Trash2, 
  Edit,
  Lightbulb,
  BookOpen,
  HelpCircle,
  CheckSquare, 
  Square, 
  Award, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle, 
  X, 
  Info, 
  Calendar, 
  DollarSign, 
  Search,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Lock,
  PlusCircle,
  Clock,
  Loader2,
  Upload,
  Check
} from "lucide-react";

// Helper to translate category Lucide name into JSX icons
import * as LucideIcons from "lucide-react";

interface CategoryIconProps {
  name: string;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = "w-4 h-4" }) => {
  // @ts-expect-error dynamic lookup
  const IconComponent = LucideIcons[name] || LucideIcons.CircleEllipsis;
  return <IconComponent className={className} />;
};

export default function AppWorkspace() {
  const router = useRouter();
  const {
    currentUser,
    accounts,
    categories,
    transactions,
    creditCards,
    creditCardInvoices,
    creditCardPurchases,
    loans,
    routines,
    goals,
    notifications,
    subscription,
    openFinanceConnections,
    logout,
    addAccount,
    editAccount,
    deleteAccount,
    addTransaction,
    editTransaction,
    deleteTransaction,
    efetivarTransaction,
    addCategory,
    addCreditCard,
    editCreditCard,
    deleteCreditCard,
    addCreditCardPurchase,
    payInvoice,
    addLoan,
    editLoan,
    deleteLoan,
    payLoanInstallmentAction,
    addRoutine,
    editRoutine,
    toggleRoutineStatus,
    deleteRoutine,
    addGoal,
    editGoal,
    contributeToGoal,
    deleteGoal,
    markNotificationRead,
    clearNotifications,
    connectInstitution,
    disconnectInstitution,
    subscribeToPlan,
    cancelSubscription,
    resetDatabase
  } = useDb();

  // Active Screen Selector
  // "dashboard" | "transactions" | "cards" | "loans" | "routines" | "goals" | "reports" | "openfinance" | "billing" | "settings" | "notifications"
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Create New Transaction Form State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txDescription, setTxDescription] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txType, setTxType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);
  const [txCategoryId, setTxCategoryId] = useState("");
  const [txAccountId, setTxAccountId] = useState("");
  const [txPaymentMethod, setTxPaymentMethod] = useState<any>("PIX");
  const [txIsRecurring, setTxIsRecurring] = useState(false);
  const [txRecurrence, setTxRecurrence] = useState<any>("MONTHLY");
  const [txNotes, setTxNotes] = useState("");
  const [txFileAttached, setTxFileAttached] = useState<string | null>(null);

  // New Category Creation state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("indigo-500");
  const [newCatIcon, setNewCatIcon] = useState("Sparkles");

  // New Credit Card Form state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardBank, setCardBank] = useState("");
  const [cardLimit, setCardLimit] = useState("");
  const [cardClosingDay, setCardClosingDay] = useState("25");
  const [cardDueDay, setCardDueDay] = useState("5");
  const [cardColor, setCardColor] = useState("#6366f1");

  // New Loan Form state
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanName, setLoanName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanInstallments, setLoanInstallments] = useState("");
  const [loanInstallmentVal, setLoanInstallmentVal] = useState("");
  const [loanInterest, setLoanInterest] = useState("");

  // New Routine Form state
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [routineDesc, setRoutineDesc] = useState("");
  const [routineFreq, setRoutineFreq] = useState<any>("MONTHLY");
  const [routinePriority, setRoutinePriority] = useState<any>("MEDIUM");
  const [routineAmount, setRoutineAmount] = useState("");

  // New Goal Form state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [goalCategory, setGoalCategory] = useState<any>("EMERGENCY_FUND");

  // Goal Quick Contribution input tracker
  const [contribAmount, setContribAmount] = useState<{ [key: string]: string }>({});

  // Check Open Finance Sync progress
  const [syncingBank, setSyncingBank] = useState<string | null>(null);

  // New Account Form state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountBank, setAccountBank] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [accountColor, setAccountColor] = useState("#6366f1");

  // OFX/CSV Bank Statement Importer state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importAccountId, setImportAccountId] = useState("");
  const [parsedTransactions, setParsedTransactions] = useState<any[]>([]);
  const [selectedImportIndexes, setSelectedImportIndexes] = useState<number[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [importError, setImportError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportError("");
    setParsedTransactions([]);
    setSelectedImportIndexes([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.toLowerCase().endsWith(".ofx")) {
          parseOFX(text);
        } else if (file.name.toLowerCase().endsWith(".csv")) {
          parseCSV(text);
        } else {
          setImportError("Formato de arquivo inválido. Escolha um arquivo .ofx ou .csv.");
        }
      } catch (err: any) {
        setImportError("Falha ao processar arquivo: " + err.message);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const parseOFX = (text: string) => {
    const txRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
    let match;
    const list: any[] = [];

    const extract = (block: string, tag: string) => {
      const tagRegex = new RegExp(`<${tag}>([^<\r\n]+)`, "i");
      const m = block.match(tagRegex);
      return m ? m[1].trim() : "";
    };

    while ((match = txRegex.exec(text)) !== null) {
      const block = match[1];
      const typeStr = extract(block, "TRNTYPE");
      const dateStr = extract(block, "DTPOSTED");
      const amountStr = extract(block, "TRNAMT");
      const memo = extract(block, "MEMO") || extract(block, "NAME") || "Transação Importada";

      let date = new Date().toISOString().split("T")[0];
      if (dateStr && dateStr.length >= 8) {
        date = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
      }

      const amount = parseFloat(amountStr.replace(",", "."));
      if (isNaN(amount)) continue;

      const type = amount >= 0 ? "INCOME" : "EXPENSE";

      list.push({
        description: memo,
        amount: Math.abs(amount),
        type,
        date,
        categoryId: type === "INCOME" ? "cat-1" : "cat-3", // default categories
        paymentMethod: "PIX",
        selected: true
      });
    }

    if (list.length === 0) {
      setImportError("Nenhum lançamento válido encontrado no arquivo OFX.");
    } else {
      setParsedTransactions(list);
      setSelectedImportIndexes(list.map((_, idx) => idx));
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    const list: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      let cols: string[] = [];
      if (line.includes(";")) {
        cols = line.split(";");
      } else if (line.includes(",")) {
        cols = line.split(",");
      } else {
        cols = line.split("\t");
      }

      if (cols.length < 3) continue;

      let rawDate = cols[0]?.replace(/"/g, "").trim();
      let description = cols[1]?.replace(/"/g, "").trim() || "Transação Importada";
      let rawAmount = cols[2]?.replace(/"/g, "").replace(/\s/g, "").trim();

      let amount = parseFloat(rawAmount.replace(",", "."));
      if (isNaN(amount) && cols[3]) {
        rawAmount = cols[3]?.replace(/"/g, "").replace(/\s/g, "").trim();
        amount = parseFloat(rawAmount.replace(",", "."));
      }

      if (isNaN(amount)) continue;

      let date = new Date().toISOString().split("T")[0];
      if (rawDate) {
        if (rawDate.includes("/")) {
          const parts = rawDate.split("/");
          if (parts.length === 3) {
            if (parts[2].length === 4) {
              date = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
            } else if (parts[0].length === 4) {
              date = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
            }
          }
        } else if (rawDate.includes("-")) {
          const parts = rawDate.split("-");
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              date = rawDate;
            } else if (parts[2].length === 4) {
              date = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
            }
          }
        }
      }

      const type = amount >= 0 ? "INCOME" : "EXPENSE";

      list.push({
        description,
        amount: Math.abs(amount),
        type,
        date,
        categoryId: type === "INCOME" ? "cat-1" : "cat-3",
        paymentMethod: "PIX",
        selected: true
      });
    }

    if (list.length === 0) {
      setImportError("Nenhum lançamento válido encontrado no arquivo CSV.");
    } else {
      setParsedTransactions(list);
      setSelectedImportIndexes(list.map((_, idx) => idx));
    }
  };

  const confirmImport = () => {
    if (!importAccountId) {
      setImportError("Por favor, selecione uma conta de destino.");
      return;
    }

    const itemsToImport = parsedTransactions.filter((_, idx) => selectedImportIndexes.includes(idx));
    if (itemsToImport.length === 0) {
      setImportError("Selecione pelo menos uma transação para importar.");
      return;
    }

    itemsToImport.forEach(item => {
      addTransaction({
        accountId: importAccountId,
        categoryId: item.categoryId,
        description: item.description,
        amount: item.amount,
        type: item.type,
        date: item.date,
        paymentMethod: item.paymentMethod,
        isRecurring: false
      });
    });

    setIsImportModalOpen(false);
    setParsedTransactions([]);
    setSelectedImportIndexes([]);
    setImportFileName("");
    setImportAccountId("");
  };

  // Global editing state tracker
  const [editingId, setEditingId] = useState<string | null>(null);

  // Redirect to /auth if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !txCategoryId) {
      setTxCategoryId(categories[0].id);
    }
    if (accounts.length > 0 && !txAccountId) {
      setTxAccountId(accounts[0].id);
    }
  }, [categories, accounts, txCategoryId, txAccountId]);

  // Read pending subscriptions
  useEffect(() => {
    const pendingPlan = localStorage.getItem("finioy_pending_plan");
    if (pendingPlan && currentUser) {
      subscribeToPlan(pendingPlan as any);
      localStorage.removeItem("finioy_pending_plan");
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#090b11] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // --- DYNAMIC DATA CALCULATIONS ---
  const currentMonth = 5; // May 2026
  const currentYear = 2026;

  // Total balance: sum of accounts
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Projected Balance (including future pending transactions)
  const pendingTxs = transactions.filter(tx => tx.status === "PENDING");
  const pendingIncomes = pendingTxs.filter(tx => tx.type === "INCOME").reduce((sum, tx) => sum + tx.amount, 0);
  const pendingExpenses = pendingTxs.filter(tx => tx.type === "EXPENSE").reduce((sum, tx) => sum + tx.amount, 0);
  const projectedBalance = totalBalance + pendingIncomes - pendingExpenses;

  // Filter current month transactions
  const monthTxs = transactions.filter(tx => {
    const d = new Date(tx.date + "T00:00:00");
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });

  const totalReceived = monthTxs
    .filter(tx => tx.type === "INCOME" && tx.status !== "PENDING")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSpent = monthTxs
    .filter(tx => tx.type === "EXPENSE" && tx.status !== "PENDING")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate expenses by category (only completed)
  const expenseByCategory = categories.map(cat => {
    const total = monthTxs
      .filter(tx => tx.type === "EXPENSE" && tx.status !== "PENDING" && tx.categoryId === cat.id)
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { ...cat, total };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const highestExpenseCategory = expenseByCategory[0] || null;

  // Unread notifications
  const unreadNotifications = notifications.filter(n => !n.isRead);

  // Format monetary value
  const formatMoney = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Trigger simulated file upload
  const handleSimulateReceipt = () => {
    setTxFileAttached("comprovante_transacao_pdf_simulado.png");
  };

  // Submit Account
  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName || !accountBank || !accountBalance) return;

    const fields = {
      name: accountName,
      bank: accountBank,
      balance: parseFloat(accountBalance),
      color: accountColor
    };

    if (editingId) {
      editAccount(editingId, fields);
    } else {
      addAccount(fields);
    }

    setAccountName("");
    setAccountBank("");
    setAccountBalance("");
    setEditingId(null);
    setIsAccountModalOpen(false);
  };

  const handleEditAccountClick = (acc: any) => {
    setEditingId(acc.id);
    setAccountName(acc.name);
    setAccountBank(acc.bank);
    setAccountBalance(acc.balance.toString());
    setAccountColor(acc.color);
    setIsAccountModalOpen(true);
  };

  // Submit Transaction
  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription || !txAmount) return;

    const fields = {
      accountId: txAccountId || undefined,
      categoryId: txCategoryId,
      description: txDescription,
      amount: parseFloat(txAmount),
      type: txType,
      date: txDate,
      paymentMethod: txPaymentMethod,
      isRecurring: txIsRecurring,
      recurrence: txIsRecurring ? txRecurrence : undefined,
      receiptUrl: txFileAttached || undefined,
      notes: txNotes || undefined
    };

    if (editingId) {
      editTransaction(editingId, fields);
    } else {
      addTransaction(fields);
    }

    // Reset Form
    setTxDescription("");
    setTxAmount("");
    setTxNotes("");
    setTxFileAttached(null);
    setEditingId(null);
    setIsTxModalOpen(false);
  };

  const handleEditTransactionClick = (tx: any) => {
    setEditingId(tx.id);
    setTxDescription(tx.description);
    setTxAmount(tx.amount.toString());
    setTxType(tx.type);
    setTxDate(tx.date);
    setTxCategoryId(tx.categoryId);
    setTxAccountId(tx.accountId || "");
    setTxPaymentMethod(tx.paymentMethod);
    setTxIsRecurring(tx.isRecurring);
    setTxRecurrence(tx.recurrence || "MONTHLY");
    setTxNotes(tx.notes || "");
    setTxFileAttached(tx.receiptUrl || null);
    setIsTxModalOpen(true);
  };

  // Submit custom Category
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    addCategory({
      name: newCatName,
      color: newCatColor,
      icon: newCatIcon
    });

    setNewCatName("");
    setIsCatModalOpen(false);
  };

  // Submit Credit Card
  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardLimit) return;

    const fields = {
      name: cardName,
      bank: cardBank,
      limitTotal: parseFloat(cardLimit),
      closingDay: parseInt(cardClosingDay),
      dueDay: parseInt(cardDueDay),
      color: cardColor
    };

    if (editingId) {
      editCreditCard(editingId, fields);
    } else {
      addCreditCard(fields);
    }

    setCardName("");
    setCardBank("");
    setCardLimit("");
    setEditingId(null);
    setIsCardModalOpen(false);
  };

  const handleEditCardClick = (card: any) => {
    setEditingId(card.id);
    setCardName(card.name);
    setCardBank(card.bank);
    setCardLimit(card.limitTotal.toString());
    setCardClosingDay(card.closingDay.toString());
    setCardDueDay(card.dueDay.toString());
    setCardColor(card.color);
    setIsCardModalOpen(true);
  };

  // Submit Credit Card purchase
  const [purchaseCardId, setPurchaseCardId] = useState("");
  const [purchaseDesc, setPurchaseDesc] = useState("");
  const [purchaseAmt, setPurchaseAmt] = useState("");
  const [purchaseInst, setPurchaseInst] = useState("1");
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const handleAddPurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseDesc || !purchaseAmt || !purchaseCardId) return;

    addCreditCardPurchase({
      cardId: purchaseCardId,
      description: purchaseDesc,
      amount: parseFloat(purchaseAmt),
      date: new Date().toISOString().split("T")[0],
      installments: parseInt(purchaseInst),
      currentInstallment: 1
    });

    setPurchaseDesc("");
    setPurchaseAmt("");
    setPurchaseInst("1");
    setIsPurchaseModalOpen(false);
  };

  // Submit Loan
  const handleAddLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanName || !loanAmount || !loanInstallments || !loanInstallmentVal) return;

    const fields = {
      name: loanName,
      amountTotal: parseFloat(loanAmount),
      installments: parseInt(loanInstallments),
      installmentVal: parseFloat(loanInstallmentVal),
      interestRate: loanInterest ? parseFloat(loanInterest) : undefined
    };

    if (editingId) {
      editLoan(editingId, fields);
    } else {
      addLoan({
        ...fields,
        startDate: new Date().toISOString().split("T")[0],
        status: "ACTIVE"
      });
    }

    setLoanName("");
    setLoanAmount("");
    setLoanInstallments("");
    setLoanInstallmentVal("");
    setLoanInterest("");
    setEditingId(null);
    setIsLoanModalOpen(false);
  };

  const handleEditLoanClick = (loan: any) => {
    setEditingId(loan.id);
    setLoanName(loan.name);
    setLoanAmount(loan.amountTotal.toString());
    setLoanInstallments(loan.installments.toString());
    setLoanInstallmentVal(loan.installmentVal.toString());
    setLoanInterest(loan.interestRate ? loan.interestRate.toString() : "");
    setIsLoanModalOpen(true);
  };

  // Submit Routine
  const handleAddRoutineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName) return;

    const fields = {
      name: routineName,
      description: routineDesc || undefined,
      frequency: routineFreq,
      priority: routinePriority,
      amount: routineAmount ? parseFloat(routineAmount) : undefined
    };

    if (editingId) {
      editRoutine(editingId, fields);
    } else {
      addRoutine({
        ...fields,
        notify: true,
        dueDate: new Date().toISOString().split("T")[0]
      });
    }

    setRoutineName("");
    setRoutineDesc("");
    setRoutineAmount("");
    setEditingId(null);
    setIsRoutineModalOpen(false);
  };

  const handleEditRoutineClick = (r: any) => {
    setEditingId(r.id);
    setRoutineName(r.name);
    setRoutineDesc(r.description || "");
    setRoutineFreq(r.frequency);
    setRoutinePriority(r.priority);
    setRoutineAmount(r.amount ? r.amount.toString() : "");
    setIsRoutineModalOpen(true);
  };

  // Submit Goal
  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget || !goalDeadline) return;

    const fields = {
      name: goalName,
      targetVal: parseFloat(goalTarget),
      deadline: goalDeadline,
      category: goalCategory
    };

    if (editingId) {
      editGoal(editingId, fields);
    } else {
      addGoal(fields);
    }

    setGoalName("");
    setGoalTarget("");
    setGoalDeadline("");
    setEditingId(null);
    setIsGoalModalOpen(false);
  };

  const handleEditGoalClick = (g: any) => {
    setEditingId(g.id);
    setGoalName(g.name);
    setGoalTarget(g.targetVal.toString());
    setGoalDeadline(g.deadline);
    setGoalCategory(g.category);
    setIsGoalModalOpen(true);
  };

  // Connect Open Finance Institution simulator
  const handleConnectInstitutionSimulator = (bankName: string) => {
    setSyncingBank(bankName);
    setTimeout(() => {
      connectInstitution(bankName);
      setSyncingBank(null);
    }, 2000);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <PieChart className="w-4.5 h-4.5" /> },
    { id: "transactions", label: "Gastos & Receitas", icon: <Wallet className="w-4.5 h-4.5" /> },
    { id: "cards", label: "Cartões", icon: <CreditCard className="w-4.5 h-4.5" /> },
    { id: "loans", label: "Empréstimos", icon: <Coins className="w-4.5 h-4.5" /> },
    { id: "routines", label: "Rotinas", icon: <Zap className="w-4.5 h-4.5" /> },
    { id: "goals", label: "Metas", icon: <Target className="w-4.5 h-4.5" /> },
    { id: "reports", label: "Relatórios", icon: <LucideIcons.BarChart3 className="w-4.5 h-4.5" /> },
    { id: "openfinance", label: "Open Finance", icon: <Database className="w-4.5 h-4.5" /> },
    { id: "billing", label: "Assinatura", icon: <Award className="w-4.5 h-4.5" /> },
    { id: "settings", label: "Configurações", icon: <Settings className="w-4.5 h-4.5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#090b11] text-slate-100 flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* --- DESKTOP SIDEBAR NAVIGATION --- */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950/80 backdrop-blur-md border-r border-white/5 p-6 h-screen sticky top-0 justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <img src="/logo-white.png" alt="FINIOY Logo" className="h-7 w-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-bold text-lg tracking-wider">
              FIN<span className="text-indigo-400">IOY</span>
            </span>
            {currentUser.isPremium && (
              <span className="px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-[8px] font-black uppercase text-indigo-400 rounded">PRO</span>
            )}
          </div>

          {/* Nav list */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setNotificationsOpen(false); }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all relative ${
                  activeTab === item.id 
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/15" 
                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === "openfinance" && openFinanceConnections.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ml-auto" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate text-white leading-tight">{currentUser.name}</h4>
              <span className="text-[10px] text-slate-500 truncate block leading-tight">{currentUser.email}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full py-2 bg-slate-900 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-300 rounded-lg text-[10px] font-bold text-slate-400 transition-all"
          >
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* --- MOBILE FOOTER NAVIGATION BAR --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-lg border-t border-white/5 px-4 flex items-center justify-around z-40">
        <button 
          onClick={() => { setActiveTab("dashboard"); setNotificationsOpen(false); }}
          className={`flex flex-col items-center gap-1 text-[9px] font-medium transition-colors ${activeTab === "dashboard" ? "text-indigo-400" : "text-slate-500"}`}
        >
          <PieChart className="w-5 h-5" />
          <span>Início</span>
        </button>
        <button 
          onClick={() => { setActiveTab("transactions"); setNotificationsOpen(false); }}
          className={`flex flex-col items-center gap-1 text-[9px] font-medium transition-colors ${activeTab === "transactions" ? "text-indigo-400" : "text-slate-500"}`}
        >
          <Wallet className="w-5 h-5" />
          <span>Extrato</span>
        </button>
        <button 
          onClick={() => setIsTxModalOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center -translate-y-5 shadow-xl shadow-indigo-500/30 text-[#090b11] transition-transform active:scale-95"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
        <button 
          onClick={() => { setActiveTab("cards"); setNotificationsOpen(false); }}
          className={`flex flex-col items-center gap-1 text-[9px] font-medium transition-colors ${activeTab === "cards" ? "text-indigo-400" : "text-slate-500"}`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Cartões</span>
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center gap-1 text-[9px] font-medium transition-colors ${isMobileMenuOpen ? "text-indigo-400" : "text-slate-500"}`}
        >
          <LucideIcons.Menu className="w-5 h-5" />
          <span>Mais</span>
        </button>
      </nav>

      {/* --- MOBILE FULLSCREEN MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-8 flex flex-col justify-between animate-fade-in">
          <div>
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg">Menu Completo</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); setNotificationsOpen(false); }}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center text-xs font-bold transition-all ${
                    activeTab === item.id 
                      ? "bg-indigo-500 border-indigo-500 text-white" 
                      : "bg-slate-900/40 border-white/5 text-slate-300"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <UserIcon className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{currentUser.name}</h4>
                <span className="text-[9px] text-slate-500 truncate block max-w-[130px]">{currentUser.email}</span>
              </div>
            </div>
            <button 
              onClick={() => { logout(); setIsMobileMenuOpen(false); }}
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg text-[10px] font-extrabold border border-rose-500/20"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE WORKSPACE CONTAINER --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- GLOBAL APPLICATION HEADER --- */}
        <header className="px-6 lg:px-10 py-4.5 border-b border-white/5 bg-slate-950/20 backdrop-blur-sm flex items-center justify-between sticky top-0 z-30">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Workspace</span>
            <h1 className="text-lg font-bold text-white leading-tight capitalize">
              {menuItems.find(m => m.id === activeTab)?.label || "Financeiro"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Quick transaction trigger desktop */}
            <button
              onClick={() => setIsTxModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-md shadow-indigo-500/15"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Lançamento</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center hover:border-white/10 transition-colors relative"
              >
                <Bell className="w-4.5 h-4.5 text-slate-300" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded-full shadow animate-pulse">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification dropdown floating */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 border border-white/8 shadow-2xl z-50 animate-scale-in">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                    <span className="text-xs font-bold text-slate-300">Notificações Recentes</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-300"
                      >
                        Limpar Tudo
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-[10px]">
                        Nenhuma notificação encontrada.
                      </div>
                    ) : (
                      notifications.map(not => (
                        <div 
                          key={not.id} 
                          onClick={() => markNotificationRead(not.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                            not.isRead 
                              ? "bg-slate-950/20 border-white/5 opacity-60" 
                              : "bg-slate-900/60 border-indigo-500/20 hover:border-indigo-500/40"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-bold ${
                              not.type === "WARNING" ? "text-warning" : not.type === "SUCCESS" ? "text-success" : "text-cyan-400"
                            }`}>{not.title}</span>
                            {!not.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">{not.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- DYNAMIC SUB-VIEW SCREEN INJECTIONS --- */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          
          {/* ======================================= */}
          {/* 1. DASHBOARD VIEW                       */}
          {/* ======================================= */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-8 animate-slide-up">
              
              {/* Cards row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Balance */}
                <div className="p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between h-40">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Saldo Consolidado</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-white mt-1">{formatMoney(totalBalance)}</h2>
                    <div className="flex items-center justify-between text-[10px] mt-2 text-slate-500">
                      <span>Soma de {accounts.length} contas</span>
                      {projectedBalance !== totalBalance && (
                        <span className="font-extrabold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                          Previsto: {formatMoney(projectedBalance)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Received */}
                <div className="p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between h-40">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Recebido no Mês</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-emerald-400 mt-1">{formatMoney(totalReceived)}</h2>
                    <span className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-1.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Entradas registradas em Maio
                    </span>
                  </div>
                </div>

                {/* Spent */}
                <div className="p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between h-40">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[40px] pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Pago no Mês</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-rose-400 mt-1">{formatMoney(totalSpent)}</h2>
                    <span className="text-[10px] text-rose-400/80 flex items-center gap-1 mt-1.5">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Despesas liquidadas em Maio
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphic charts & Category columns split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SVG glowing entries/exits chart column */}
                <div className="lg:col-span-2 p-6 rounded-2xl glass-panel flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white">Fluxo de Caixa Consolidado</h3>
                      <p className="text-[10px] text-slate-500">Comparação mensal de receitas vs despesas</p>
                    </div>
                    <div className="flex gap-4 text-[10px] font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Recebimentos
                      </span>
                      <span className="flex items-center gap-1.5 text-indigo-400">
                        <span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Despesas
                      </span>
                    </div>
                  </div>

                  {/* Responsive custom interactive SVG chart */}
                  <div className="w-full h-56 pt-6">
                    <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGlowPrimary" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="chartGlowSuccess" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="40" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />

                      {/* X labels (Months) */}
                      <text x="50" y="190" fill="#64748b" fontSize="8" fontWeight="bold">Dez</text>
                      <text x="130" y="190" fill="#64748b" fontSize="8" fontWeight="bold">Jan</text>
                      <text x="210" y="190" fill="#64748b" fontSize="8" fontWeight="bold">Fev</text>
                      <text x="290" y="190" fill="#64748b" fontSize="8" fontWeight="bold">Mar</text>
                      <text x="370" y="190" fill="#64748b" fontSize="8" fontWeight="bold">Abr</text>
                      <text x="450" y="190" fill="#64748b" fontSize="8" fontWeight="bold">Mai (Atual)</text>

                      {/* Y labels */}
                      <text x="10" y="35" fill="#64748b" fontSize="8" fontWeight="bold">R$ 10k</text>
                      <text x="10" y="85" fill="#64748b" fontSize="8" fontWeight="bold">R$ 5k</text>
                      <text x="10" y="135" fill="#64748b" fontSize="8" fontWeight="bold">R$ 2.5k</text>
                      <text x="10" y="175" fill="#64748b" fontSize="8" fontWeight="bold">R$ 0</text>

                      {/* INCOME Curve Areas */}
                      <path d="M 50 110 Q 130 60 210 50 T 370 40 T 450 45 L 450 170 L 50 170 Z" fill="url(#chartGlowSuccess)" />
                      <path d="M 50 110 Q 130 60 210 50 T 370 40 T 450 45" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />

                      {/* EXPENSE Curve Areas */}
                      <path d="M 50 140 Q 130 110 210 120 T 370 100 T 450 125 L 450 170 L 50 170 Z" fill="url(#chartGlowPrimary)" />
                      <path d="M 50 140 Q 130 110 210 120 T 370 100 T 450 125" fill="none" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />

                      {/* Data Dots on current month */}
                      <circle cx="450" cy="45" r="4.5" fill="#10b981" stroke="#090b11" strokeWidth="1.5" className="animate-bounce" />
                      <circle cx="450" cy="125" r="4.5" fill="#6366f1" stroke="#090b11" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Categories with highest expense */}
                <div className="p-6 rounded-2xl glass-panel flex flex-col gap-5">
                  <div>
                    <h3 className="font-bold text-sm text-white">Distribuição por Categoria</h3>
                    <p className="text-[10px] text-slate-500">Seus maiores ralos financeiros</p>
                  </div>

                  <div className="flex flex-col gap-3.5 flex-1 justify-center">
                    {expenseByCategory.length === 0 ? (
                      <div className="text-center text-[11px] text-slate-500 py-6">
                        Nenhuma despesa registrada este mês.
                      </div>
                    ) : (
                      expenseByCategory.slice(0, 4).map(cat => {
                        const pct = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
                        return (
                          <div key={cat.id} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-2 font-semibold text-slate-300">
                                <span className={`w-2.5 h-2.5 rounded bg-${cat.color}`} />
                                {cat.name}
                              </span>
                              <span className="font-extrabold text-white text-[11px]">
                                {formatMoney(cat.total)} <span className="text-[10px] font-normal text-slate-400">({pct.toFixed(0)}%)</span>
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                              <div className={`h-full bg-${cat.color}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button 
                    onClick={() => setActiveTab("reports")}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-850 hover:text-white transition-colors text-[10px] font-bold text-slate-400"
                  >
                    Ver Relatório Detalhado
                  </button>
                </div>
              </div>

              {/* Minhas Contas Bancárias */}
              <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">Minhas Contas Bancárias</h3>
                    <p className="text-[10px] text-slate-500">Cadastre e gerencie suas carteiras e contas digitais</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setAccountName("");
                      setAccountBank("");
                      setAccountBalance("");
                      setAccountColor("#6366f1");
                      setIsAccountModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[10px] flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Conta
                  </button>
                </div>

                {accounts.length === 0 ? (
                  <div className="border border-white/5 rounded-2xl bg-[#090b11]/60 p-6 flex flex-col md:flex-row items-center gap-6 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Como começar: Cadastre sua primeira Conta Bancária!</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl">
                        Para ver o seu <strong>Saldo Consolidado</strong> e lançar transações reais, você precisa de pelo menos uma conta ativa (ex: Conta Corrente, Dinheiro em Espécie ou Poupança). 
                        Clique no botão <strong>Adicionar Conta</strong> ao lado, escolha um nome, insira o saldo atual e selecione uma cor personalizada para identificação!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setAccountName("");
                        setAccountBank("");
                        setAccountBalance("");
                        setAccountColor("#6366f1");
                        setIsAccountModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow shadow-indigo-500/25 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Criar Conta Agora
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {accounts.map(acc => {
                      const accountProjectedBalance = acc.balance + pendingTxs
                        .filter(tx => tx.accountId === acc.id)
                        .reduce((sum, tx) => sum + (tx.type === "INCOME" ? tx.amount : -tx.amount), 0);

                      return (
                        <div
                          key={acc.id}
                          className="p-4 rounded-xl border border-white/5 bg-slate-950/20 flex flex-col justify-between gap-3 relative group overflow-hidden"
                        >
                          {/* Ambient glow from color */}
                          <div 
                            className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-10 pointer-events-none"
                            style={{ backgroundColor: acc.color || "#6366f1" }}
                          />
                          <div className="flex items-center justify-between z-10">
                            <span 
                              className="px-2 py-0.5 rounded text-[8px] font-black uppercase text-white"
                              style={{ backgroundColor: acc.color || "#6366f1" }}
                            >
                              {acc.bank}
                            </span>
                            
                            {/* Action icons */}
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                              <button
                                onClick={() => handleEditAccountClick(acc)}
                                className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded transition-colors cursor-pointer"
                                title="Editar Conta"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteAccount(acc.id)}
                                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                                title="Remover Conta"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="z-10 text-left">
                            <span className="text-xs font-bold text-slate-300 block leading-tight">{acc.name}</span>
                            <div className="flex items-baseline justify-between gap-1.5 mt-1">
                              <span className="text-sm font-black text-white">{formatMoney(acc.balance)}</span>
                              {accountProjectedBalance !== acc.balance && (
                                <span className="text-[9px] font-extrabold text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded border border-indigo-500/10" title="Saldo projetado com agendamentos">
                                  Prev: {formatMoney(accountProjectedBalance)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom splits: Upcoming payments & credit card current cycle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Financial Routines / Checklist dashboard integration */}
                <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white">Próximos Pagamentos</h3>
                      <p className="text-[10px] text-slate-500">Suas rotinas financeiras agendadas</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab("routines")}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                    >
                      Gerenciar <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {routines.slice(0, 3).map(rot => (
                      <div 
                        key={rot.id}
                        onClick={() => toggleRoutineStatus(rot.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          rot.status === "COMPLETED" 
                            ? "bg-slate-950/40 border-white/5 opacity-50" 
                            : "bg-slate-900/40 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {rot.status === "COMPLETED" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <div className="w-5 h-5 rounded bg-slate-950 border border-white/10 flex items-center justify-center text-slate-600">
                              <Clock className="w-3 h-3" />
                            </div>
                          )}
                          <div className="text-left">
                            <span className={`text-xs font-bold block ${rot.status === "COMPLETED" ? "line-through text-slate-500" : "text-white"}`}>{rot.name}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-semibold">{rot.frequency === "MONTHLY" ? "Mensal" : "Semanal"} {rot.time ? `• ${rot.time}` : ""}</span>
                          </div>
                        </div>

                        {rot.amount && (
                          <span className={`text-xs font-extrabold ${rot.status === "COMPLETED" ? "text-slate-500 line-through" : "text-rose-400"}`}>
                            {formatMoney(rot.amount)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smart Financial Insights / AI Coach */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/10 flex flex-col justify-between">
                  <div className="flex flex-col gap-4 text-left">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-indigo-300">Resumo Inteligente FINIOY</h3>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        Analisamos suas últimas movimentações bancárias do mês de Maio para dar sugestões personalizadas sobre seu dinheiro:
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 text-[11px] text-slate-300 mt-2">
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <p>Você gastou <span className="text-white font-bold">{highestExpenseCategory ? formatMoney(highestExpenseCategory.total) : "R$ 0"}</span> com <span className="text-indigo-400 font-bold">{highestExpenseCategory ? highestExpenseCategory.name : "categorias"}</span>. Que tal tentar reduzir em 10% na próxima semana?</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <p>Sua meta <span className="text-white font-bold">Reserva de Emergência</span> está em 66%. Considere transferir R$ 200,00 da sua Conta Principal para render no CDI.</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab("goals")}
                    className="w-full mt-6 py-3 bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow shadow-indigo-500/20"
                  >
                    <Target className="w-4 h-4" />
                    <span>Aportar em Minhas Metas</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 2. TRANSACTIONS VIEW (EXPENSES & INCOMES) */}
          {/* ======================================= */}
          {activeTab === "transactions" && (
            <div className="flex flex-col gap-6 animate-slide-up">
              
              {/* GUIA DE FLUXO DE CAIXA */}
              <div className="p-4.5 rounded-2xl bg-[#090b11]/80 border border-indigo-500/10 text-left flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Como gerenciar seu Fluxo de Caixa</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                    O <strong>Fluxo de Caixa</strong> registra todas as entradas (receitas) e saídas (despesas) das suas contas bancárias. 
                    Ao lançar um valor, você escolhe uma <strong>Categoria</strong> (para organizar seus relatórios e gráficos) e a <strong>Conta Bancária</strong> de origem/destino. 
                    O saldo da conta associada é atualizado instantaneamente! Você também pode anexar fotos de comprovantes e definir repetições para transações recorrentes.
                  </p>
                </div>
              </div>

              {/* Header block with search & create category */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingId(null);
                      setTxDescription("");
                      setTxAmount("");
                      setTxNotes("");
                      setTxFileAttached(null);
                      setIsTxModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
                  >
                    <Plus className="w-4.5 h-4.5" /> Lançar Valor
                  </button>
                  <button 
                    onClick={() => setIsCatModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-850 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4.5 h-4.5 text-indigo-400" /> Criar Categoria
                  </button>
                  <button 
                    onClick={() => {
                      setImportFileName("");
                      setImportError("");
                      setParsedTransactions([]);
                      setSelectedImportIndexes([]);
                      setIsImportModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-850 text-emerald-450 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4.5 h-4.5 text-emerald-400" /> Importar Extrato
                  </button>
                </div>

                {/* Fast search filter input mock */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por descrição..."
                    className="w-full form-input pl-10 text-xs py-2.5"
                  />
                </div>
              </div>

              {/* Transactions feed table */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-950 border-b border-white/5 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Lista de Transações</span>
                  <span>Exibindo {transactions.length} lançamentos</span>
                </div>

                <div className="divide-y divide-white/5 flex flex-col">
                  {transactions.length === 0 ? (
                    <div className="text-center py-12 px-6 flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="max-w-md text-center">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nenhuma transação registrada ainda!</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                          Lance sua primeira despesa ou receita para ver os gráficos mudando e as categorias se organizando em relatórios inteligentes.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setTxDescription("");
                          setTxAmount("");
                          setTxNotes("");
                          setTxFileAttached(null);
                          setIsTxModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow shadow-indigo-500/20 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Lançar Meu Primeiro Valor
                      </button>
                    </div>
                  ) : (
                    transactions.map(tx => {
                      const cat = categories.find(c => c.id === tx.categoryId);
                      return (
                        <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.01] transition-colors group text-left">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center text-${cat?.color || "slate-400"} shrink-0`}>
                              {cat ? (
                                <CategoryIcon name={cat.icon} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                              ) : (
                                <Wallet className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-white block truncate">{tx.description}</span>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                <span className={`text-${cat?.color || "slate-400"}`}>{cat?.name || "Lançamento"}</span>
                                <span>•</span>
                                <span>{tx.date}</span>
                                <span>•</span>
                                <span className="truncate">{tx.paymentMethod}</span>
                                {tx.isRecurring && (
                                  <>
                                    <span>•</span>
                                    <span className="text-indigo-400">Recorrente</span>
                                  </>
                                )}
                                {tx.receiptUrl && (
                                  <>
                                    <span>•</span>
                                    <span className="text-cyan-400 flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> Anexo</span>
                                  </>
                                )}
                                <span>•</span>
                                {tx.status === "PENDING" ? (
                                  <span className="text-indigo-450 font-extrabold uppercase tracking-widest text-[8px] px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/15 rounded">Agendado</span>
                                ) : (
                                  <span className="text-emerald-450 font-extrabold uppercase tracking-widest text-[8px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/15 rounded">Efetivado</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0">
                            <span className={`text-sm sm:text-base font-black ${tx.type === "INCOME" ? "text-emerald-400" : "text-rose-400"}`}>
                              {tx.type === "INCOME" ? "+" : "-"} {formatMoney(tx.amount)}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              {tx.status === "PENDING" && (
                                <button
                                  onClick={() => efetivarTransaction(tx.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-650 text-white font-extrabold text-[9px] flex items-center gap-1 transition-all shadow shadow-indigo-500/20 cursor-pointer shrink-0"
                                  title="Efetivar Pagamento / Recebimento"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Efetivar
                                </button>
                              )}
                              <button 
                                onClick={() => handleEditTransactionClick(tx)}
                                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-450 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                                title="Editar Transação"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteTransaction(tx.id)}
                                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                                title="Excluir Transação"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 3. CREDIT CARD MANAGER                 */}
          {/* ======================================= */}
          {activeTab === "cards" && (
            <div className="flex flex-col gap-8 animate-slide-up">
              
              {/* GUIA DE CARTÕES DE CRÉDITO */}
              <div className="p-4.5 rounded-2xl bg-[#090b11]/80 border border-indigo-500/10 text-left flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Como funcionam seus Cartões de Crédito</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                    Diferente de uma conta bancária (débito), o <strong>Cartão de Crédito</strong> funciona por limite de crédito. 
                    Ao cadastrar um cartão, você define o <strong>Limite Total</strong>, o <strong>Dia de Fechamento</strong> (quando a fatura mensal encerra) e o <strong>Dia de Vencimento</strong> (limite para pagamento).
                    Lançar compras consome seu limite disponível e gera uma fatura aberta. Ao fazer o <strong>Pagamento da Fatura</strong>, seu limite é restaurado automaticamente!
                  </p>
                </div>
              </div>

              {/* Header trigger */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-400">Cartões de Crédito</h3>
                  <p className="text-[10px] text-slate-500">Controle de limites e faturas atuais</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingId(null);
                      setCardName("");
                      setCardBank("");
                      setCardLimit("");
                      setIsCardModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus className="w-4.5 h-4.5" /> Cadastrar Cartão
                  </button>
                  {creditCards.length > 0 && (
                    <button 
                      onClick={() => { setPurchaseCardId(creditCards[0].id); setIsPurchaseModalOpen(true); }}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-850 hover:text-white text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4.5 h-4.5 text-indigo-400" /> Lançar Compra
                    </button>
                  )}
                </div>
              </div>

              {/* Cards showcase list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {creditCards.length === 0 ? (
                  <div className="md:col-span-2 text-center py-12 px-6 flex flex-col items-center gap-4 border border-white/5 rounded-2xl bg-[#090b11]/60">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="max-w-md">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nenhum cartão cadastrado ainda!</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Cadastre seu primeiro cartão clicando no botão acima. Você poderá registrar faturas abertas, acompanhar seu limite de crédito consumido e lançar parcelamentos sem perder o controle.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setCardName("");
                        setCardBank("");
                        setCardLimit("");
                        setIsCardModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow shadow-indigo-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> Cadastrar Meu Primeiro Cartão
                    </button>
                  </div>
                ) : (
                  creditCards.map(card => {
                    const openInvoice = creditCardInvoices.find(inv => inv.cardId === card.id && inv.status === "OPEN");
                    const cardPurchases = creditCardPurchases.filter(pur => pur.cardId === card.id);
                    
                    const percentUsed = card.limitTotal > 0 ? ((card.limitTotal - card.limitAvailable) / card.limitTotal) * 100 : 0;

                    return (
                      <div key={card.id} className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-950/40 border border-white/5 shadow-xl relative overflow-hidden">
                        
                        {/* Fake Credit Card UI Graphic replica */}
                        <div 
                          className="w-full h-44 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative select-none animate-float"
                          style={{
                            background: `linear-gradient(135deg, ${card.color} 0%, rgba(9, 11, 17, 0.95) 100%)`,
                            boxShadow: `0 8px 30px -5px ${card.color}40`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h4 className="text-sm font-black text-white leading-none">{card.name}</h4>
                              <span className="text-[10px] text-slate-300">{card.bank}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCardClick(card);
                                }}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                                title="Editar Cartão"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteCreditCard(card.id);
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition-all border border-rose-500/10"
                                title="Excluir Cartão"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <div className="w-10 h-7 rounded bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-[8px] font-black tracking-widest text-white">
                                VISA
                              </div>
                            </div>
                          </div>

                          <div className="text-left">
                            <span className="text-[9px] uppercase font-bold text-white/60 tracking-wider">Limite Disponível</span>
                            <h2 className="text-xl font-bold text-white leading-tight">{formatMoney(card.limitAvailable)}</h2>
                          </div>

                          <div className="flex justify-between items-end text-[9px] font-bold text-white/80">
                            <div>
                              <span className="block uppercase text-[8px] text-white/40 mb-0.5">Fechamento</span>
                              <span>Dia {card.closingDay}</span>
                            </div>
                            <div>
                              <span className="block uppercase text-[8px] text-white/40 mb-0.5">Vencimento</span>
                              <span>Dia {card.dueDay}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Invoice tracking details */}
                        <div className="flex flex-col gap-4 text-left">
                          <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Fatura Atual (Maio)</span>
                              <h3 className="text-lg font-extrabold text-violet-400 mt-0.5">
                                {openInvoice ? formatMoney(openInvoice.amount) : "R$ 0,00"}
                              </h3>
                            </div>
                            
                            {openInvoice && openInvoice.amount > 0 && (
                              <button
                                onClick={() => payInvoice(openInvoice.id)}
                                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-colors"
                              >
                                Pagar Fatura
                              </button>
                            )}
                          </div>

                          {/* Limit bar tracker */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs font-semibold text-slate-400">
                              <span>Limite Consumido</span>
                              <span>{percentUsed.toFixed(0)}% ({formatMoney(card.limitTotal - card.limitAvailable)} de {formatMoney(card.limitTotal)})</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${percentUsed}%` }} />
                            </div>
                          </div>

                          {/* Purchase statements inside invoices */}
                          <div className="mt-4">
                            <span className="text-xs font-bold text-slate-300 block mb-2.5">Últimas Compras no Cartão</span>
                            <div className="divide-y divide-white/5 flex flex-col max-h-32 overflow-y-auto pr-2">
                              {cardPurchases.length === 0 ? (
                                <div className="text-center py-4 text-slate-500 text-[10px]">
                                  Nenhuma compra efetuada com este cartão.
                                </div>
                              ) : (
                                cardPurchases.map(pur => (
                                  <div key={pur.id} className="py-2 flex items-center justify-between text-xs">
                                    <div className="text-left">
                                      <span className="font-bold text-white block">{pur.description}</span>
                                      <span className="text-[9px] text-slate-500">{pur.date} {pur.installments > 1 ? `• Parcela ${pur.currentInstallment}/${pur.installments}` : "• À Vista"}</span>
                                    </div>
                                    <span className="font-extrabold text-rose-400">{formatMoney(pur.amount)}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 4. LOANS MANAGER                       */}
          {/* ======================================= */}
          {activeTab === "loans" && (
            <div className="flex flex-col gap-8 animate-slide-up">
              
              {/* GUIA DE EMPRÉSTIMOS E AMORTIZAÇÕES */}
              <div className="p-4.5 rounded-2xl bg-[#090b11]/80 border border-indigo-500/10 text-left flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Como gerenciar seus Empréstimos e Financiamentos</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                    O <strong>Módulo de Empréstimos</strong> ajuda você a visualizar e gerenciar o progresso de quitação de passivos de longo prazo (ex: financiamento do carro, casa ou crédito pessoal). 
                    Insira o <strong>Valor Total Contratado</strong>, a quantidade de parcelas e o valor de cada prestação. 
                    O app gerará uma barra de progresso mostrando o percentual pago, o montante total amortizado e o saldo devedor restante conforme você registra o pagamento das parcelas.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-400">Módulo de Empréstimos</h3>
                  <p className="text-[10px] text-slate-500">Histórico de amortização e parcelas pendentes</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setLoanName("");
                    setLoanAmount("");
                    setLoanInstallments("");
                    setLoanInstallmentVal("");
                    setLoanInterest("");
                    setIsLoanModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus className="w-4.5 h-4.5" /> Adicionar Empréstimo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loans.length === 0 ? (
                  <div className="md:col-span-2 text-center py-12 px-6 flex flex-col items-center gap-4 border border-white/5 rounded-2xl bg-[#090b11]/60">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div className="max-w-md">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nenhum contrato ativo cadastrado!</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Cadastre financiamentos ou empréstimos ativos para acompanhar as parcelas pendentes e o saldo devedor de forma gráfica e auto-explicativa.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setLoanName("");
                        setLoanAmount("");
                        setLoanInstallments("");
                        setLoanInstallmentVal("");
                        setLoanInterest("");
                        setIsLoanModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow shadow-indigo-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Primeiro Empréstimo
                    </button>
                  </div>
                ) : (
                  loans.map(loan => {
                    const payPct = (loan.paidInstallments / loan.installments) * 100;
                    const paidAmount = loan.paidInstallments * loan.installmentVal;
                    const remainingAmount = Math.max(0, loan.amountTotal - paidAmount);

                    return (
                      <div key={loan.id} className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-6 shadow-xl text-left">
                        
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase text-indigo-400 rounded">Ativo</span>
                              <button
                                onClick={() => handleEditLoanClick(loan)}
                                className="p-1 text-slate-400 hover:text-indigo-450 hover:bg-white/5 rounded transition-all"
                                title="Editar Empréstimo"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteLoan(loan.id)}
                                className="p-1 text-slate-400 hover:text-rose-450 hover:bg-rose-500/10 rounded transition-all"
                                title="Excluir Empréstimo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <h3 className="font-bold text-base text-white mt-2">{loan.name}</h3>
                            <span className="text-[10px] text-slate-500 block">Início em {loan.startDate} • Juros {loan.interestRate ? `${loan.interestRate}% a.a.` : "isento"}</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400">
                            <Coins className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Calculations summary row */}
                        <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-4">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Crédito Original</span>
                            <span className="text-sm font-bold text-white">{formatMoney(loan.amountTotal)}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Valor Parcela</span>
                            <span className="text-sm font-bold text-rose-400">{formatMoney(loan.installmentVal)}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Saldo Devedor</span>
                            <span className="text-sm font-bold text-indigo-300">{formatMoney(remainingAmount)}</span>
                          </div>
                        </div>

                        {/* Progress visual indicator */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-400">
                            <span>Parcelas Amortizadas</span>
                            <span>{loan.paidInstallments} de {loan.installments} ({payPct.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${payPct}%` }} />
                          </div>
                        </div>

                        {/* Amortize simulation button */}
                        {loan.paidInstallments < loan.installments ? (
                          <button
                            onClick={() => payLoanInstallmentAction(loan.id)}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2"
                          >
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                            <span>Quitar Próxima Parcela ({loan.paidInstallments + 1}/{loan.installments})</span>
                          </button>
                        ) : (
                          <div className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 mt-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Empréstimo Totalmente Quitado! 🎉</span>
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 5. ROUTINES VIEW CHECKLISTS             */}
          {/* ======================================= */}
          {activeTab === "routines" && (
            <div className="flex flex-col gap-6 animate-slide-up">
              
              {/* GUIA DE ROTINAS FINANCEIRAS */}
              <div className="p-4.5 rounded-2xl bg-[#090b11]/80 border border-indigo-500/10 text-left flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Como funcionam suas Rotinas e Compromissos</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                    As <strong>Rotinas Financeiras</strong> servem como checklists e lembretes recorrentes para as suas obrigações do dia a dia (ex: pagar a conta de luz todo dia 10, transferir saldo para a poupança todo início de semana, etc.).
                    Você pode atribuir um **valor previsto** e uma **prioridade** (Alta, Média ou Baixa). 
                    Marcar uma tarefa como concluída sinaliza o seu progresso no mês sem necessariamente alterar o saldo de débito das suas contas principais (a menos que você decida registrar um fluxo real!).
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-400">Rotinas Financeiras</h3>
                  <p className="text-[10px] text-slate-500">Lembretes recorrentes e tarefas organizadoras</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setRoutineName("");
                    setRoutineDesc("");
                    setRoutineAmount("");
                    setIsRoutineModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus className="w-4.5 h-4.5" /> Criar Nova Rotina
                </button>
              </div>

              {/* Checklist feed */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-xl text-left">
                <div className="p-4 bg-slate-950 border-b border-white/5 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Lista de Compromissos de Rotina</span>
                  <span>Clique para marcar como concluído</span>
                </div>

                <div className="divide-y divide-white/5 flex flex-col">
                  {routines.length === 0 ? (
                    <div className="text-center py-12 px-6 flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="max-w-md">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nenhuma rotina agendada ainda!</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                          Crie lembretes de despesas ou tarefas recorrentes. Isso ajuda você a manter as contas sob controle e marcar as obrigações como quitadas com facilidade no início do mês!
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setRoutineName("");
                          setRoutineDesc("");
                          setRoutineAmount("");
                          setIsRoutineModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow shadow-indigo-500/20"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agendar Minha Primeira Rotina
                      </button>
                    </div>
                  ) : (
                    routines.map(rot => (
                      <div 
                        key={rot.id} 
                        className={`p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all group ${
                          rot.status === "COMPLETED" ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleRoutineStatus(rot.id)}
                            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                          >
                            {rot.status === "COMPLETED" ? (
                              <CheckSquare className="w-5.5 h-5.5 text-emerald-400" />
                            ) : (
                              <Square className="w-5.5 h-5.5 text-slate-600" />
                            )}
                          </button>

                          <div>
                            <span className={`text-sm font-bold block ${
                              rot.status === "COMPLETED" ? "line-through text-slate-500" : "text-white"
                            }`}>{rot.name}</span>
                            
                            <div className="flex items-center gap-2 mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                                rot.priority === "HIGH" 
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                                  : rot.priority === "MEDIUM" 
                                  ? "bg-warning/10 text-warning border border-warning/20" 
                                  : "bg-slate-800 text-slate-400"
                              }`}>{rot.priority}</span>
                              <span>•</span>
                              <span>{rot.frequency}</span>
                              {rot.description && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-400 truncate max-w-xs capitalize">{rot.description}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {rot.amount && (
                            <span className={`text-xs font-extrabold mr-2.5 ${rot.status === "COMPLETED" ? "line-through text-slate-500" : "text-rose-400"}`}>
                              {formatMoney(rot.amount)}
                            </span>
                          )}
                          <button 
                            onClick={() => handleEditRoutineClick(rot)}
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-450 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                            title="Editar Rotina"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteRoutine(rot.id)}
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                            title="Excluir Rotina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 6. GOALS VIEW & CONTRIBUTIONS           */}
          {/* ======================================= */}
          {activeTab === "goals" && (
            <div className="flex flex-col gap-8 animate-slide-up">
              
              {/* GUIA DE METAS FINANCEIRAS */}
              <div className="p-4.5 rounded-2xl bg-[#090b11]/80 border border-indigo-500/10 text-left flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Como gerenciar suas Metas e Sonhos</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                    As <strong>Metas Financeiras</strong> ajudam você a economizar dinheiro com propósito. 
                    Seja para criar sua **Reserva de Emergência**, planejar uma **Viagem** ou comprar um bem, você estipula um **Valor Alvo** e um **Prazo**.
                    Conforme guarda dinheiro, você faz **Aportes** na meta. O app calcula o percentual de conclusão e quanto falta economizar mensalmente para atingir o objetivo a tempo!
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-400">Metas Financeiras</h3>
                  <p className="text-[10px] text-slate-500">Guarde dinheiro para objetivos específicos</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setGoalName("");
                    setGoalTarget("");
                    setGoalDeadline("");
                    setIsGoalModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus className="w-4.5 h-4.5" /> Adicionar Objetivo
                </button>
              </div>

              {/* Goals show list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.length === 0 ? (
                  <div className="md:col-span-2 text-center py-12 px-6 flex flex-col items-center gap-4 border border-white/5 rounded-2xl bg-[#090b11]/60">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="max-w-md">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nenhuma meta ativa definida!</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Defina objetivos financeiros de curto, médio ou longo prazo. Defina o valor necessário e acompanhe seu progresso de poupança passo a passo de forma extremamente visual!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setGoalName("");
                        setGoalTarget("");
                        setGoalDeadline("");
                        setIsGoalModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow shadow-indigo-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Primeira Meta
                    </button>
                  </div>
                ) : (
                  goals.map(goal => {
                    const pct = goal.targetVal > 0 ? (goal.currentVal / goal.targetVal) * 100 : 0;
                    const remains = Math.max(0, goal.targetVal - goal.currentVal);

                    return (
                      <div key={goal.id} className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-5 shadow-xl relative overflow-hidden text-left">
                        
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-wider">
                              {goal.category === "EMERGENCY_FUND" ? "Reserva" : goal.category === "TRAVEL" ? "Viagem" : "Investimento"}
                            </span>
                            <h3 className="font-bold text-base text-white mt-2.5">{goal.name}</h3>
                            <span className="text-[10px] text-slate-500 block">Prazo-Alvo: {goal.deadline}</span>
                          </div>
                          
                          {/* Radial glowing progress ring */}
                          <div className="w-14 h-14 relative flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="28" cy="28" r="23" stroke="rgba(255,255,255,0.02)" strokeWidth="4.5" fill="none" />
                              <circle 
                                cx="28" 
                                cy="28" 
                                r="23" 
                                stroke="#6366f1" 
                                strokeWidth="4.5" 
                                fill="none" 
                                strokeDasharray="144"
                                strokeDashoffset={144 - (144 * Math.min(100, pct)) / 100}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute text-[10px] font-black text-white">{pct.toFixed(0)}%</span>
                          </div>
                        </div>

                        {/* Amount values */}
                        <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">Acumulado</span>
                            <span className="text-sm font-black text-emerald-400">{formatMoney(goal.currentVal)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">Valor Alvo</span>
                            <span className="text-sm font-black text-white">{formatMoney(goal.targetVal)}</span>
                          </div>
                        </div>

                        {/* Contribution simulation panel */}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-bold">R$</span>
                            <input 
                              type="number" 
                              placeholder="Valor do aporte"
                              value={contribAmount[goal.id] || ""}
                              onChange={(e) => setContribAmount({ ...contribAmount, [goal.id]: e.target.value })}
                              className="w-full form-input pl-8 pr-3 text-xs py-2"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const amt = parseFloat(contribAmount[goal.id]);
                              if (!amt || isNaN(amt)) return;
                              contributeToGoal(goal.id, amt);
                              setContribAmount({ ...contribAmount, [goal.id]: "" });
                            }}
                            className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow transition-all shrink-0 cursor-pointer"
                          >
                            Depositar
                          </button>
                        </div>

                        {/* Recommendation tooltip box */}
                        {pct < 100 && (
                          <div className="p-3 rounded-xl bg-indigo-950/15 border border-indigo-500/10 text-[10px] text-slate-400 flex items-start gap-2">
                            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                            <p>Faltam <span className="text-white font-bold">{formatMoney(remains)}</span>. Economizando <span className="text-indigo-400 font-bold">{formatMoney(remains / 6)}/mês</span> você atinge o objetivo em 6 meses.</p>
                          </div>
                        )}

                        {/* Trash & Edit icons inside header */}
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button 
                            onClick={() => handleEditGoalClick(goal)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded transition-all"
                            title="Editar Meta"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                            title="Remover Meta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 7. REPORTS VIEW DETAILS                */}
          {/* ======================================= */}
          {activeTab === "reports" && (
            <div className="flex flex-col gap-8 animate-slide-up text-left">
              
              {/* Financial comparison banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
                <div>
                  <h3 className="font-bold text-base text-white">Balanço do Mês de Maio</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-lg">
                    Parabéns, você fechou o mês no azul! Suas receitas superaram suas despesas em <span className="text-emerald-400 font-bold">{formatMoney(Math.max(0, totalReceived - totalSpent))}</span>, resultando em uma taxa de poupança saudável.
                  </p>
                </div>
                
                <div className="flex items-center gap-4 py-2 px-4 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Taxa de Poupança</span>
                  <span className="text-xl font-black text-emerald-400">
                    {totalReceived > 0 ? `${(((totalReceived - totalSpent) / totalReceived) * 100).toFixed(0)}%` : "0%"}
                  </span>
                </div>
              </div>

              {/* Data breakdowns table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Categorized expenses details */}
                <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4">
                  <h4 className="font-bold text-sm text-white">Despesas Consolidadas</h4>
                  <div className="flex flex-col gap-3">
                    {expenseByCategory.length === 0 ? (
                      <div className="text-center text-xs text-slate-500 py-12">Nenhuma despesa para mapear.</div>
                    ) : (
                      expenseByCategory.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between py-2 border-b border-white/3">
                          <span className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                            <span className={`w-2.5 h-2.5 rounded bg-${cat.color}`} />
                            {cat.name}
                          </span>
                          <span className="text-xs font-extrabold text-white">{formatMoney(cat.total)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Simulated future projection estimates */}
                <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between gap-6">
                  <div>
                    <h4 className="font-bold text-sm text-white">Projeção e Simulação de Poupança</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Estimativa de patrimônio com base nas taxas de poupança atuais</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Poupança Mensal Atual</span>
                      <span className="font-bold text-emerald-400">{formatMoney(Math.max(0, totalReceived - totalSpent))}</span>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">Patrimônio projetado em 6 meses</span>
                        <span className="font-black text-white">{formatMoney(totalBalance + (Math.max(0, totalReceived - totalSpent) * 6))}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">Patrimônio projetado em 1 ano</span>
                        <span className="font-black text-white">{formatMoney(totalBalance + (Math.max(0, totalReceived - totalSpent) * 12))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-white/5 rounded-xl text-[10px] text-slate-400 flex items-start gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                    <p>Ao investir essa poupança mensal a uma taxa conservadora de <span className="text-white font-semibold">10.5% ao ano (CDI)</span>, você ganharia aproximadamente <span className="text-emerald-400 font-bold">R$ 1.840,00 adicionais</span> em juros acumulados nos próximos 12 meses!</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 8. OPEN FINANCE PORTAL                  */}
          {/* ======================================= */}
          {activeTab === "openfinance" && (
            <div className="flex flex-col gap-8 animate-slide-up text-left">
              
              <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 rounded-full mb-3.5 uppercase tracking-wide">
                    <Database className="w-3 h-3" /> Integrador Inteligente Banco Central
                  </div>
                  <h3 className="font-extrabold text-base text-white">Sincronização via Open Finance</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    A tecnologia Open Finance permite que você conecte suas contas bancárias brasileiras reais diretamente ao app FINIOY em um ambiente criptografado e regulado pelo Banco Central do Brasil. Importe automaticamente saldos, faturas e despesas de cartão sem precisar digitar nada manual!
                  </p>
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
              </div>

              {/* Connected list */}
              {openFinanceConnections.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Conexões Ativas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {openFinanceConnections.map(conn => (
                      <div key={conn.id} className="p-4 rounded-xl border border-white/5 bg-slate-950/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-white text-xs">
                            {conn.institution.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{conn.institution}</span>
                            <span className="text-[9px] text-slate-500 font-semibold uppercase">Última Sincronização: {conn.lastSynced.substring(11, 16)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black uppercase text-emerald-400 rounded">Sincronizado</span>
                          <button
                            onClick={() => disconnectInstitution(conn.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                            title="Remover Conexão"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Institutions show catalog */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Escolha seu banco para conectar</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[
                    { name: "Nubank", color: "#820ad1", logo: "NU" },
                    { name: "Itaú", color: "#ec7000", logo: "IT" },
                    { name: "Bradesco", color: "#cc092f", logo: "BR" },
                    { name: "Banco do Brasil", color: "#fcf003", logo: "BB" },
                    { name: "Inter", color: "#ff7a00", logo: "IN" },
                    { name: "Santander", color: "#ec0000", logo: "SA" },
                    { name: "C6 Bank", color: "#000000", logo: "C6" },
                    { name: "XP Investimentos", color: "#e3b12d", logo: "XP" }
                  ].map(bank => {
                    const isConnected = openFinanceConnections.some(c => c.institution === bank.name);
                    const isSyncing = syncingBank === bank.name;

                    return (
                      <button
                        key={bank.name}
                        disabled={isConnected || isSyncing}
                        onClick={() => handleConnectInstitutionSimulator(bank.name)}
                        className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-between h-36 relative overflow-hidden transition-all group ${
                          isConnected 
                            ? "bg-emerald-500/5 border-emerald-500/10 opacity-60 cursor-not-allowed" 
                            : isSyncing
                            ? "bg-slate-900 border-white/5 cursor-wait"
                            : "bg-slate-900/40 border-white/5 hover:border-indigo-500/20 hover:bg-slate-900/80 cursor-pointer"
                        }`}
                      >
                        <div 
                          className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-sm"
                          style={{ backgroundColor: bank.color }}
                        >
                          {bank.logo}
                        </div>

                        <div className="mt-4">
                          <span className="font-bold text-xs text-white block">{bank.name}</span>
                          <span className="text-[9px] text-slate-500 mt-0.5 block">Sincronização Fictícia</span>
                        </div>

                        {/* Loading trigger or success checks */}
                        {isSyncing ? (
                          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                            <span className="text-[9px] text-indigo-300 font-bold uppercase">Sincronizando...</span>
                          </div>
                        ) : isConnected ? (
                          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 9. BILLING & SUBSCRIPTIONS             */}
          {/* ======================================= */}
          {activeTab === "billing" && (
            <div className="flex flex-col gap-8 animate-slide-up text-left">
              
              {/* Active Plan Dashboard */}
              <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="text-[9px] uppercase font-bold text-indigo-400 block tracking-widest mb-1.5">Status do Plano</span>
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-xl text-white">
                      {subscription?.planType === "FREE" && "Plano Essential (Gratuito)"}
                      {subscription?.planType === "PREMIUM_MONTHLY" && "Plano Premium Mensal"}
                      {subscription?.planType === "PREMIUM_ANNUAL" && "Plano Premium Anual"}
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 rounded uppercase">Ativo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Renovação agendada em <span className="text-white font-semibold">{subscription?.endDate}</span> por R$ {subscription?.amount.toFixed(2)}/mês.
                  </p>
                </div>

                {subscription?.planType !== "FREE" ? (
                  <button
                    onClick={cancelSubscription}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-300 font-bold text-xs transition-colors"
                  >
                    Cancelar Assinatura
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl text-xs font-bold">Sem cobrança ativa</span>
                )}
              </div>

              {/* Plans Grid */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Alterar ou contratar plano</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monthly Premium */}
                  <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-5 hover:border-indigo-500/20 transition-all">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1.5">Premium Mensal</h4>
                      <p className="text-[10px] text-slate-500">Tenha controle ilimitado, faturas unificadas e suporte VIP.</p>
                      
                      <div className="flex items-baseline gap-1 mt-4">
                        <span className="text-2xl font-extrabold text-white">R$ 19,90</span>
                        <span className="text-slate-500 text-xs">/mês</span>
                      </div>
                    </div>

                    <button
                      onClick={() => subscribeToPlan("PREMIUM_MONTHLY")}
                      disabled={subscription?.planType === "PREMIUM_MONTHLY"}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                        subscription?.planType === "PREMIUM_MONTHLY"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 cursor-not-allowed"
                          : "bg-indigo-500 text-white hover:bg-indigo-600 shadow cursor-pointer"
                      }`}
                    >
                      {subscription?.planType === "PREMIUM_MONTHLY" ? "Plano Ativo" : "Contratar Premium Mensal"}
                    </button>
                  </div>

                  {/* Annual Premium */}
                  <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-5 hover:border-indigo-500/20 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">Premium Anual</h4>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 rounded uppercase">Economia de 25%</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5">Aproveite todos os benefícios premium economizando R$ 60,00.</p>
                      
                      <div className="flex items-baseline gap-1 mt-4">
                        <span className="text-2xl font-extrabold text-white">R$ 149,90</span>
                        <span className="text-slate-500 text-xs">/ano</span>
                      </div>
                    </div>

                    <button
                      onClick={() => subscribeToPlan("PREMIUM_ANNUAL")}
                      disabled={subscription?.planType === "PREMIUM_ANNUAL"}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                        subscription?.planType === "PREMIUM_ANNUAL"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 cursor-not-allowed"
                          : "bg-indigo-500 text-white hover:bg-indigo-600 shadow cursor-pointer"
                      }`}
                    >
                      {subscription?.planType === "PREMIUM_ANNUAL" ? "Plano Ativo" : "Garantir Desconto Anual"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulated Billing History */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Histórico de Cobrança (Notas Fiscais)</h4>
                <div className="rounded-2xl border border-white/5 bg-slate-950/20 divide-y divide-white/5 overflow-hidden">
                  <div className="p-4 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Data</span>
                    <span>Plano Contratado</span>
                    <span>Gateway</span>
                    <span>Status</span>
                    <span>Valor</span>
                  </div>
                  <div className="p-4 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">{subscription?.startDate}</span>
                    <span className="text-white font-bold">{subscription?.planType === "FREE" ? "Essencial Grátis" : "Premium Subscription"}</span>
                    <span className="text-slate-500">FINIOY Gateway</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 rounded">Pago</span>
                    <span className="text-white font-extrabold">R$ {subscription?.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 10. SYSTEM CONFIGS & RESETS             */}
          {/* ======================================= */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-8 animate-slide-up text-left max-w-2xl">
              
              {/* Account Info display */}
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col gap-4">
                <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">Informações Cadastrais (LGPD)</h3>
                
                <div className="grid grid-cols-2 gap-6 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">Nome Completo</span>
                    <span>{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">E-mail Cadastrado</span>
                    <span>{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">CPF Registrado (Seguro)</span>
                    <span className="font-mono">{currentUser.cpf}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">Celular</span>
                    <span>{currentUser.phone || "Não cadastrado"}</span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 bg-[#0e111a] border border-white/5 rounded-xl text-[10px] text-slate-400 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
                  <p>
                    Seu CPF foi registrado de acordo com os termos consentidos na lei Geral de Proteção de Dados (LGPD) em <span className="text-white">{currentUser.lgpdConsentDate || "2026-05-11"}</span>. Ele é mantido criptografado de ponta a ponta e utilizado apenas para processamento de notas fiscais de pagamento.
                  </p>
                </div>
              </div>

              {/* Database reset triggers */}
              <div className="p-6 rounded-2xl bg-rose-950/10 border border-rose-500/10 flex flex-col gap-4">
                <h3 className="font-bold text-sm text-rose-300">Zerar Banco de Dados</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Deseja remover todos os lançamentos de receitas, despesas, cartões, empréstimos e redefinir o app para o estado inicial? Esta operação apagará as informações do `localStorage` do seu navegador de forma definitiva.
                </p>
                <button
                  onClick={resetDatabase}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md w-full sm:w-auto"
                >
                  Confirmar Exclusão e Resetar
                </button>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ======================================= */}
      {/* --- FLOATING DIALOG MODALS INJECTION -- */}
      {/* ======================================= */}

      {/* 1. NEW TRANSACTION FORM MODAL */}
      {isTxModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-base text-white">{editingId ? "Editar Lançamento" : "Lançar Nova Transação"}</h3>
              <button 
                onClick={() => { setIsTxModalOpen(false); setEditingId(null); }}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTxSubmit} className="flex flex-col gap-4">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setTxType("EXPENSE")}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    txType === "EXPENSE" ? "bg-rose-500 text-white shadow" : "text-slate-400"
                  }`}
                >
                  Nova Despesa (Saída)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType("INCOME")}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    txType === "INCOME" ? "bg-emerald-500 text-white shadow" : "text-slate-400"
                  }`}
                >
                  Nova Receita (Entrada)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Descrição *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Supermercado, Aluguel, Salário..."
                    value={txDescription}
                    onChange={(e) => setTxDescription(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Valor (R$) *</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Data *</label>
                  <input 
                    type="date" 
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Categoria *</label>
                  <select 
                    value={txCategoryId}
                    onChange={(e) => setTxCategoryId(e.target.value)}
                    className="form-input text-xs bg-slate-950 text-slate-300"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Forma de Pagamento</label>
                  <select 
                    value={txPaymentMethod}
                    onChange={(e) => setTxPaymentMethod(e.target.value)}
                    className="form-input text-xs bg-slate-950 text-slate-300"
                  >
                    <option value="PIX">PIX</option>
                    <option value="CREDIT_CARD">Cartão de Crédito</option>
                    <option value="DEBIT_CARD">Cartão de Débito</option>
                    <option value="BOLETO">Boleto</option>
                    <option value="CASH">Dinheiro em Espécie</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Conta Vinculada</label>
                  {accounts.length === 0 ? (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 font-bold leading-normal text-left">
                      ⚠️ Nenhuma conta cadastrada! Crie uma conta no painel principal primeiro para poder lançar transações.
                    </div>
                  ) : (
                    <select 
                      value={txAccountId}
                      onChange={(e) => setTxAccountId(e.target.value)}
                      className="form-input text-xs bg-slate-950 text-slate-300"
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.bank})</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Observações</label>
                <textarea 
                  rows={2}
                  placeholder="Informações adicionais..."
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              {/* Simulated attachments */}
              <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-300 block">Comprovante de Lançamento</span>
                  <span className="text-[10px] text-slate-500">
                    {txFileAttached ? txFileAttached : "Nenhum arquivo anexado."}
                  </span>
                </div>
                {!txFileAttached ? (
                  <button 
                    type="button" 
                    onClick={handleSimulateReceipt}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-[10px] font-bold border border-white/5 transition-colors"
                  >
                    Anexar PDF/Foto
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setTxFileAttached(null)}
                    className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition-colors"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <input 
                  type="checkbox" 
                  id="txrecur" 
                  checked={txIsRecurring}
                  onChange={(e) => setTxIsRecurring(e.target.checked)}
                  className="accent-indigo-500 w-3.5 h-3.5 rounded cursor-pointer shrink-0"
                />
                <label htmlFor="txrecur" className="cursor-pointer">Esta é uma transação recorrente</label>
              </div>

              {txIsRecurring && (
                <div className="flex flex-col gap-1.5 p-3.5 bg-slate-950 border border-white/5 rounded-xl animate-slide-down">
                  <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Periodicidade da Recorrência</label>
                  <select 
                    value={txRecurrence}
                    onChange={(e) => setTxRecurrence(e.target.value)}
                    className="form-input text-xs bg-slate-950 text-slate-300"
                  >
                    <option value="MONTHLY">Mensal</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="YEARLY">Anual</option>
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs mt-2 shadow shadow-indigo-500/25"
              >
                {editingId ? "Salvar Alterações" : "Concluir Lançamento"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. CREATE CUSTOM CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-white">Criar Categoria Personalizada</h3>
              <button 
                onClick={() => setIsCatModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Nome da Categoria *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Mercado Livre, Petshop..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Cor Representativa</label>
                <select
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="form-input text-xs bg-slate-950 text-slate-300"
                >
                  <option value="pink-500">Rosa Neon</option>
                  <option value="cyan-500">Ciano Neon</option>
                  <option value="emerald-500">Verde Esmeralda</option>
                  <option value="amber-500">Dourado Amarelo</option>
                  <option value="purple-500">Roxo Púrpura</option>
                  <option value="indigo-500">Azul Indigo</option>
                  <option value="red-500">Vermelho Coral</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Ícone Representativo</label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="form-input text-xs bg-slate-950 text-slate-300"
                >
                  <option value="Sparkles">Estrelas Glow</option>
                  <option value="HeartPulse">Coração Saúde</option>
                  <option value="Car">Carro Transporte</option>
                  <option value="Tv">Televisão Lazer</option>
                  <option value="ShoppingBag">Sacola Compras</option>
                  <option value="Flame">Fogo Tendência</option>
                  <option value="Utensils">Prato Alimentação</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs mt-2"
              >
                Cadastrar Categoria
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. CADASTRAR CARTÃO MODAL */}
      {isCardModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-white">{editingId ? "Editar Cartão de Crédito" : "Cadastrar Cartão de Crédito"}</h3>
              <button 
                onClick={() => { setIsCardModalOpen(false); setEditingId(null); }}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Nome do Cartão *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Ultravioleta, Black Itaú..."
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Banco Emissor *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Nubank, Itaú, Bradesco..."
                  value={cardBank}
                  onChange={(e) => setCardBank(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Dia Fechamento *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="31"
                    value={cardClosingDay}
                    onChange={(e) => setCardClosingDay(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Dia Vencimento *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="31"
                    value={cardDueDay}
                    onChange={(e) => setCardDueDay(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Limite de Crédito Total *</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={cardLimit}
                  onChange={(e) => setCardLimit(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Visual do Cartão (Cor)</label>
                <select
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  className="form-input text-xs bg-slate-950 text-slate-300"
                >
                  <option value="#820ad1">Roxo Nubank</option>
                  <option value="#ec7000">Laranja Itaú</option>
                  <option value="#cc092f">Vermelho Bradesco</option>
                  <option value="#ff7a00">Laranja Inter</option>
                  <option value="#1e293b">Preto Black</option>
                  <option value="#3b82f6">Azul Classic</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs mt-2"
              >
                {editingId ? "Salvar Alterações" : "Salvar Cartão"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADICIONAR COMPRA PARCELADA CARTÃO MODAL */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-white">Lançar Compra no Cartão</h3>
              <button 
                onClick={() => setIsPurchaseModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPurchaseSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Selecione o Cartão *</label>
                <select
                  value={purchaseCardId}
                  onChange={(e) => setPurchaseCardId(e.target.value)}
                  className="form-input text-xs bg-slate-950 text-slate-300"
                >
                  <option value="">Selecione...</option>
                  {creditCards.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Descrição do Estabelecimento *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Amazon, Posto Shell..."
                  value={purchaseDesc}
                  onChange={(e) => setPurchaseDesc(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Valor da Compra (R$) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={purchaseAmt}
                    onChange={(e) => setPurchaseAmt(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Parcelamento *</label>
                  <select
                    value={purchaseInst}
                    onChange={(e) => setPurchaseInst(e.target.value)}
                    className="form-input text-xs bg-slate-950 text-slate-300"
                  >
                    <option value="1">À Vista</option>
                    <option value="2">2x sem juros</option>
                    <option value="3">3x sem juros</option>
                    <option value="4">4x sem juros</option>
                    <option value="5">5x sem juros</option>
                    <option value="10">10x sem juros</option>
                    <option value="12">12x sem juros</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs mt-2"
              >
                Autorizar Transação
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. NOVO EMPRÉSTIMO MODAL */}
      {isLoanModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-white">{editingId ? "Editar Empréstimo" : "Adicionar Empréstimo Ativo"}</h3>
              <button 
                onClick={() => { setIsLoanModalOpen(false); setEditingId(null); }}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLoanSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Nome do Empréstimo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Financiamento Carro, BB CDC..."
                  value={loanName}
                  onChange={(e) => setLoanName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Valor Contratado Original (R$) *</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Total Parcelas *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="12"
                    value={loanInstallments}
                    onChange={(e) => setLoanInstallments(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Valor de Cada Parcela (R$) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={loanInstallmentVal}
                    onChange={(e) => setLoanInstallmentVal(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Taxa de Juros Anual (%, Opcional)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="8.5"
                  value={loanInterest}
                  onChange={(e) => setLoanInterest(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs mt-2"
              >
                {editingId ? "Salvar Alterações" : "Habilitar Contrato"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. NOVA ROTINA MODAL */}
      {isRoutineModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-white">{editingId ? "Editar Compromisso de Rotina" : "Criar Compromisso de Rotina"}</h3>
              <button 
                onClick={() => { setIsRoutineModalOpen(false); setEditingId(null); }}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoutineSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Nome do Compromisso *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Pagar energia, Guardar dinheiro..."
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Descrição Opcional</label>
                <input 
                  type="text" 
                  placeholder="Informações breves..."
                  value={routineDesc}
                  onChange={(e) => setRoutineDesc(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Frequência *</label>
                  <select
                    value={routineFreq}
                    onChange={(e) => setRoutineFreq(e.target.value)}
                    className="form-input text-xs bg-slate-950 text-slate-300"
                  >
                    <option value="MONTHLY">Mensal</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="DAILY">Diário</option>
                    <option value="YEARLY">Anual</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Prioridade *</label>
                  <select
                    value={routinePriority}
                    onChange={(e) => setRoutinePriority(e.target.value)}
                    className="form-input text-xs bg-slate-950 text-slate-300"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Valor Previsto (R$, Opcional)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={routineAmount}
                  onChange={(e) => setRoutineAmount(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs mt-2"
              >
                {editingId ? "Salvar Alterações" : "Cadastrar Rotina"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. NOVA META MODAL */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-white">{editingId ? "Editar Meta Financeira" : "Criar Nova Meta Financeira"}</h3>
              <button 
                onClick={() => { setIsGoalModalOpen(false); setEditingId(null); }}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Nome do Objetivo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Viagem de Férias, Carro Novo..."
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Valor Alvo (R$) *</label>
                  <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Prazo Estimado *</label>
                <input 
                  type="date" 
                  required
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Categoria do Objetivo</label>
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                className="form-input text-xs bg-slate-950 text-slate-300"
              >
                <option value="EMERGENCY_FUND">Reserva de Emergência</option>
                <option value="TRAVEL">Viagens e Lazer</option>
                <option value="PURCHASE">Compras de Bens</option>
                <option value="DEBT">Quitar Dívidas</option>
                <option value="INVESTMENT">Investimento Geral</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs mt-2"
            >
              {editingId ? "Salvar Alterações" : "Gerar Objetivo"}
            </button>
          </form>
        </div>
      </div>
    )}

    {/* 8. NOVA/EDITAR CONTA BANCÁRIA MODAL */}
    {isAccountModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base text-white">{editingId ? "Editar Conta Bancária" : "Cadastrar Conta Bancária"}</h3>
            <button 
              onClick={() => { setIsAccountModalOpen(false); setEditingId(null); }}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddAccountSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Nome Identificador *</label>
              <input 
                type="text" 
                required
                placeholder="ex: Conta Principal, Saldo Poupança..."
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Instituição Financeira / Banco *</label>
              <input 
                type="text" 
                required
                placeholder="ex: Nubank, Banco do Brasil, Inter..."
                value={accountBank}
                onChange={(e) => setAccountBank(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Saldo Atual (R$) *</label>
              <input 
                type="number" 
                required
                step="0.01"
                placeholder="0.00"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="form-input text-xs"
                disabled={editingId !== null} // Keep original balance unchanged directly or let them change it
              />
              {editingId !== null && (
                <span className="text-[9px] text-slate-500 block leading-normal">
                  Dica: Para ajustar o saldo de uma conta existente com precisão, lance uma transação de receita ou despesa.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Cor Temática da Conta</label>
              <select
                value={accountColor}
                onChange={(e) => setAccountColor(e.target.value)}
                className="form-input text-xs bg-slate-950 text-slate-300"
              >
                <option value="#6366f1">Indigo Moderno</option>
                <option value="#820ad1">Roxo Nubank</option>
                <option value="#ff7a00">Laranja Inter</option>
                <option value="#10b981">Verde Esmeralda</option>
                <option value="#06b6d4">Ciano Cyan</option>
                <option value="#ec4899">Rosa Choque</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs mt-2"
            >
              {editingId ? "Salvar Alterações" : "Salvar Conta"}
            </button>
          </form>
        </div>
      </div>
    )}

    {/* ======================================= */}
    {/* 9. OFX/CSV BANK STATEMENT IMPORT MODAL  */}
    {/* ======================================= */}
    {isImportModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-2xl glass-panel rounded-2xl border border-white/5 p-6 animate-scale-in text-left flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-5 shrink-0 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400 animate-pulse" /> Importador de Extratos Bancários
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Importe arquivos .OFX ou .CSV de forma segura, gratuita e categorizada</p>
            </div>
            <button 
              onClick={() => setIsImportModalOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5 py-1">
            
            {/* Step 1: Destination Account */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">1. Selecione a Conta Destino</label>
              {accounts.length === 0 ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-bold leading-normal">
                  ⚠️ Nenhuma conta cadastrada! Crie uma conta antes de importar extratos.
                </div>
              ) : (
                <select 
                  value={importAccountId}
                  onChange={(e) => setImportAccountId(e.target.value)}
                  className="form-input text-xs bg-slate-950 text-slate-300 w-full"
                >
                  <option value="">-- Escolha uma conta bancária --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.bank}) - Saldo: {formatMoney(acc.balance)}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Step 2: Choose File Area */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">2. Envie o Arquivo do Extrato (.OFX ou .CSV)</label>
              <div className="relative border border-dashed border-white/10 hover:border-emerald-500/30 rounded-2xl bg-slate-950/40 p-6 flex flex-col items-center justify-center text-center group transition-colors">
                <input 
                  type="file" 
                  accept=".ofx,.csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 mb-2 transition-colors" />
                <span className="text-xs font-bold text-white block">
                  {importFileName ? importFileName : "Clique aqui ou arraste o arquivo de extrato"}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">Aceita arquivos exportados do seu app do banco</span>
              </div>
            </div>

            {/* Error alerts */}
            {importError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-bold leading-normal">
                {importError}
              </div>
            )}

            {/* Step 3: Parsed List Table */}
            {parsedTransactions.length > 0 && (
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                    3. Confirme os Lançamentos e Organize ({selectedImportIndexes.length} de {parsedTransactions.length} selecionados)
                  </label>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      if (selectedImportIndexes.length === parsedTransactions.length) {
                        setSelectedImportIndexes([]);
                      } else {
                        setSelectedImportIndexes(parsedTransactions.map((_, i) => i));
                      }
                    }}
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer bg-transparent border-0"
                  >
                    {selectedImportIndexes.length === parsedTransactions.length ? "Desmarcar Todos" : "Selecionar Todos"}
                  </button>
                </div>

                <div className="border border-white/5 bg-slate-950 rounded-xl overflow-hidden flex flex-col max-h-60">
                  <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-900 border-b border-white/5 text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">
                    <div className="col-span-1 text-center">Sel</div>
                    <div className="col-span-2">Data</div>
                    <div className="col-span-4">Descrição</div>
                    <div className="col-span-2 text-right">Valor</div>
                    <div className="col-span-3">Categoria</div>
                  </div>

                  <div className="overflow-y-auto divide-y divide-white/5 text-xs flex flex-col">
                    {parsedTransactions.map((tx, idx) => {
                      const isSelected = selectedImportIndexes.includes(idx);
                      return (
                        <div 
                          key={idx} 
                          className={`grid grid-cols-12 gap-2 items-center p-2.5 transition-colors ${
                            isSelected ? "bg-white/[0.01]" : "opacity-40"
                          }`}
                        >
                          {/* Checkbox */}
                          <div className="col-span-1 flex items-center justify-center">
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  setSelectedImportIndexes(selectedImportIndexes.filter(i => i !== idx));
                                } else {
                                  setSelectedImportIndexes([...selectedImportIndexes, idx]);
                                }
                              }}
                              className="accent-emerald-500 w-3.5 h-3.5 rounded cursor-pointer"
                            />
                          </div>

                          {/* Date */}
                          <div className="col-span-2 text-[10px] font-bold text-slate-400">
                            {tx.date}
                          </div>

                          {/* Description */}
                          <div className="col-span-4 font-semibold text-white truncate text-left" title={tx.description}>
                            <input 
                              type="text"
                              value={tx.description}
                              onChange={(e) => {
                                const val = e.target.value;
                                setParsedTransactions(prev => prev.map((item, i) => i === idx ? { ...item, description: val } : item));
                              }}
                              className="bg-transparent border-0 p-0 text-xs font-semibold text-white focus:ring-0 focus:outline-none w-full border-b border-dashed border-white/10 hover:border-white/30"
                            />
                          </div>

                          {/* Amount */}
                          <div className={`col-span-2 text-right font-bold ${
                            tx.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {formatMoney(tx.amount)}
                          </div>

                          {/* Category select dropdown */}
                          <div className="col-span-3">
                            <select
                              value={tx.categoryId}
                              onChange={(e) => {
                                const val = e.target.value;
                                setParsedTransactions(prev => prev.map((item, i) => i === idx ? { ...item, categoryId: val } : item));
                              }}
                              className="w-full bg-slate-900 border border-white/5 rounded-lg text-[10px] font-bold text-slate-300 py-1 px-1.5 focus:outline-none focus:ring-0"
                            >
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer buttons */}
          <div className="shrink-0 flex items-center justify-end gap-3 border-t border-white/5 pt-4 mt-4">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={confirmImport}
              disabled={!importAccountId || selectedImportIndexes.length === 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer ${
                importAccountId && selectedImportIndexes.length > 0
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4" /> Importar {selectedImportIndexes.length} Lançamento{selectedImportIndexes.length !== 1 ? "s" : ""}
            </button>
          </div>

        </div>
      </div>
    )}

    </div>
  );
}
