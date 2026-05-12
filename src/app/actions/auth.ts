"use server";

import { prisma } from "@/lib/prisma";

interface RegisterInput {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  password?: string;
  lgpdConsent: boolean;
}

/**
 * Cadastra um novo usuário com CPF e termos da LGPD diretamente no Supabase
 */
export async function registerUserAction(input: RegisterInput) {
  try {
    const emailExists = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() }
    });

    if (emailExists) {
      return { success: false, error: "Este e-mail já está cadastrado no sistema!" };
    }

    const cpfExists = await prisma.user.findUnique({
      where: { cpf: input.cpf.replace(/\D/g, "") } // Salva apenas números
    });

    if (cpfExists) {
      return { success: false, error: "Este CPF já está cadastrado no sistema!" };
    }

    // Cria o usuário no banco PostgreSQL do Supabase
    const newUser = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase().trim(),
        passwordHash: input.password || "oauth-simulated",
        cpf: input.cpf.replace(/\D/g, ""),
        phone: input.phone || null,
        isPremium: false,
        lgpdConsent: input.lgpdConsent,
        lgpdConsentDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        // Cria categorias padrão iniciais para o usuário
        categories: {
          createMany: {
            data: [
              { name: "Alimentação", color: "emerald-500", icon: "Utensils", isCustom: false, createdAt: new Date().toISOString() },
              { name: "Moradia", color: "indigo-500", icon: "Home", isCustom: false, createdAt: new Date().toISOString() },
              { name: "Transporte", color: "cyan-500", icon: "Car", isCustom: false, createdAt: new Date().toISOString() },
              { name: "Lazer", color: "pink-500", icon: "Tv", isCustom: false, createdAt: new Date().toISOString() },
              { name: "Saúde", color: "rose-500", icon: "HeartPulse", isCustom: false, createdAt: new Date().toISOString() },
              { name: "Outros", color: "slate-500", icon: "Sparkles", isCustom: false, createdAt: new Date().toISOString() }
            ]
          }
        },
        // Atribui uma assinatura gratuita inicial
        subscriptions: {
          create: {
            planType: "FREE",
            status: "ACTIVE",
            amount: 0.00,
            startDate: new Date().toISOString().split("T")[0],
            endDate: "2036-05-11", // 10 anos de validade padrão
            createdAt: new Date().toISOString().split("T")[0]
          }
        }
      }
    });

    return { success: true, data: newUser };
  } catch (err: any) {
    console.error("Erro no registerUserAction:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Verifica se um usuário com o respectivo e-mail existe e simula o login no Supabase
 */
export async function loginUserAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        accounts: true,
        subscriptions: true
      }
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado! Por favor, faça seu cadastro." };
    }

    return { success: true, data: user };
  } catch (err: any) {
    console.error("Erro no loginUserAction:", err);
    return { success: false, error: err.message };
  }
}
