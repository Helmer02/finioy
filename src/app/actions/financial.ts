"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Type Interfaces for Inputs
interface CreateTxInput {
  userId: string;
  accountId?: string;
  categoryId: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  paymentMethod: string;
  isRecurring?: boolean;
  recurrence?: "MONTHLY" | "WEEKLY" | "YEARLY";
  receiptUrl?: string;
  notes?: string;
}

/**
 * Cadastra uma transação diretamente no Supabase via Prisma Client
 */
export async function createTransactionAction(input: CreateTxInput) {
  try {
    const tx = await prisma.transaction.create({
      data: {
        userId: input.userId,
        accountId: input.accountId || null,
        categoryId: input.categoryId,
        description: input.description,
        amount: input.amount,
        type: input.type,
        date: input.date,
        paymentMethod: input.paymentMethod,
        isRecurring: input.isRecurring ?? false,
        recurrence: input.recurrence || null,
        receiptUrl: input.receiptUrl || null,
        notes: input.notes || null,
        createdAt: new Date().toISOString()
      },
    });

    // Se estiver associado a uma conta, atualiza o saldo dela
    if (input.accountId) {
      const multiplier = input.type === "INCOME" ? 1 : -1;
      await prisma.account.update({
        where: { id: input.accountId },
        data: {
          balance: {
            increment: input.amount * multiplier
          }
        }
      });
    }

    revalidatePath("/app");
    return { success: true, data: tx };
  } catch (err: any) {
    console.error("Erro no createTransactionAction:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Deleta uma transação e reverte o saldo da conta correntista
 */
export async function deleteTransactionAction(txId: string) {
  try {
    // 1. Busca a transação antes de deletar para saber o valor e a conta
    const tx = await prisma.transaction.findUnique({
      where: { id: txId }
    });

    if (!tx) {
      return { success: false, error: "Transação não encontrada" };
    }

    // 2. Deleta o registro
    await prisma.transaction.delete({
      where: { id: txId }
    });

    // 3. Reverte o saldo da conta correntista correspondente
    if (tx.accountId) {
      const multiplier = tx.type === "INCOME" ? -1 : 1; // Reversão
      await prisma.account.update({
        where: { id: tx.accountId },
        data: {
          balance: {
            increment: tx.amount * multiplier
          }
        }
      });
    }

    revalidatePath("/app");
    return { success: true };
  } catch (err: any) {
    console.error("Erro no deleteTransactionAction:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Lista as transações de um usuário específico ordenadas por data descrescente
 */
export async function getUserTransactionsAction(userId: string) {
  try {
    const data = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        category: true,
        account: true
      }
    });
    return { success: true, data };
  } catch (err: any) {
    console.error("Erro no getUserTransactionsAction:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Cria ou atualiza uma conexão do Open Finance
 */
export async function connectOpenFinanceAction(userId: string, institution: string) {
  try {
    const conn = await prisma.openFinanceConnection.create({
      data: {
        userId,
        institution,
        status: "CONNECTED",
        lastSynced: new Date().toISOString(),
        consentId: "con-" + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString()
      }
    });

    revalidatePath("/app");
    return { success: true, data: conn };
  } catch (err: any) {
    console.error("Erro no connectOpenFinanceAction:", err);
    return { success: false, error: err.message };
  }
}
