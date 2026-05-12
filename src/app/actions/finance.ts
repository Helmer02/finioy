"use server";

import { prisma } from "@/lib/prisma";

/**
 * Carrega todos os dados financeiros de um usuário diretamente do Supabase/Prisma
 */
export async function getUserData(userId: string) {
  try {
    const [
      accounts,
      categories,
      transactions,
      creditCards,
      loans,
      routines,
      goals,
      notifications,
      subscriptions,
      openFinanceConnections
    ] = await Promise.all([
      prisma.account.findMany({ where: { userId } }),
      prisma.category.findMany({ where: { userId } }),
      prisma.transaction.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      prisma.creditCard.findMany({
        where: { userId },
        include: { invoices: { include: { purchases: true } }, purchases: true }
      }),
      prisma.loan.findMany({ where: { userId }, include: { installmentList: true } }),
      prisma.routine.findMany({ where: { userId } }),
      prisma.goal.findMany({ where: { userId } }),
      prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.subscription.findMany({ where: { userId } }),
      prisma.openFinanceConnection.findMany({ where: { userId } })
    ]);

    // Deconstruct and format credit card subelements if needed
    const creditCardInvoices = creditCards.flatMap(c => c.invoices);
    const creditCardPurchases = creditCards.flatMap(c => c.purchases);

    return {
      success: true,
      data: {
        accounts,
        categories,
        transactions,
        creditCards: creditCards.map(({ invoices, purchases, ...rest }) => rest),
        creditCardInvoices,
        creditCardPurchases,
        loans,
        routines,
        goals,
        notifications,
        subscription: subscriptions[0] || null,
        openFinanceConnections
      }
    };
  } catch (err: any) {
    console.error("Erro ao buscar dados do usuário no Supabase:", err);
    return { success: false, error: err.message };
  }
}

// ACCOUNT ACTIONS
export async function createAccountAction(userId: string, account: any) {
  try {
    const res = await prisma.account.create({
      data: {
        id: account.id,
        userId,
        name: account.name,
        bank: account.bank,
        balance: account.balance,
        color: account.color,
        createdAt: account.createdAt || new Date().toISOString().split("T")[0]
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAccountAction(accountId: string, data: any) {
  try {
    const res = await prisma.account.update({
      where: { id: accountId },
      data: {
        name: data.name,
        bank: data.bank,
        balance: data.balance,
        color: data.color
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAccountAction(accountId: string) {
  try {
    await prisma.account.delete({
      where: { id: accountId }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// TRANSACTION ACTIONS
export async function createTransactionAction(userId: string, tx: any) {
  try {
    const res = await prisma.transaction.create({
      data: {
        id: tx.id,
        userId,
        accountId: tx.accountId || null,
        categoryId: tx.categoryId,
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        date: tx.date,
        paymentMethod: tx.paymentMethod,
        isRecurring: tx.isRecurring || false,
        recurrence: tx.recurrence || null,
        receiptUrl: tx.receiptUrl || null,
        notes: tx.notes || null,
        createdAt: tx.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    console.error("Erro ao criar transação no banco:", err);
    return { success: false, error: err.message };
  }
}

export async function updateTransactionAction(txId: string, data: any) {
  try {
    const res = await prisma.transaction.update({
      where: { id: txId },
      data: {
        accountId: data.accountId || null,
        categoryId: data.categoryId,
        description: data.description,
        amount: data.amount,
        type: data.type,
        date: data.date,
        paymentMethod: data.paymentMethod,
        isRecurring: data.isRecurring || false,
        recurrence: data.recurrence || null,
        receiptUrl: data.receiptUrl || null,
        notes: data.notes || null
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTransactionAction(txId: string) {
  try {
    await prisma.transaction.delete({
      where: { id: txId }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// CATEGORY ACTIONS
export async function createCategoryAction(userId: string, cat: any) {
  try {
    const res = await prisma.category.create({
      data: {
        id: cat.id,
        userId,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        isCustom: cat.isCustom || false,
        createdAt: cat.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// CREDIT CARD ACTIONS
export async function createCreditCardAction(userId: string, card: any) {
  try {
    const res = await prisma.creditCard.create({
      data: {
        id: card.id,
        userId,
        name: card.name,
        bank: card.bank,
        limitTotal: card.limitTotal,
        limitAvailable: card.limitAvailable,
        closingDay: card.closingDay,
        dueDay: card.dueDay,
        color: card.color,
        createdAt: card.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateCreditCardAction(cardId: string, data: any) {
  try {
    const res = await prisma.creditCard.update({
      where: { id: cardId },
      data: {
        name: data.name,
        bank: data.bank,
        limitTotal: data.limitTotal,
        limitAvailable: data.limitAvailable,
        closingDay: data.closingDay,
        dueDay: data.dueDay,
        color: data.color
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCreditCardAction(cardId: string) {
  try {
    await prisma.creditCard.delete({
      where: { id: cardId }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// CREDIT CARD PURCHASE ACTIONS
export async function createCreditCardPurchaseAction(purchase: any) {
  try {
    const res = await prisma.creditCardPurchase.create({
      data: {
        id: purchase.id,
        cardId: purchase.cardId,
        invoiceId: purchase.invoiceId || null,
        description: purchase.description,
        amount: purchase.amount,
        date: purchase.date,
        installments: purchase.installments || 1,
        currentInstallment: purchase.currentInstallment || 1,
        createdAt: purchase.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// LOAN ACTIONS
export async function createLoanAction(userId: string, loan: any) {
  try {
    const res = await prisma.loan.create({
      data: {
        id: loan.id,
        userId,
        name: loan.name,
        amountTotal: loan.amountTotal,
        installments: loan.installments,
        installmentVal: loan.installmentVal,
        interestRate: loan.interestRate || null,
        startDate: loan.startDate,
        status: loan.status,
        createdAt: loan.createdAt || new Date().toISOString(),
        installmentList: {
          createMany: {
            data: loan.installmentList.map((inst: any) => ({
              id: inst.id,
              number: inst.number,
              amount: inst.amount,
              dueDate: inst.dueDate,
              status: inst.status,
              paidDate: inst.paidDate || null
            }))
          }
        }
      },
      include: { installmentList: true }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function payLoanInstallmentAction(instId: string, paidDate: string) {
  try {
    const res = await prisma.loanInstallment.update({
      where: { id: instId },
      data: {
        status: "PAID",
        paidDate
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteLoanAction(loanId: string) {
  try {
    await prisma.loan.delete({
      where: { id: loanId }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ROUTINE ACTIONS
export async function createRoutineAction(userId: string, routine: any) {
  try {
    const res = await prisma.routine.create({
      data: {
        id: routine.id,
        userId,
        name: routine.name,
        description: routine.description || null,
        frequency: routine.frequency,
        time: routine.time || null,
        priority: routine.priority,
        notify: routine.notify || true,
        status: routine.status,
        amount: routine.amount || null,
        dueDate: routine.dueDate || null,
        createdAt: routine.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateRoutineAction(routineId: string, data: any) {
  try {
    const res = await prisma.routine.update({
      where: { id: routineId },
      data: {
        name: data.name,
        description: data.description || null,
        frequency: data.frequency,
        time: data.time || null,
        priority: data.priority,
        notify: data.notify !== undefined ? data.notify : true,
        status: data.status,
        amount: data.amount || null,
        dueDate: data.dueDate || null
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteRoutineAction(routineId: string) {
  try {
    await prisma.routine.delete({
      where: { id: routineId }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// GOAL ACTIONS
export async function createGoalAction(userId: string, goal: any) {
  try {
    const res = await prisma.goal.create({
      data: {
        id: goal.id,
        userId,
        name: goal.name,
        targetVal: goal.targetVal,
        currentVal: goal.currentVal || 0.0,
        deadline: goal.deadline,
        category: goal.category,
        createdAt: goal.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateGoalAction(goalId: string, data: any) {
  try {
    const res = await prisma.goal.update({
      where: { id: goalId },
      data: {
        name: data.name,
        targetVal: data.targetVal,
        currentVal: data.currentVal,
        deadline: data.deadline,
        category: data.category
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteGoalAction(goalId: string) {
  try {
    await prisma.goal.delete({
      where: { id: goalId }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// NOTIFICATION ACTIONS
export async function createNotificationAction(userId: string, not: any) {
  try {
    const res = await prisma.notification.create({
      data: {
        id: not.id,
        userId,
        title: not.title,
        message: not.message,
        type: not.type,
        isRead: not.isRead || false,
        createdAt: not.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function markNotificationReadAction(notId: string) {
  try {
    await prisma.notification.update({
      where: { id: notId },
      data: { isRead: true }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function clearNotificationsAction(userId: string) {
  try {
    await prisma.notification.deleteMany({
      where: { userId }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// OPEN FINANCE ACTIONS
export async function createOpenFinanceConnectionAction(userId: string, conn: any) {
  try {
    const res = await prisma.openFinanceConnection.create({
      data: {
        id: conn.id,
        userId,
        institution: conn.institution,
        status: conn.status,
        lastSynced: conn.lastSynced,
        consentId: conn.consentId,
        createdAt: conn.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteOpenFinanceConnectionAction(connId: string) {
  try {
    await prisma.openFinanceConnection.delete({
      where: { id: connId }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// SUBSCRIPTION ACTIONS
export async function updateSubscriptionAction(userId: string, sub: any) {
  try {
    // Delete existing subscription if any to prevent mismatch (1 per user)
    await prisma.subscription.deleteMany({ where: { userId } });

    const res = await prisma.subscription.create({
      data: {
        id: sub.id,
        userId,
        planType: sub.planType,
        status: sub.status,
        amount: sub.amount,
        startDate: sub.startDate,
        endDate: sub.endDate,
        createdAt: sub.createdAt || new Date().toISOString()
      }
    });
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
