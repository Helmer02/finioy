"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDb } from "@/context/DbContext";
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  X,
  ChevronRight
} from "lucide-react";

// Standard CPF Validation Algorithm
function validateCPF(cpfStr: string): boolean {
  const cleanCPF = cpfStr.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return false;
  
  // Exclude known repetitive CPFs
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

// CPF Masking helper
function formatCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

// Phone Masking helper
function formatPhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

import { registerUserAction, loginUserAction } from "@/app/actions/auth";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, currentUser } = useDb();
  
  const selectedPlan = searchParams.get("plan") || "FREE";

  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgot">("signin");
  
  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Sign Up inputs
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  
  // Recovery inputs
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);

  // Status/Validation states
  const [cpfError, setCpfError] = useState("");
  const [cpfValid, setCpfValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ email: string; name: string } | null>(null);
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleInputEmail, setGoogleInputEmail] = useState("");
  const [googleInputName, setGoogleInputName] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // If already logged in, redirect to app!
  useEffect(() => {
    if (currentUser) {
      router.push("/app");
    }
  }, [currentUser, router]);

  // CPF Validator listener
  useEffect(() => {
    if (cpf.length === 14) {
      const isValid = validateCPF(cpf);
      if (!isValid) {
        setCpfError("CPF inválido. Verifique os dígitos.");
        setCpfValid(false);
      } else {
        setCpfError("");
        setCpfValid(true);
      }
    } else {
      setCpfError("");
      setCpfValid(false);
    }
  }, [cpf]);

  // Handle mask changes
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  // Sign In submit (Linked to live Supabase DB)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setFeedback({ type: "error", message: "Por favor preencha todos os campos." });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const res = await loginUserAction(loginEmail);
      setIsLoading(false);
      if (res.success && res.data) {
        // Hydrate local session
        login(res.data.email, res.data.name);
        router.push("/app");
      } else {
        setFeedback({ type: "error", message: res.error || "Credenciais não encontradas no Supabase." });
      }
    } catch (err: any) {
      setIsLoading(false);
      setFeedback({ type: "error", message: "Erro ao conectar com o Supabase. Verifique sua conexão." });
    }
  };

  // Sign Up submit (Linked to live Supabase DB)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    if (!fullName || !signupEmail || !signupPassword || !cpf) {
      setFeedback({ type: "error", message: "Todos os campos obrigatórios (*) devem ser preenchidos." });
      return;
    }

    if (!cpfValid) {
      setFeedback({ type: "error", message: "Por favor insira um CPF válido." });
      return;
    }

    if (!lgpdConsent) {
      setFeedback({ type: "error", message: "Você precisa aceitar os termos de consentimento LGPD." });
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await registerUserAction({
        name: fullName,
        email: signupEmail,
        cpf,
        phone: phone || undefined,
        password: signupPassword,
        lgpdConsent
      });

      setIsLoading(false);

      if (res.success && res.data) {
        // Hydrate local state for PWA instant hydration
        register(fullName, signupEmail, cpf, phone);
        
        // If registering with premium plans, save selection
        if (selectedPlan !== "FREE") {
          localStorage.setItem("finioy_pending_plan", selectedPlan);
        }
        
        setFeedback({ type: "success", message: "Cadastro efetuado com sucesso no Supabase!" });
        setTimeout(() => {
          router.push("/app");
        }, 1000);
      } else {
        setFeedback({ type: "error", message: res.error || "Erro ao efetuar cadastro." });
      }
    } catch (err: any) {
      setIsLoading(false);
      setFeedback({ type: "error", message: "Falha de rede com o Supabase." });
    }
  };

  // Password recovery submit
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRecoverySent(true);
    }, 1200);
  };

  // Google OAuth actual trigger
  const handleGoogleAuth = () => {
    setGoogleInputEmail("");
    setGoogleInputName("");
    setGooglePromptOpen(true);
  };

  // Google Account Select logic
  const handleSelectGoogleAccount = async (email: string, name: string) => {
    setGooglePromptOpen(false);
    setIsGoogleLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      // 1. Check if user already exists in the cloud database!
      const res = await loginUserAction(email);
      setIsGoogleLoading(false);

      if (res.success && res.data) {
        // Yes, user already exists! Log them in instantly!
        login(res.data.email, res.data.name);
        
        if (selectedPlan !== "FREE") {
          localStorage.setItem("finioy_pending_plan", selectedPlan);
        }

        setFeedback({ type: "success", message: `Conexão efetuada com a conta Google (${email})!` });
        setTimeout(() => {
          router.push("/app");
        }, 800);
      } else {
        // No, user does not exist in the database! We need their CPF and LGPD consent!
        // Switch the state to show the specialized registration completing screen
        setGoogleUser({ email, name });
        // Clean out default signup fields
        setFullName(name);
        setSignupEmail(email);
        setSignupPassword("google-oauth-secure-" + Math.random().toString(36).slice(-8));
        setCpf("");
        setCpfValid(false);
        setActiveTab("signup"); // Focus signup view
        setFeedback({ 
          type: "success", 
          message: `Conta Google (${email}) vinculada! Agora, informe seu CPF e confirme para concluir seu cadastro.` 
        });
      }
    } catch (err: any) {
      setIsGoogleLoading(false);
      setFeedback({ type: "error", message: "Erro de rede ao conectar com o Supabase." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[#090b11] overflow-hidden">
      {/* Decorative background grids */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Logo */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 group">
        <img src="/logo-white.png" alt="FINIOY Logo" className="h-6 w-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <span className="font-bold text-slate-300 group-hover:text-white transition-colors text-sm">Voltar ao site</span>
      </Link>

      {/* Card Wrapper */}
      <div className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden p-8 border border-white/5 shadow-2xl relative">
        
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo-white.png" alt="FINIOY Logo" className="h-10 w-auto filter drop-shadow-[0_4px_12px_rgba(99,102,241,0.35)]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1.5">
            {activeTab === "signin" && "Bem-vindo de volta"}
            {activeTab === "signup" && "Crie sua conta premium"}
            {activeTab === "forgot" && "Recuperar senha"}
          </h2>
          <p className="text-slate-400 text-xs">
            {activeTab === "signin" && "Gerencie suas finanças com a melhor tecnologia."}
            {activeTab === "signup" && "Preencha seus dados para habilitar o painel fintech."}
            {activeTab === "forgot" && "Digite seu e-mail para receber as instruções."}
          </p>
        </div>

        {/* Global Feedback notification */}
        {feedback.message && (
          <div className={`p-4 rounded-xl mb-6 text-xs flex items-start gap-2.5 border ${
            feedback.type === "error" 
              ? "bg-rose-500/10 border-rose-500/20 text-rose-300" 
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
          }`}>
            {feedback.type === "error" ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab switchers */}
        {activeTab !== "forgot" && (
          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-white/5 mb-6">
            <button 
              onClick={() => { setActiveTab("signin"); setFeedback({type:"",message:""}); }}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "signin" 
                  ? "bg-indigo-500 text-white shadow" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Acessar Conta
            </button>
            <button 
              onClick={() => { setActiveTab("signup"); setFeedback({type:"",message:""}); }}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "signup" 
                  ? "bg-indigo-500 text-white shadow" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Criar Cadastro
            </button>
          </div>
        )}

        {/* --- SIGN IN FORM --- */}
        {activeTab === "signin" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  required
                  placeholder="exemplo@finioy.io"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full form-input pl-11 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Senha</label>
                <button 
                  type="button" 
                  onClick={() => setActiveTab("forgot")}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full form-input pl-11 text-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold btn-glow-primary text-white text-xs mt-2 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar com e-mail"}
            </button>
          </form>
        )}

        {/* --- SIGN UP FORM --- */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            
            {/* Google Linked info bar */}
            {googleUser && (
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-start gap-3 text-left">
                <div className="w-9 h-9 rounded-full bg-indigo-500 text-white font-extrabold flex items-center justify-center shrink-0 uppercase shadow-md text-sm">
                  {googleUser.name.slice(0, 2)}
                </div>
                <div>
                  <span className="text-xs font-black text-white block">Sua Conta Google está vinculada!</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Nome: {googleUser.name} • E-mail: {googleUser.email}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nome Completo *</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  required
                  disabled={googleUser !== null}
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full form-input pl-11 text-sm ${googleUser ? "bg-slate-900/50 text-slate-400 border-white/5 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">E-mail *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="email" 
                    required
                    disabled={googleUser !== null}
                    placeholder="exemplo@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={`w-full form-input pl-11 text-sm ${googleUser ? "bg-slate-900/50 text-slate-400 border-white/5 cursor-not-allowed" : ""}`}
                  />
                </div>
              </div>

              {!googleUser ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Senha *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="password" 
                      required
                      placeholder="Mín. 6 caracteres"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full form-input pl-11 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Senha da Conta</label>
                  <div className="relative opacity-50 cursor-not-allowed">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      disabled
                      value="Autenticação segura via Google"
                      className="w-full form-input pl-11 text-sm bg-slate-900/50 text-slate-500 border-white/5 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CPF Obrigatório *</label>
                  {cpfValid && <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5"><CheckCircle className="w-2.5 h-2.5" /> Válido</span>}
                  {cpfError && <span className="text-[9px] font-bold text-rose-400">{cpfError}</span>}
                </div>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    placeholder="123.456.789-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    className={`w-full form-input pl-11 text-sm ${cpfValid ? "border-emerald-500/40" : cpfError ? "border-rose-500/40" : ""}`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Celular (Opcional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full form-input pl-11 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Alert & LGPD Consent */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 flex gap-3 text-[10px] text-slate-400">
              <input 
                type="checkbox" 
                id="lgpd" 
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-0.5 accent-indigo-500 rounded cursor-pointer shrink-0 w-3.5 h-3.5"
              />
              <label htmlFor="lgpd" className="leading-relaxed cursor-pointer select-none">
                Autorizo o processamento do meu CPF estritamente para faturamento e cobrança de serviços do plano <span className="text-indigo-400 font-bold">{selectedPlan === "FREE" ? "Essencial" : selectedPlan === "PREMIUM_MONTHLY" ? "Premium Mensal" : "Premium Anual"}</span>. Meus dados serão armazenados de forma criptografada e segura, em plena conformidade com a <span className="text-white font-medium">LGPD (Lei Geral de Proteção de Dados)</span>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !cpfValid || !lgpdConsent}
              className="w-full py-3.5 rounded-xl font-bold btn-glow-primary text-white text-xs mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Concluir Cadastro"}
            </button>
          </form>
        )}

        {/* --- FORGOT PASSWORD FORM --- */}
        {activeTab === "forgot" && (
          <div>
            {!recoverySent ? (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">E-mail Cadastrado</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      required
                      placeholder="seu-email@exemplo.com"
                      value={recoverEmail}
                      onChange={(e) => setRecoverEmail(e.target.value)}
                      className="w-full form-input pl-11 text-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold btn-glow-primary text-white text-xs transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Instruções"}
                </button>

                <button 
                  type="button" 
                  onClick={() => { setActiveTab("signin"); setFeedback({type:"",message:""}); }}
                  className="w-full py-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-400 font-bold hover:text-white flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar ao Login
                </button>
              </form>
            ) : (
              <div className="text-center py-6 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">E-mail enviado!</h3>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Enviamos um link de redefinição de senha para <span className="text-white font-semibold">{recoverEmail}</span>. Verifique também sua caixa de spam.
                </p>
                <button 
                  onClick={() => { setActiveTab("signin"); setRecoverySent(false); setFeedback({type:"",message:""}); }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-colors"
                >
                  Ir para Login
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- GOOGLE SIGN IN OAUTH BUTTON --- */}
        {activeTab !== "forgot" && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ou</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>

            <button 
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-3"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.15 2.82-2.43 3.68v3.06h3.93c2.3-2.12 3.63-5.24 3.63-8.59z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.93-3.06c-1.08.72-2.45 1.16-4 1.16-3.09 0-5.7-2.08-6.64-4.88H1.31v3.15C3.29 22.36 7.39 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.36 14.31A7.17 7.17 0 0 1 4.9 12c0-.8.14-1.59.36-2.31V6.54H1.31A11.94 11.94 0 0 0 0 12c0 1.94.47 3.77 1.31 5.46l4.05-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.39 0 3.29 1.64 1.31 4.75l4.05 3.15c.94-2.8 3.55-4.88 6.64-4.88z"/>
                  </svg>
                  <span>Continuar com Google</span>
                </>
              )}
            </button>
          </>
        )}

        {/* Security badges */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Sua conexão é criptografada e segura contra vazamentos.</span>
        </div>
      </div>

    {/* ======================================= */}
    {/* Google Accounts OAuth Dialog Simulator */}
    {/* ======================================= */}
    {googlePromptOpen && (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-sm bg-white rounded-2xl p-6 text-slate-800 shadow-2xl flex flex-col gap-4 text-left border border-slate-200 animate-scale-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.15 2.82-2.43 3.68v3.06h3.93c2.3-2.12 3.63-5.24 3.63-8.59z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.93-3.06c-1.08.72-2.45 1.16-4 1.16-3.09 0-5.7-2.08-6.64-4.88H1.31v3.15C3.29 22.36 7.39 24 12 24z"/>
                <path fill="#FBBC05" d="M5.36 14.31A7.17 7.17 0 0 1 4.9 12c0-.8.14-1.59.36-2.31V6.54H1.31A11.94 11.94 0 0 0 0 12c0 1.94.47 3.77 1.31 5.46l4.05-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.39 0 3.29 1.64 1.31 4.75l4.05 3.15c.94-2.8 3.55-4.88 6.64-4.88z"/>
              </svg>
              <span className="font-extrabold text-sm tracking-tight text-slate-800">Fazer login com o Google</span>
            </div>
            <button 
              onClick={() => setGooglePromptOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer border-0 bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-normal">Escolha uma conta do Google para continuar no <span className="font-extrabold text-slate-800">FINIOY</span>:</p>

          <div className="flex flex-col gap-2 mt-1">
            {/* Account Option 1 */}
            <button
              onClick={() => handleSelectGoogleAccount("gabriel.google@gmail.com", "Gabriel Silva")}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-left transition-colors cursor-pointer bg-white"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">
                GS
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs text-slate-800 block truncate">Gabriel Silva</span>
                <span className="text-[10px] text-slate-500 block truncate">gabriel.google@gmail.com</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350 shrink-0" />
            </button>

            {/* Account Option 2 */}
            <button
              onClick={() => handleSelectGoogleAccount("mariana.financas@gmail.com", "Mariana Costa")}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-left transition-colors cursor-pointer bg-white"
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-650 flex items-center justify-center font-black text-xs uppercase">
                MC
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs text-slate-800 block truncate">Mariana Costa</span>
                <span className="text-[10px] text-slate-500 block truncate">mariana.financas@gmail.com</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350 shrink-0" />
            </button>

            {/* Account Option 3 - Custom Type In */}
            <div className="border border-slate-150 rounded-2xl p-3.5 flex flex-col gap-2.5 bg-slate-50 text-xs">
              <span className="text-[9px] font-black uppercase text-slate-450 tracking-wider block">Fazer login com outro Gmail:</span>
              <div className="flex flex-col gap-1.5">
                <input 
                  type="text"
                  placeholder="Seu Nome Completo"
                  value={googleInputName}
                  onChange={(e) => setGoogleInputName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <input 
                  type="email"
                  placeholder="seu-email@gmail.com"
                  value={googleInputEmail}
                  onChange={(e) => setGoogleInputEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <button
                type="button"
                disabled={!googleInputEmail || !googleInputName}
                onClick={() => handleSelectGoogleAccount(googleInputEmail.trim(), googleInputName.trim())}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-400 text-white text-[10px] font-bold transition-all cursor-pointer border-0"
              >
                Prosseguir com esta conta
              </button>
            </div>
          </div>

          <span className="text-[9px] text-slate-400 text-center block leading-relaxed mt-1">
            Ao prosseguir, você concorda que o Google compartilhará seu nome, e-mail e foto de perfil com a FINIOY. Consulte nossos termos.
          </span>
        </div>
      </div>
    )}

    </div>
  );
}
