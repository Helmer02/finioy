"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getUserData,
  createAccountAction,
  updateAccountAction,
  deleteAccountAction,
  createTransactionAction,
  updateTransactionAction,
  deleteTransactionAction,
  createCategoryAction,
  createCreditCardAction,
  updateCreditCardAction,
  deleteCreditCardAction,
  createCreditCardPurchaseAction,
  createLoanAction,
  payLoanInstallmentAction as payLoanInstallmentActionCloud,
  deleteLoanAction,
  createRoutineAction,
  updateRoutineAction,
  deleteRoutineAction,
  createGoalAction,
  updateGoalAction,
  deleteGoalAction,
  createNotificationAction,
  markNotificationReadAction,
  clearNotificationsAction,
  createOpenFinanceConnectionAction,
  deleteOpenFinanceConnectionAction,
  updateSubscriptionAction
} from "@/app/actions/finance";

// Types matching the Prisma Schema
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  createdAt: string;
  isPremium: boolean;
  lgpdConsent: boolean;
  lgpdConsentDate?: string;
}

export interface Account {
  id: string;
  name: string;
  bank: string;
  balance: number;
  color: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string; // Lucide icon name
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  accountId?: string | null;
  categoryId: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string; // YYYY-MM-DD
  paymentMethod: "PIX" | "CREDIT_CARD" | "BOLETO" | "DEBIT_CARD" | "CASH";
  isRecurring: boolean;
  recurrence?: "MONTHLY" | "WEEKLY" | "YEARLY" | null;
  receiptUrl?: string | null;
  notes?: string | null;
  status?: "PENDING" | "COMPLETED" | null;
  createdAt: string;
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  limitTotal: number;
  limitAvailable: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

export interface CreditCardInvoice {
  id: string;
  cardId: string;
  month: number;
  year: number;
  amount: number;
  status: "OPEN" | "CLOSED" | "PAID" | "OVERDUE";
  dueDate: string;
}

export interface CreditCardPurchase {
  id: string;
  cardId: string;
  invoiceId?: string;
  description: string;
  amount: number;
  date: string;
  installments: number;
  currentInstallment: number;
  createdAt: string;
}

export interface Loan {
  id: string;
  name: string;
  amountTotal: number;
  installments: number;
  installmentVal: number;
  interestRate?: number;
  startDate: string;
  status: "ACTIVE" | "PAID" | "LATE";
  paidInstallments: number; // calculated or tracked
  installmentList?: any[];
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "YEARLY";
  time?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  notify: boolean;
  status: "PENDING" | "COMPLETED" | "OVERDUE";
  amount?: number;
  dueDate?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetVal: number;
  currentVal: number;
  deadline: string;
  category: "EMERGENCY_FUND" | "TRAVEL" | "PURCHASE" | "DEBT" | "INVESTMENT" | "OTHER";
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "WARNING" | "INFO" | "SUCCESS" | "ALERT";
  isRead: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  planType: "FREE" | "PREMIUM_MONTHLY" | "PREMIUM_ANNUAL";
  status: "ACTIVE" | "PAID" | "PENDING" | "CANCELLED" | "EXPIRED";
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface OpenFinanceConnection {
  id: string;
  institution: string;
  status: "CONNECTED" | "DISCONNECTED" | "PENDING" | "EXPIRED";
  lastSynced: string;
  consentId: string;
  createdAt: string;
}

// Full database interface exported to the App
interface DbContextType {
  currentUser: User | null;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  creditCards: CreditCard[];
  creditCardInvoices: CreditCardInvoice[];
  creditCardPurchases: CreditCardPurchase[];
  loans: Loan[];
  routines: Routine[];
  goals: Goal[];
  notifications: Notification[];
  subscription: Subscription | null;
  openFinanceConnections: OpenFinanceConnection[];
  
  // Auth Operations
  login: (email: string, name?: string, password?: string) => boolean;
  register: (name: string, email: string, cpf: string, phone?: string) => boolean;
  logout: () => void;
  updateUserPremium: (isPremium: boolean) => void;
  
  // Account Operations
  addAccount: (acc: Omit<Account, "id" | "createdAt">) => void;
  editAccount: (id: string, updatedFields: Partial<Omit<Account, "id" | "createdAt">>) => void;
  deleteAccount: (id: string) => void;

  // Transaction CRUD
  addTransaction: (tx: Omit<Transaction, "id" | "createdAt">) => void;
  editTransaction: (id: string, updatedFields: Partial<Omit<Transaction, "id" | "createdAt">>) => void;
  deleteTransaction: (id: string) => void;
  efetivarTransaction: (id: string) => void;
  
  // Category Custom
  addCategory: (cat: Omit<Category, "id" | "isCustom">) => void;
  
  // Credit Card Operations
  addCreditCard: (card: Omit<CreditCard, "id" | "limitAvailable">) => void;
  editCreditCard: (id: string, updatedFields: Partial<Omit<CreditCard, "id" | "limitAvailable">>) => void;
  deleteCreditCard: (id: string) => void;
  addCreditCardPurchase: (purchase: Omit<CreditCardPurchase, "id" | "createdAt">) => void;
  payInvoice: (invoiceId: string) => void;
  
  // Loan Operations
  addLoan: (loan: Omit<Loan, "id" | "paidInstallments">) => void;
  editLoan: (id: string, updatedFields: Partial<Omit<Loan, "id" | "paidInstallments">>) => void;
  deleteLoan: (id: string) => void;
  payLoanInstallmentAction: (loanId: string) => void;
  
  // Routine Operations
  addRoutine: (routine: Omit<Routine, "id" | "createdAt" | "status">) => void;
  editRoutine: (id: string, updatedFields: Partial<Omit<Routine, "id" | "createdAt" | "status">>) => void;
  toggleRoutineStatus: (id: string) => void;
  deleteRoutine: (id: string) => void;
  
  // Goals Operations
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "currentVal">) => void;
  editGoal: (id: string, updatedFields: Partial<Omit<Goal, "id" | "createdAt" | "currentVal">>) => void;
  contributeToGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  
  // Notification Operations
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Open Finance Operations
  connectInstitution: (bankName: string) => void;
  disconnectInstitution: (id: string) => void;
  
  // Subscription Settings
  subscribeToPlan: (plan: "PREMIUM_MONTHLY" | "PREMIUM_ANNUAL") => void;
  cancelSubscription: () => void;
  
  // Global Reset (clear db)
  resetDatabase: () => void;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

// Initial default categories
const defaultCategories: Category[] = [
  { id: "cat-1", name: "Alimentação", color: "emerald-500", icon: "Utensils", isCustom: false },
  { id: "cat-2", name: "Transporte", color: "cyan-500", icon: "Car", isCustom: false },
  { id: "cat-3", name: "Moradia", color: "blue-500", icon: "Home", isCustom: false },
  { id: "cat-4", name: "Saúde", color: "red-500", icon: "HeartPulse", isCustom: false },
  { id: "cat-5", name: "Educação", color: "purple-500", icon: "GraduationCap", isCustom: false },
  { id: "cat-6", name: "Lazer", color: "amber-500", icon: "Sparkles", isCustom: false },
  { id: "cat-7", name: "Assinaturas", color: "pink-500", icon: "Tv", isCustom: false },
  { id: "cat-8", name: "Cartão de crédito", color: "violet-500", icon: "CreditCard", isCustom: false },
  { id: "cat-9", name: "Empréstimos", color: "orange-500", icon: "Coins", isCustom: false },
  { id: "cat-10", name: "Outros", color: "slate-400", icon: "CircleEllipsis", isCustom: false },
];

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [creditCardInvoices, setCreditCardInvoices] = useState<CreditCardInvoice[]>([]);
  const [creditCardPurchases, setCreditCardPurchases] = useState<CreditCardPurchase[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [openFinanceConnections, setOpenFinanceConnections] = useState<OpenFinanceConnection[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("finioy_user");
      const storedAccounts = localStorage.getItem("finioy_accounts");
      const storedCategories = localStorage.getItem("finioy_categories");
      const storedTransactions = localStorage.getItem("finioy_transactions");
      const storedCreditCards = localStorage.getItem("finioy_credit_cards");
      const storedCreditCardInvoices = localStorage.getItem("finioy_credit_card_invoices");
      const storedCreditCardPurchases = localStorage.getItem("finioy_credit_card_purchases");
      const storedLoans = localStorage.getItem("finioy_loans");
      const storedRoutines = localStorage.getItem("finioy_routines");
      const storedGoals = localStorage.getItem("finioy_goals");
      const storedNotifications = localStorage.getItem("finioy_notifications");
      const storedSubscription = localStorage.getItem("finioy_subscription");
      const storedOpenFinance = localStorage.getItem("finioy_open_finance");

      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      
      // Populate defaults if empty (start with clean arrays for real users)
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      } else {
        const initialAccounts: Account[] = [];
        setAccounts(initialAccounts);
        localStorage.setItem("finioy_accounts", JSON.stringify(initialAccounts));
      }

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(defaultCategories);
        localStorage.setItem("finioy_categories", JSON.stringify(defaultCategories));
      }

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        const initialTransactions: Transaction[] = [];
        setTransactions(initialTransactions);
        localStorage.setItem("finioy_transactions", JSON.stringify(initialTransactions));
      }

      if (storedCreditCards) {
        setCreditCards(JSON.parse(storedCreditCards));
      } else {
        const initialCards: CreditCard[] = [];
        setCreditCards(initialCards);
        localStorage.setItem("finioy_credit_cards", JSON.stringify(initialCards));
      }

      if (storedCreditCardInvoices) {
        setCreditCardInvoices(JSON.parse(storedCreditCardInvoices));
      } else {
        const initialInvoices: CreditCardInvoice[] = [];
        setCreditCardInvoices(initialInvoices);
        localStorage.setItem("finioy_credit_card_invoices", JSON.stringify(initialInvoices));
      }

      if (storedCreditCardPurchases) {
        setCreditCardPurchases(JSON.parse(storedCreditCardPurchases));
      } else {
        const initialPurchases: CreditCardPurchase[] = [];
        setCreditCardPurchases(initialPurchases);
        localStorage.setItem("finioy_credit_card_purchases", JSON.stringify(initialPurchases));
      }

      if (storedLoans) {
        setLoans(JSON.parse(storedLoans));
      } else {
        const initialLoans: Loan[] = [];
        setLoans(initialLoans);
        localStorage.setItem("finioy_loans", JSON.stringify(initialLoans));
      }

      if (storedRoutines) {
        setRoutines(JSON.parse(storedRoutines));
      } else {
        const initialRoutines: Routine[] = [];
        setRoutines(initialRoutines);
        localStorage.setItem("finioy_routines", JSON.stringify(initialRoutines));
      }

      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      } else {
        const initialGoals: Goal[] = [];
        setGoals(initialGoals);
        localStorage.setItem("finioy_goals", JSON.stringify(initialGoals));
      }

      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        const initialNotifications: Notification[] = [];
        setNotifications(initialNotifications);
        localStorage.setItem("finioy_notifications", JSON.stringify(initialNotifications));
      }

      if (storedSubscription) {
        setSubscription(JSON.parse(storedSubscription));
      } else {
        const initialSub: Subscription = { id: "sub-1", planType: "FREE", status: "ACTIVE", amount: 0.0, startDate: new Date().toISOString().split("T")[0], endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], createdAt: new Date().toISOString() };
        setSubscription(initialSub);
        localStorage.setItem("finioy_subscription", JSON.stringify(initialSub));
      }

      if (storedOpenFinance) {
        setOpenFinanceConnections(JSON.parse(storedOpenFinance));
      } else {
        const initialOpenFinance: OpenFinanceConnection[] = [];
        setOpenFinanceConnections(initialOpenFinance);
        localStorage.setItem("finioy_open_finance", JSON.stringify(initialOpenFinance));
      }

    } catch (e) {
      console.error("Failed to load local database", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Load cloud data on login / startup from Supabase
  useEffect(() => {
    if (currentUser && currentUser.id) {
      const syncCloud = async () => {
        try {
          const res = await getUserData(currentUser.id);
          if (res.success && res.data) {
            const d = res.data;
            if (d.accounts) {
              setAccounts(d.accounts);
              localStorage.setItem("finioy_accounts", JSON.stringify(d.accounts));
            }
            if (d.categories && d.categories.length > 0) {
              setCategories(d.categories);
              localStorage.setItem("finioy_categories", JSON.stringify(d.categories));
            }
            if (d.transactions) {
              setTransactions(d.transactions as Transaction[]);
              localStorage.setItem("finioy_transactions", JSON.stringify(d.transactions));
            }
            if (d.creditCards) {
              setCreditCards(d.creditCards as CreditCard[]);
              localStorage.setItem("finioy_credit_cards", JSON.stringify(d.creditCards));
            }
            if (d.creditCardInvoices) {
              setCreditCardInvoices(d.creditCardInvoices as any[]);
              localStorage.setItem("finioy_credit_card_invoices", JSON.stringify(d.creditCardInvoices));
            }
            if (d.creditCardPurchases) {
              setCreditCardPurchases(d.creditCardPurchases as CreditCardPurchase[]);
              localStorage.setItem("finioy_credit_card_purchases", JSON.stringify(d.creditCardPurchases));
            }
            if (d.loans) {
              const processedLoans = d.loans.map((l: any) => ({
                ...l,
                paidInstallments: l.installmentList ? l.installmentList.filter((inst: any) => inst.status === "PAID").length : 0
              }));
              setLoans(processedLoans);
              localStorage.setItem("finioy_loans", JSON.stringify(processedLoans));
            }
            if (d.routines) {
              setRoutines(d.routines as any[]);
              localStorage.setItem("finioy_routines", JSON.stringify(d.routines));
            }
            if (d.goals) {
              setGoals(d.goals as Goal[]);
              localStorage.setItem("finioy_goals", JSON.stringify(d.goals));
            }
            if (d.notifications) {
              setNotifications(d.notifications as any[]);
              localStorage.setItem("finioy_notifications", JSON.stringify(d.notifications));
            }
            if (d.subscription) {
              setSubscription(d.subscription as Subscription);
              localStorage.setItem("finioy_subscription", JSON.stringify(d.subscription));
            }
            if (d.openFinanceConnections) {
              setOpenFinanceConnections(d.openFinanceConnections as OpenFinanceConnection[]);
              localStorage.setItem("finioy_open_finance", JSON.stringify(d.openFinanceConnections));
            }
          }
        } catch (e) {
          console.error("Failed to load user cloud data from Supabase:", e);
        }
      };
      syncCloud();
    }
  }, [currentUser]);

  // Sync utilities when states update
  const syncAndSetAccounts = (newAccs: Account[]) => {
    setAccounts(newAccs);
    localStorage.setItem("finioy_accounts", JSON.stringify(newAccs));
  };

  const syncAndSetTransactions = (newTxs: Transaction[]) => {
    setTransactions(newTxs);
    localStorage.setItem("finioy_transactions", JSON.stringify(newTxs));
  };

  const syncAndSetRoutines = (newRots: Routine[]) => {
    setRoutines(newRots);
    localStorage.setItem("finioy_routines", JSON.stringify(newRots));
  };

  const syncAndSetGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem("finioy_goals", JSON.stringify(newGoals));
  };

  const syncAndSetNotifications = (newNots: Notification[]) => {
    setNotifications(newNots);
    localStorage.setItem("finioy_notifications", JSON.stringify(newNots));
  };

  const syncAndSetCreditCards = (newCards: CreditCard[]) => {
    setCreditCards(newCards);
    localStorage.setItem("finioy_credit_cards", JSON.stringify(newCards));
  };

  const syncAndSetCreditCardInvoices = (newInvs: CreditCardInvoice[]) => {
    setCreditCardInvoices(newInvs);
    localStorage.setItem("finioy_credit_card_invoices", JSON.stringify(newInvs));
  };

  const syncAndSetCreditCardPurchases = (newPurchases: CreditCardPurchase[]) => {
    setCreditCardPurchases(newPurchases);
    localStorage.setItem("finioy_credit_card_purchases", JSON.stringify(newPurchases));
  };

  const syncAndSetLoans = (newLoans: Loan[]) => {
    setLoans(newLoans);
    localStorage.setItem("finioy_loans", JSON.stringify(newLoans));
  };

  const syncAndSetOpenFinance = (newOpen: OpenFinanceConnection[]) => {
    setOpenFinanceConnections(newOpen);
    localStorage.setItem("finioy_open_finance", JSON.stringify(newOpen));
  };

  // Auth Operations
  const login = (email: string, name?: string, password?: string) => {
    const formattedEmail = email.toLowerCase().trim();
    const mockUser: User = {
      id: "usr-dev",
      name: name || "Gabriel IOY",
      email: formattedEmail,
      cpf: "123.456.789-00",
      phone: "(11) 98765-4321",
      createdAt: "2026-05-11",
      isPremium: false,
      lgpdConsent: true,
      lgpdConsentDate: "2026-05-11"
    };
    setCurrentUser(mockUser);
    localStorage.setItem("finioy_user", JSON.stringify(mockUser));
    return true;
  };

  const register = (name: string, email: string, cpf: string, phone?: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase().trim(),
      cpf,
      phone,
      createdAt: "2026-05-11",
      isPremium: false,
      lgpdConsent: true,
      lgpdConsentDate: "2026-05-11"
    };
    setCurrentUser(newUser);
    localStorage.setItem("finioy_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("finioy_user");
  };

  const updateUserPremium = (isPremium: boolean) => {
    if (!currentUser) return;
    const updated = { ...currentUser, isPremium };
    setCurrentUser(updated);
    localStorage.setItem("finioy_user", JSON.stringify(updated));
  };

  // Account Actions
  const addAccount = (acc: Omit<Account, "id" | "createdAt">) => {
    const newAcc: Account = {
      ...acc,
      id: "acc-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split("T")[0]
    };
    syncAndSetAccounts([...accounts, newAcc]);
    if (currentUser && currentUser.id) {
      createAccountAction(currentUser.id, newAcc);
    }
  };

  const editAccount = (id: string, updatedFields: Partial<Omit<Account, "id" | "createdAt">>) => {
    const updated = accounts.map(acc => {
      if (acc.id === id) {
        const updatedAcc = { ...acc, ...updatedFields };
        if (currentUser && currentUser.id) {
          updateAccountAction(id, updatedAcc);
        }
        return updatedAcc;
      }
      return acc;
    });
    syncAndSetAccounts(updated);
  };

  const deleteAccount = (id: string) => {
    syncAndSetAccounts(accounts.filter(acc => acc.id !== id));
    if (currentUser && currentUser.id) {
      deleteAccountAction(id);
    }
    // Also clear accountId reference from transactions
    const updatedTxs = transactions.map(tx => {
      if (tx.accountId === id) {
        const { accountId, ...rest } = tx;
        return rest as any;
      }
      return tx;
    });
    syncAndSetTransactions(updatedTxs);
  };

  // Transaction Actions
  const addTransaction = (tx: Omit<Transaction, "id" | "createdAt">) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const isFuture = tx.date > todayStr;
    const resolvedStatus = tx.status || (isFuture ? "PENDING" : "COMPLETED");

    const newTx: Transaction = {
      ...tx,
      status: resolvedStatus,
      id: "tx-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const updatedTxs = [newTx, ...transactions];
    syncAndSetTransactions(updatedTxs);

    if (currentUser && currentUser.id) {
      createTransactionAction(currentUser.id, newTx);
    }

    // Update account balance dynamically ONLY if completed
    if (resolvedStatus === "COMPLETED" && tx.accountId) {
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === tx.accountId) {
          const updatedAcc = {
            ...acc,
            balance: tx.type === "INCOME" ? acc.balance + tx.amount : acc.balance - tx.amount
          };
          if (currentUser && currentUser.id) {
            updateAccountAction(acc.id, updatedAcc);
          }
          return updatedAcc;
        }
        return acc;
      });
      syncAndSetAccounts(updatedAccounts);
    }

    // Add success notification
    const newNotification: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: isFuture ? "Lançamento agendado" : (tx.type === "INCOME" ? "Recebimento registrado" : "Despesa registrada"),
      message: `${tx.description} no valor de R$ ${tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} foi ${isFuture ? "agendado para " + tx.date : "adicionado"}.`,
      type: "SUCCESS",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    syncAndSetNotifications([newNotification, ...notifications]);
    if (currentUser && currentUser.id) {
      createNotificationAction(currentUser.id, newNotification);
    }
  };

  const deleteTransaction = (id: string) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (!txToDelete) return;

    if (currentUser && currentUser.id) {
      deleteTransactionAction(id);
    }

    // Refund/Revert balance ONLY if it was COMPLETED
    if (txToDelete.status === "COMPLETED" && txToDelete.accountId) {
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === txToDelete.accountId) {
          const updatedAcc = {
            ...acc,
            balance: txToDelete.type === "INCOME" ? acc.balance - txToDelete.amount : acc.balance + txToDelete.amount
          };
          if (currentUser && currentUser.id) {
            updateAccountAction(acc.id, updatedAcc);
          }
          return updatedAcc;
        }
        return acc;
      });
      syncAndSetAccounts(updatedAccounts);
    }

    const updatedTxs = transactions.filter(t => t.id !== id);
    syncAndSetTransactions(updatedTxs);
  };

  const editTransaction = (id: string, updatedFields: Partial<Omit<Transaction, "id" | "createdAt">>) => {
    const originalTx = transactions.find(t => t.id === id);
    if (!originalTx) return;

    const todayStr = new Date().toISOString().split("T")[0];

    // We must revert original balance impact ONLY if original was COMPLETED
    let tempAccounts = [...accounts];
    if (originalTx.status === "COMPLETED" && originalTx.accountId) {
      tempAccounts = tempAccounts.map(acc => {
        if (acc.id === originalTx.accountId) {
          const updatedAcc = {
            ...acc,
            balance: originalTx.type === "INCOME" ? acc.balance - originalTx.amount : acc.balance + originalTx.amount
          };
          if (currentUser && currentUser.id) {
            updateAccountAction(acc.id, updatedAcc);
          }
          return updatedAcc;
        }
        return acc;
      });
    }

    // Determine status of updated tx
    const mergedTx = { ...originalTx, ...updatedFields };
    const isFuture = mergedTx.date > todayStr;
    const resolvedStatus = updatedFields.status || (isFuture ? "PENDING" : "COMPLETED");
    const newTx = { ...mergedTx, status: resolvedStatus };

    if (currentUser && currentUser.id) {
      updateTransactionAction(id, newTx);
    }

    // Apply new balance impact ONLY if newTx is COMPLETED
    if (resolvedStatus === "COMPLETED" && newTx.accountId) {
      tempAccounts = tempAccounts.map(acc => {
        if (acc.id === newTx.accountId) {
          const updatedAcc = {
            ...acc,
            balance: newTx.type === "INCOME" ? acc.balance + newTx.amount : acc.balance - newTx.amount
          };
          if (currentUser && currentUser.id) {
            updateAccountAction(acc.id, updatedAcc);
          }
          return updatedAcc;
        }
        return acc;
      });
    }
    syncAndSetAccounts(tempAccounts);

    const updatedTxs = transactions.map(t => {
      if (t.id === id) {
        return newTx;
      }
      return t;
    });
    syncAndSetTransactions(updatedTxs);
  };

  const efetivarTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx || tx.status === "COMPLETED") return;

    // Change date to today's date and set status to COMPLETED
    const todayStr = new Date().toISOString().split("T")[0];
    editTransaction(id, { status: "COMPLETED", date: todayStr });

    // Notification
    const newNotification: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "Lançamento Efetivado",
      message: `O lançamento "${tx.description}" foi efetivado com sucesso e seu saldo foi atualizado.`,
      type: "SUCCESS",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    syncAndSetNotifications([newNotification, ...notifications]);
  };

  // Categories Action
  const addCategory = (cat: Omit<Category, "id" | "isCustom">) => {
    const newCat: Category = {
      ...cat,
      id: "cat-" + Math.random().toString(36).substr(2, 9),
      isCustom: true
    };
    const updatedCats = [...categories, newCat];
    setCategories(updatedCats);
    localStorage.setItem("finioy_categories", JSON.stringify(updatedCats));
    if (currentUser && currentUser.id) {
      createCategoryAction(currentUser.id, newCat);
    }
  };

  // Credit Card Actions
  const addCreditCard = (card: Omit<CreditCard, "id" | "limitAvailable">) => {
    const newCard: CreditCard = {
      ...card,
      id: "card-" + Math.random().toString(36).substr(2, 9),
      limitAvailable: card.limitTotal
    };
    syncAndSetCreditCards([...creditCards, newCard]);
    if (currentUser && currentUser.id) {
      createCreditCardAction(currentUser.id, newCard);
    }

    // Create current invoice
    const newInvoice: CreditCardInvoice = {
      id: "inv-" + Math.random().toString(36).substr(2, 9),
      cardId: newCard.id,
      month: 5,
      year: 2026,
      amount: 0,
      status: "OPEN",
      dueDate: `2026-06-${String(card.dueDay).padStart(2, "0")}`
    };
    syncAndSetCreditCardInvoices([...creditCardInvoices, newInvoice]);
  };

  const addCreditCardPurchase = (purchase: Omit<CreditCardPurchase, "id" | "createdAt">) => {
    const card = creditCards.find(c => c.id === purchase.cardId);
    if (!card) return;

    // Find current OPEN invoice for this card
    let activeInvoice = creditCardInvoices.find(inv => inv.cardId === purchase.cardId && inv.status === "OPEN");
    
    if (!activeInvoice) {
      // Create a default open invoice if none exists
      activeInvoice = {
        id: "inv-" + Math.random().toString(36).substr(2, 9),
        cardId: purchase.cardId,
        month: 5,
        year: 2026,
        amount: 0,
        status: "OPEN",
        dueDate: `2026-06-${String(card.dueDay).padStart(2, "0")}`
      };
      setCreditCardInvoices(prev => [...prev, activeInvoice!]);
    }

    const newPurchase: CreditCardPurchase = {
      ...purchase,
      id: "pur-" + Math.random().toString(36).substr(2, 9),
      invoiceId: activeInvoice.id,
      createdAt: new Date().toISOString()
    };

    // Calculate limit deductions
    const limitDeduction = purchase.amount; // total amount counts against total credit limit
    const updatedCards = creditCards.map(c => {
      if (c.id === purchase.cardId) {
        return {
          ...c,
          limitAvailable: Math.max(0, c.limitAvailable - limitDeduction)
        };
      }
      return c;
    });

    // Update Invoice Amount (the current installment amount goes onto the current open bill)
    const currentInstallmentCost = purchase.amount / purchase.installments;
    const updatedInvoices = creditCardInvoices.map(inv => {
      if (inv.id === activeInvoice!.id) {
        return {
          ...inv,
          amount: inv.amount + currentInstallmentCost
        };
      }
      return inv;
    });

    syncAndSetCreditCards(updatedCards);
    syncAndSetCreditCardInvoices(updatedInvoices);
    syncAndSetCreditCardPurchases([newPurchase, ...creditCardPurchases]);

    if (currentUser && currentUser.id) {
      createCreditCardPurchaseAction(newPurchase);
      const updatedCard = updatedCards.find(c => c.id === purchase.cardId);
      if (updatedCard) {
        updateCreditCardAction(purchase.cardId, updatedCard);
      }
    }

    // Push notification
    const newNot: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "Compra no Cartão Aprovada",
      message: `${purchase.description} no valor de R$ ${purchase.amount.toFixed(2)} aprovado no ${card.name}.`,
      type: "SUCCESS",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    syncAndSetNotifications([newNot, ...notifications]);
    if (currentUser && currentUser.id) {
      createNotificationAction(currentUser.id, newNot);
    }
  };

  const payInvoice = (invoiceId: string) => {
    const invoice = creditCardInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Set invoice to paid
    const updatedInvoices = creditCardInvoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: "PAID" as const };
      }
      return inv;
    });

    // Restore Credit Limit
    const card = creditCards.find(c => c.id === invoice.cardId);
    if (card) {
      const updatedCards = creditCards.map(c => {
        if (c.id === invoice.cardId) {
          // Restore credit of the amount paid
          return {
            ...c,
            limitAvailable: Math.min(c.limitTotal, c.limitAvailable + invoice.amount)
          };
        }
        return c;
      });
      syncAndSetCreditCards(updatedCards);
    }

    // Record a Transaction for the invoice payment
    const invoiceTx: Transaction = {
      id: "tx-" + Math.random().toString(36).substr(2, 9),
      accountId: "acc-1", // default account pays
      categoryId: "cat-8", // credit card payment
      description: `Pagamento Fatura ${card?.name || "Cartão"}`,
      amount: invoice.amount,
      type: "EXPENSE",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "PIX",
      isRecurring: false,
      createdAt: new Date().toISOString()
    };

    // Deduct payment from bank account
    const updatedAccs = accounts.map(acc => {
      if (acc.id === "acc-1") {
        return { ...acc, balance: acc.balance - invoice.amount };
      }
      return acc;
    });

    syncAndSetAccounts(updatedAccs);
    syncAndSetCreditCardInvoices(updatedInvoices);
    syncAndSetTransactions([invoiceTx, ...transactions]);

    // Push success notification
    const newNot: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "Fatura Paga com Sucesso",
      message: `Fatura de R$ ${invoice.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} do cartão ${card?.name} foi paga.`,
      type: "SUCCESS",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    syncAndSetNotifications([newNot, ...notifications]);
  };

  const editCreditCard = (id: string, updatedFields: Partial<Omit<CreditCard, "id" | "limitAvailable">>) => {
    const updated = creditCards.map(c => {
      if (c.id === id) {
        const diffLimit = (updatedFields.limitTotal ?? c.limitTotal) - c.limitTotal;
        const updatedCard = {
          ...c,
          ...updatedFields,
          limitAvailable: Math.max(0, c.limitAvailable + diffLimit)
        };
        if (currentUser && currentUser.id) {
          updateCreditCardAction(id, updatedCard);
        }
        return updatedCard;
      }
      return c;
    });
    syncAndSetCreditCards(updated);
  };

  const deleteCreditCard = (id: string) => {
    syncAndSetCreditCards(creditCards.filter(c => c.id !== id));
    syncAndSetCreditCardInvoices(creditCardInvoices.filter(inv => inv.cardId !== id));
    syncAndSetCreditCardPurchases(creditCardPurchases.filter(pur => pur.cardId !== id));
    if (currentUser && currentUser.id) {
      deleteCreditCardAction(id);
    }
  };

  // Loan Actions
  const addLoan = (loan: Omit<Loan, "id" | "paidInstallments">) => {
    const newId = "loan-" + Math.random().toString(36).substr(2, 9);
    const newLoan: Loan = {
      ...loan,
      id: newId,
      paidInstallments: 0
    };
    syncAndSetLoans([...loans, newLoan]);

    // Generate installments list for Prisma schema and local tracking
    const installmentList = Array.from({ length: loan.installments }).map((_, i) => {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      return {
        id: `inst-${Math.random().toString(36).substr(2, 9)}`,
        number: i + 1,
        amount: loan.installmentVal,
        dueDate: dueDate.toISOString().split("T")[0],
        status: "PENDING"
      };
    });

    if (currentUser && currentUser.id) {
      createLoanAction(currentUser.id, {
        ...newLoan,
        installmentList
      });
    }

    // Simulate deposit in Account
    const updatedAccs = accounts.map(acc => {
      if (acc.id === "acc-1") {
        const updatedAcc = { ...acc, balance: acc.balance + loan.amountTotal };
        if (currentUser && currentUser.id) {
          updateAccountAction(acc.id, updatedAcc);
        }
        return updatedAcc;
      }
      return acc;
    });
    syncAndSetAccounts(updatedAccs);

    // Save transaction
    const loanTx: Transaction = {
      id: "tx-" + Math.random().toString(36).substr(2, 9),
      accountId: "acc-1",
      categoryId: "cat-9", // loan
      description: `Crédito Empréstimo: ${loan.name}`,
      amount: loan.amountTotal,
      type: "INCOME",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "PIX",
      isRecurring: false,
      createdAt: new Date().toISOString()
    };
    syncAndSetTransactions([loanTx, ...transactions]);
    if (currentUser && currentUser.id) {
      createTransactionAction(currentUser.id, loanTx);
    }
  };

  const payLoanInstallmentAction = (loanId: string) => {
    const targetLoan = loans.find(l => l.id === loanId);
    if (!targetLoan || targetLoan.paidInstallments >= targetLoan.installments) return;

    // Increment paid installments
    const nextInstallmentNum = targetLoan.paidInstallments + 1;
    const isFullyPaid = nextInstallmentNum === targetLoan.installments;

    // Find the installment list to update the next PENDING installment in Supabase
    if (currentUser && currentUser.id && targetLoan.installmentList) {
      const nextPendingInst = targetLoan.installmentList.find((inst: any) => inst.status === "PENDING" || inst.status === "PENDING");
      if (nextPendingInst) {
        payLoanInstallmentActionCloud(nextPendingInst.id, new Date().toISOString().split("T")[0]);
      }
    }

    const updatedLoans = loans.map(l => {
      if (l.id === loanId) {
        const updatedInstallments = l.installmentList ? l.installmentList.map((inst: any, idx: number) => {
          if (idx === targetLoan.paidInstallments) {
            return { ...inst, status: "PAID", paidDate: new Date().toISOString().split("T")[0] };
          }
          return inst;
        }) : [];

        return {
          ...l,
          paidInstallments: nextInstallmentNum,
          status: isFullyPaid ? ("PAID" as const) : l.status,
          installmentList: updatedInstallments
        };
      }
      return l;
    });

    // Record expense transaction
    const payTx: Transaction = {
      id: "tx-" + Math.random().toString(36).substr(2, 9),
      accountId: "acc-1",
      categoryId: "cat-9",
      description: `Parcela ${nextInstallmentNum}/${targetLoan.installments} - ${targetLoan.name}`,
      amount: targetLoan.installmentVal,
      type: "EXPENSE",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "BOLETO",
      isRecurring: false,
      createdAt: new Date().toISOString()
    };

    // Deduct from bank
    const updatedAccs = accounts.map(acc => {
      if (acc.id === "acc-1") {
        const updatedAcc = { ...acc, balance: acc.balance - targetLoan.installmentVal };
        if (currentUser && currentUser.id) {
          updateAccountAction(acc.id, updatedAcc);
        }
        return updatedAcc;
      }
      return acc;
    });

    syncAndSetAccounts(updatedAccs);
    syncAndSetLoans(updatedLoans);
    syncAndSetTransactions([payTx, ...transactions]);

    if (currentUser && currentUser.id) {
      createTransactionAction(currentUser.id, payTx);
    }

    // Push Notification
    const newNot: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "Parcela de Empréstimo Paga",
      message: `Parcela ${nextInstallmentNum}/${targetLoan.installments} de R$ ${targetLoan.installmentVal.toFixed(2)} do empréstimo '${targetLoan.name}' paga com sucesso.`,
      type: "SUCCESS",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    syncAndSetNotifications([newNot, ...notifications]);
    if (currentUser && currentUser.id) {
      createNotificationAction(currentUser.id, newNot);
    }
  };

  const editLoan = (id: string, updatedFields: Partial<Omit<Loan, "id" | "paidInstallments">>) => {
    const updated = loans.map(l => {
      if (l.id === id) {
        return { ...l, ...updatedFields };
      }
      return l;
    });
    syncAndSetLoans(updated);
  };

  const deleteLoan = (id: string) => {
    syncAndSetLoans(loans.filter(l => l.id !== id));
    if (currentUser && currentUser.id) {
      deleteLoanAction(id);
    }
  };

  // Routine Actions
  const addRoutine = (routine: Omit<Routine, "id" | "createdAt" | "status">) => {
    const newRoutine: Routine = {
      ...routine,
      id: "rot-" + Math.random().toString(36).substr(2, 9),
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
    syncAndSetRoutines([...routines, newRoutine]);
    if (currentUser && currentUser.id) {
      createRoutineAction(currentUser.id, newRoutine);
    }
  };

  const toggleRoutineStatus = (id: string) => {
    const rot = routines.find(r => r.id === id);
    if (!rot) return;

    const newStatus = rot.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    
    // If it requires a transaction and is marked completed, automatically create a transaction!
    if (newStatus === "COMPLETED" && rot.amount) {
      addTransaction({
        accountId: "acc-1",
        categoryId: rot.name.toLowerCase().includes("salário") ? "cat-10" : "cat-3",
        description: rot.name,
        amount: rot.amount,
        type: rot.name.toLowerCase().includes("salário") || rot.name.toLowerCase().includes("receber") ? "INCOME" : "EXPENSE",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "PIX",
        isRecurring: rot.frequency !== "DAILY",
        recurrence: rot.frequency as any
      });
    }

    const updatedRoutines = routines.map(r => {
      if (r.id === id) {
        const updatedRot = { ...r, status: newStatus as any };
        if (currentUser && currentUser.id) {
          updateRoutineAction(id, updatedRot);
        }
        return updatedRot;
      }
      return r;
    });
    syncAndSetRoutines(updatedRoutines);
  };

  const deleteRoutine = (id: string) => {
    syncAndSetRoutines(routines.filter(r => r.id !== id));
    if (currentUser && currentUser.id) {
      deleteRoutineAction(id);
    }
  };

  const editRoutine = (id: string, updatedFields: Partial<Omit<Routine, "id" | "createdAt" | "status">>) => {
    const updated = routines.map(r => {
      if (r.id === id) {
        const updatedRot = { ...r, ...updatedFields };
        if (currentUser && currentUser.id) {
          updateRoutineAction(id, updatedRot);
        }
        return updatedRot;
      }
      return r;
    });
    syncAndSetRoutines(updated);
  };

  // Goals Actions
  const addGoal = (goal: Omit<Goal, "id" | "createdAt" | "currentVal">) => {
    const newGoal: Goal = {
      ...goal,
      currentVal: 0,
      id: "goal-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    syncAndSetGoals([...goals, newGoal]);
    if (currentUser && currentUser.id) {
      createGoalAction(currentUser.id, newGoal);
    }
  };

  const contributeToGoal = (id: string, amount: number) => {
    const updatedGoals = goals.map(g => {
      if (g.id === id) {
        const newVal = g.currentVal + amount;
        
        // Push info notification
        if (newVal >= g.targetVal) {
          const finishedNot: Notification = {
            id: "not-" + Math.random().toString(36).substr(2, 9),
            title: "Meta Financeira Concluída! 🎉",
            message: `Parabéns! Você alcançou o seu objetivo de R$ ${g.targetVal.toLocaleString("pt-BR")} para a meta '${g.name}'!`,
            type: "SUCCESS",
            isRead: false,
            createdAt: new Date().toISOString()
          };
          syncAndSetNotifications([finishedNot, ...notifications]);
          if (currentUser && currentUser.id) {
            createNotificationAction(currentUser.id, finishedNot);
          }
        }

        const updatedGoal = {
          ...g,
          currentVal: Math.min(g.targetVal, newVal)
        };
        if (currentUser && currentUser.id) {
          updateGoalAction(id, updatedGoal);
        }
        return updatedGoal;
      }
      return g;
    });

    // Record expense as savings/investment transaction
    const target = goals.find(g => g.id === id);
    if (target) {
      const txGoal: Transaction = {
        id: "tx-" + Math.random().toString(36).substr(2, 9),
        accountId: "acc-1",
        categoryId: "cat-10",
        description: `Aporte Meta: ${target.name}`,
        amount,
        type: "EXPENSE",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "PIX",
        isRecurring: false,
        createdAt: new Date().toISOString()
      };

      // Deduct from wallet
      const updatedAccs = accounts.map(acc => {
        if (acc.id === "acc-1") {
          const updatedAcc = { ...acc, balance: acc.balance - amount };
          if (currentUser && currentUser.id) {
            updateAccountAction(acc.id, updatedAcc);
          }
          return updatedAcc;
        }
        return acc;
      });

      syncAndSetAccounts(updatedAccs);
      syncAndSetTransactions([txGoal, ...transactions]);
      if (currentUser && currentUser.id) {
        createTransactionAction(currentUser.id, txGoal);
      }
    }

    syncAndSetGoals(updatedGoals);
  };

  const deleteGoal = (id: string) => {
    syncAndSetGoals(goals.filter(g => g.id !== id));
    if (currentUser && currentUser.id) {
      deleteGoalAction(id);
    }
  };

  const editGoal = (id: string, updatedFields: Partial<Omit<Goal, "id" | "createdAt" | "currentVal">>) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const updatedGoal = { ...g, ...updatedFields };
        if (currentUser && currentUser.id) {
          updateGoalAction(id, updatedGoal);
        }
        return updatedGoal;
      }
      return g;
    });
    syncAndSetGoals(updated);
  };

  // Notifications Actions
  const markNotificationRead = (id: string) => {
    const updated = notifications.map(not => {
      if (not.id === id) {
        return { ...not, isRead: true };
      }
      return not;
    });
    syncAndSetNotifications(updated);
  };

  const clearNotifications = () => {
    syncAndSetNotifications([]);
  };

  // Open Finance Actions
  const connectInstitution = (bankName: string) => {
    const newConnection: OpenFinanceConnection = {
      id: "of-" + Math.random().toString(36).substr(2, 9),
      institution: bankName,
      status: "CONNECTED",
      lastSynced: new Date().toISOString(),
      consentId: "consent-" + Math.random().toString(36).substr(2, 12).toUpperCase(),
      createdAt: new Date().toISOString()
    };
    syncAndSetOpenFinance([...openFinanceConnections, newConnection]);

    // Push notification
    const successNot: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "Banco Conectado via Open Finance",
      message: `Sua conta do ${bankName} foi vinculada com segurança. Seus saldos e transações serão sincronizados.`,
      type: "SUCCESS",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    syncAndSetNotifications([successNot, ...notifications]);

    // Inject dynamic transactions from the connected bank!
    // Simulate finding 2-3 mock transactions from that bank!
    setTimeout(() => {
      const generatedTxs: Transaction[] = [
        {
          id: "tx-of-" + Math.random().toString(36).substr(2, 9),
          accountId: "acc-1",
          categoryId: "cat-1",
          description: `Compra Sincronizada ${bankName} - Starbucks`,
          amount: 28.90,
          type: "EXPENSE",
          date: new Date().toISOString().split("T")[0],
          paymentMethod: "DEBIT_CARD",
          isRecurring: false,
          createdAt: new Date().toISOString()
        },
        {
          id: "tx-of-" + Math.random().toString(36).substr(2, 9),
          accountId: "acc-1",
          categoryId: "cat-6",
          description: `Compra Sincronizada ${bankName} - Cinema Kinoplex`,
          amount: 62.00,
          type: "EXPENSE",
          date: new Date().toISOString().split("T")[0],
          paymentMethod: "CREDIT_CARD",
          isRecurring: false,
          createdAt: new Date().toISOString()
        }
      ];

      // Update balances
      const totalCost = 28.90;
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === "acc-1") {
          return { ...acc, balance: acc.balance - totalCost };
        }
        return acc;
      });

      syncAndSetAccounts(updatedAccounts);
      setTransactions(prev => [...generatedTxs, ...prev]);
    }, 1500);
  };

  const disconnectInstitution = (id: string) => {
    syncAndSetOpenFinance(openFinanceConnections.filter(of => of.id !== id));
  };

  // Subscription Actions
  const subscribeToPlan = (plan: "PREMIUM_MONTHLY" | "PREMIUM_ANNUAL") => {
    const cost = plan === "PREMIUM_MONTHLY" ? 19.90 : 149.90;
    const durationDays = plan === "PREMIUM_MONTHLY" ? 30 : 365;
    
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + durationDays);

    const newSub: Subscription = {
      id: "sub-" + Math.random().toString(36).substr(2, 9),
      planType: plan,
      status: "ACTIVE",
      amount: cost,
      startDate: today.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      createdAt: today.toISOString()
    };

    setSubscription(newSub);
    localStorage.setItem("finioy_subscription", JSON.stringify(newSub));

    updateUserPremium(true);

    const subNot: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title: "Assinatura Ativa! 👑",
      message: `Você agora é um assinante FINIOY Premium! Aproveite controle ilimitado, relatórios avançados e Open Finance.`,
      type: "SUCCESS",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    syncAndSetNotifications([subNot, ...notifications]);
  };

  const cancelSubscription = () => {
    if (!subscription) return;
    const cancelled = {
      ...subscription,
      status: "CANCELLED" as const
    };
    setSubscription(cancelled);
    localStorage.setItem("finioy_subscription", JSON.stringify(cancelled));
    
    updateUserPremium(false);
  };

  // Database Reset helper
  const resetDatabase = () => {
    localStorage.removeItem("finioy_user");
    localStorage.removeItem("finioy_accounts");
    localStorage.removeItem("finioy_transactions");
    localStorage.removeItem("finioy_credit_cards");
    localStorage.removeItem("finioy_credit_card_invoices");
    localStorage.removeItem("finioy_credit_card_purchases");
    localStorage.removeItem("finioy_loans");
    localStorage.removeItem("finioy_routines");
    localStorage.removeItem("finioy_goals");
    localStorage.removeItem("finioy_notifications");
    localStorage.removeItem("finioy_subscription");
    localStorage.removeItem("finioy_open_finance");
    
    // Reload page to re-trigger populating default states
    window.location.reload();
  };

  return (
    <DbContext.Provider value={{
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
      
      login,
      register,
      logout,
      updateUserPremium,
      
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
    }}>
      {isLoaded && children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error("useDb must be used within a DbProvider");
  }
  return context;
};
