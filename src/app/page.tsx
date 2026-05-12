"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Shield, 
  Smartphone, 
  Zap, 
  CreditCard, 
  PieChart, 
  CheckCircle, 
  ArrowRight, 
  Coins, 
  Sparkles,
  Layers,
  ArrowUpRight,
  Database,
  Lock
} from "lucide-react";

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <PieChart className="w-6 h-6 text-indigo-400" />,
      title: "Dashboard Inteligente",
      desc: "Visualize sua saúde financeira em tempo real com gráficos interativos e projeção de saldo futuro."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-cyan-400" />,
      title: "Controle de Cartões",
      desc: "Acompanhe faturas abertas, limite disponível, compras parceladas e alertas de vencimento."
    },
    {
      icon: <Coins className="w-6 h-6 text-emerald-400" />,
      title: "Gestão de Empréstimos",
      desc: "Mantenha o controle de parcelas pagas, juros acumulados e cronogramas de amortização."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Rotinas Financeiras",
      desc: "Crie hábitos com lembretes para pagar contas, poupar e investir no dia e hora certos."
    },
    {
      icon: <Database className="w-6 h-6 text-purple-400" />,
      title: "Open Finance Ready",
      desc: "Estrutura pronta para conectar de forma 100% segura seus bancos, consolidando saldos automaticamente."
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-400" />,
      title: "Segurança de Ponta",
      desc: "Criptografia de nível bancário, total conformidade com a LGPD e privacidade garantida dos seus dados."
    }
  ];

  const plans = [
    {
      name: "Plano Essential",
      price: "R$ 0",
      period: "para sempre",
      desc: "O controle financeiro básico perfeito para quem está começando.",
      features: [
        "Até 2 contas bancárias",
        "Até 1 cartão de crédito cadastrado",
        "Registro de despesas e receitas",
        "Dashboard básico de saldo",
        "Metas de poupança (limite de 1)",
      ],
      premium: false,
      cta: "Começar Grátis",
      link: "/auth?plan=FREE"
    },
    {
      name: "Plano Premium Mensal",
      price: "R$ 19,90",
      period: "por mês",
      desc: "Controle total, relatórios avançados e recursos ilimitados.",
      features: [
        "Contas bancárias ilimitadas",
        "Cartões de crédito ilimitados",
        "Rotinas financeiras automatizadas",
        "Metas ilimitadas com progresso visual",
        "Relatórios e projeções avançadas",
        "Open Finance (conexões mockadas)",
        "Suporte premium 24/7",
        "Push notifications em tempo real"
      ],
      premium: true,
      popular: true,
      cta: "Assinar Premium",
      link: "/auth?plan=PREMIUM_MONTHLY"
    },
    {
      name: "Plano Premium Anual",
      price: "R$ 14,90",
      period: "por mês, cobrado anualmente",
      desc: "Aproveite 25% de desconto e garanta estabilidade financeira a longo prazo.",
      features: [
        "Tudo do plano Premium Mensal",
        "Economia de R$ 60,00 no ano",
        "Acesso antecipado a novas funções",
        "Relatório anual consolidado em PDF",
        "Selo de Assinante Fundador no perfil"
      ],
      premium: true,
      popular: false,
      cta: "Garantir Desconto Anual",
      link: "/auth?plan=PREMIUM_ANNUAL"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090b11]/80 border-b border-white/5 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo-white.png" alt="FINIOY" className="h-8 w-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="font-bold text-xl tracking-wider bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            FIN<span className="text-indigo-400 font-extrabold">IOY</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Funcionalidades</a>
          <a href="#pwa" className="hover:text-cyan-400 transition-colors">Instale o App</a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">Planos</a>
          <a href="#security" className="hover:text-rose-400 transition-colors">Segurança</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/auth" 
            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
          >
            Entrar
          </Link>
          <Link 
            href="/auth" 
            className="text-sm font-bold bg-indigo-500 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02]"
          >
            Começar Grátis
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 lg:px-16 pt-20 pb-32 flex flex-col items-center text-center">
          {/* Decorative gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-300 mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>O APP DE FINANÇAS PESSOAIS MAIS PREMIUM DO BRASIL</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] mb-6">
            Tenha <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">100% de controle</span> da sua vida financeira
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Fugindo de planilhas chatas e apps amadores. FINIOY é o PWA moderno feito para quem quer organizar pagamentos, faturas, metas e rotinas com design nível fintech.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
            <Link 
              href="/auth" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 group"
            >
              Criar minha conta grátis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#pricing" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-all flex items-center justify-center gap-2"
            >
              Conhecer os Planos
            </a>
          </div>

          {/* Premium UI Mockup Card */}
          <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-950/60 p-1.5 shadow-2xl relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000" />
            <div className="relative rounded-xl overflow-hidden bg-[#090b11] border border-white/5">
              {/* Fake Window Header */}
              <div className="bg-slate-950 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="bg-slate-900 px-3 py-1 rounded-md text-[10px] text-slate-500 font-mono tracking-wide">
                  app.finioy.io/dashboard
                </div>
                <div className="w-12" />
              </div>
              
              {/* Fake Dashboard screenshot styled in HTML */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left bg-gradient-to-b from-[#0e111a] to-[#090b11]">
                <div className="md:col-span-2 flex flex-col gap-6">
                  {/* Balance cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Saldo Consolidado</span>
                      <span className="text-2xl font-bold text-white">R$ 20.250,50</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2">
                        <ArrowUpRight className="w-3 h-3" /> +15.2% em relação ao mês anterior
                      </span>
                    </div>
                    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Fatura Atual do Cartão</span>
                      <span className="text-2xl font-bold text-violet-400">R$ 2.149,80</span>
                      <span className="text-[10px] text-slate-400 block mt-2">Fecha em 25 de Maio</span>
                    </div>
                  </div>
                  
                  {/* Dynamic mini-chart */}
                  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-300">Entradas vs Saídas</span>
                      <span className="text-[10px] text-slate-500">Últimos 6 meses</span>
                    </div>
                    <div className="h-28 flex items-end justify-between gap-4 pt-4">
                      {[
                        { income: 60, expense: 40, month: "Dez" },
                        { income: 75, expense: 50, month: "Jan" },
                        { income: 80, expense: 35, month: "Fev" },
                        { income: 65, expense: 45, month: "Mar" },
                        { income: 90, expense: 55, month: "Abr" },
                        { income: 85, expense: 30, month: "Mai" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex justify-center gap-1 h-20 items-end">
                            <div className="w-2.5 bg-emerald-500 rounded-t" style={{ height: `${item.income}%` }} />
                            <div className="w-2.5 bg-indigo-500 rounded-t" style={{ height: `${item.expense}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-500">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right panel mock */}
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block mb-3">Rotinas e Pagamentos</span>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-[11px] text-slate-300 font-medium">Aluguel Apartamento</span>
                        </div>
                        <span className="text-[11px] font-bold text-rose-400">R$ 1.800</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] text-slate-300 font-medium">Salário Recebido</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400">R$ 8.500</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/5 opacity-50">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[11px] text-slate-300 font-medium line-through">Internet Fibra</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">R$ 120</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-400">Meta: Reserva</span>
                      <span className="text-slate-300 font-bold">66%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: "66%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-950 border-y border-white/5 px-6 lg:px-16 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-extrabold text-indigo-400 tracking-widest uppercase block mb-2">Recursos Premium</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">O que faz o FINIOY ser diferente?</h2>
              <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm md:text-base">
                Desenvolvemos o FINIOY combinando uma interface espetacular de fintech com as ferramentas analíticas fundamentais para gerir sua vida financeira de ponta a ponta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col gap-4 hover:border-indigo-500/20 hover:bg-slate-900/60 transition-all duration-300"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    transform: hoveredFeature === idx ? "translateY(-4px)" : "none",
                    boxShadow: hoveredFeature === idx ? "0 10px 30px -10px rgba(99, 102, 241, 0.15)" : "none"
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h3 className="font-bold text-lg text-white">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PWA Installer Showcase */}
        <section id="pwa" className="py-24 px-6 lg:px-16 relative overflow-hidden">
          <div className="absolute top-1/2 left-10 w-[200px] h-[200px] bg-cyan-500/5 rounded-full blur-[80px]" />
          <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-left flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">Instale em segundos no seu celular</h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Por ser um aplicativo PWA (Progressive Web App), o FINIOY não consome gigabytes de memória e pode ser instalado diretamente pelo navegador no seu iPhone ou Android. Sem precisar de lojas de aplicativos, totalmente atualizado, rápido e seguro.
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  No Android: Clique em &ldquo;Adicionar à tela de início&rdquo; no banner inferior.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  No iOS (iPhone): Clique em &ldquo;Compartilhar&rdquo; e depois em &ldquo;Adicionar à Tela de Início&rdquo;.
                </li>
              </ul>
            </div>
            
            <div className="w-64 h-64 rounded-2xl bg-[#090b11] border border-white/5 p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-cyan-500 text-[#090b11] text-[10px] font-black rounded-full uppercase tracking-wider shadow">
                PWA Ativo
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#090b11] stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">FINIOY</h4>
                  <span className="text-[9px] text-cyan-400">Instalável</span>
                </div>
              </div>
              
              <div className="text-center my-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-1 animate-bounce" />
                <span className="text-[10px] text-slate-300 font-bold block">Controle total na ponta dos dedos</span>
              </div>
              
              <button className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                Instalar Aplicativo
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-slate-950 border-t border-white/5 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-extrabold text-emerald-400 tracking-widest uppercase block mb-2">Preços Justos</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Escolha o plano ideal para você</h2>
              <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm md:text-base">
                Comece gratuitamente ou assine nossa versão premium para desbloquear limites ilimitados de cartões, relatórios inteligentes e sincronização fictícia Open Finance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, idx) => (
                <div 
                  key={idx} 
                  className={`p-8 rounded-2xl border flex flex-col justify-between relative transition-all duration-300 ${
                    plan.popular 
                      ? "bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 md:-translate-y-4" 
                      : "bg-slate-900/40 border-white/5 hover:border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-lg shadow-indigo-500/20">
                      Mais Popular ⭐
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-lg text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-xs mb-6 min-h-8">{plan.desc}</p>
                    
                    <div className="flex items-baseline gap-1.5 mb-8">
                      <span className="text-3xl md:text-4xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-slate-400 text-xs">{plan.period}</span>
                    </div>

                    <div className="h-px bg-white/5 mb-8" />

                    <ul className="flex flex-col gap-3.5 mb-10">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 text-left">
                          <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-indigo-400" : "text-emerald-400"}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    href={plan.link} 
                    className={`w-full py-3.5 rounded-xl text-center text-xs font-bold transition-all ${
                      plan.popular 
                        ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 hover:scale-[1.01]" 
                        : "bg-slate-950 text-slate-300 border border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-24 px-6 lg:px-16 relative">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Privacidade de verdade e segurança LGPD</h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Valorizamos o seu sigilo financeiro acima de tudo. Por isso, todas as informações são protegidas e o CPF solicitado no cadastro é utilizado estritamente para fins de faturamento e conformidade tributária. Seus dados nunca são vendidos ou compartilhados. Você possui total controle, consentimento explícito e exclusão de dados com um único clique.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs text-slate-300">
                <Shield className="w-4 h-4 text-emerald-400" />
                Compatível com a LGPD
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs text-slate-300">
                <Shield className="w-4 h-4 text-cyan-400" />
                Criptografia SSL de 256 bits
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs text-slate-300">
                <Shield className="w-4 h-4 text-purple-400" />
                Proteção de dados em nuvem
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-12 px-6 lg:px-16 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#090b11] stroke-[2.5]" />
            </div>
            <span className="font-bold text-slate-300">FINIOY</span>
            <span className="text-slate-600">| © {new Date().getFullYear()} FINIOY Inc.</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Consentimento LGPD</a>
            <span className="px-2.5 py-1 bg-slate-900 border border-white/5 rounded-md text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
              CNPJ: 12.345.678/0001-99
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
