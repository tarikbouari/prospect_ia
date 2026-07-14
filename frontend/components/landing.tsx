"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Target,
  Compass,
  PenLine,
  ListChecks,
  FileText,
  Circle,
} from "lucide-react";

/**
 * Solis — Landing page (v3)
 * (Solis est le produit développé par TRB Consulting — TRB n'apparaît
 * qu'en copyright dans le footer)
 * ----------------------------------------------------------------
 * Usage dans page.tsx :
 *
 *   import LandingPage from "@/components/main/LandingPage";
 *
 *   export default function Page() {
 *     return <LandingPage />;
 *   }
 *
 * Polices (app/layout.tsx via next/font) :
 *
 *   import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
 *
 *   const display = Manrope({ subsets: ["latin"], weight: ["700","800"], variable: "--font-display" });
 *   const body = Inter({ subsets: ["latin"], variable: "--font-body" });
 *   const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-mono" });
 *
 * Parti pris : au lieu d'un hero purement textuel, le hero montre un vrai
 * mockup produit (façon dashboard) pour donner une crédibilité "outil", dans
 * l'esprit smith.langchain.com — mais en thème clair. Le titre nomme Solis
 * explicitement et explique l'utilité en une phrase de contexte + une phrase
 * de bénéfice, pas de jargon "agents".
 */

// ---------- Data ----------

interface Pillar {
  name: string;
  description: string;
  icon: React.ElementType;
  available?: boolean;
}

const PILLARS: Pillar[] = [
  {
    name: "Stratégie",
    description: "Vos priorités du jour proposées, et une feuille de route toujours à jour.",
    icon: Compass,
  },
  {
    name: "Prospection",
    description: "Des messages personnalisés générés à partir du site de chaque prospect, prêts à envoyer.",
    icon: Target,
    available: true,
  },
  {
    name: "Contenu",
    description: "Des idées et brouillons de contenu prêts à publier, sans y passer vos soirées.",
    icon: PenLine,
  },
  {
    name: "Organisation",
    description: "Un planning qui s'adapte à vos imprévus, pour garder le cap sans y penser.",
    icon: ListChecks,
  },
  {
    name: "Relation client",
    description: "Devis, factures et relances préparés en un clic, à valider avant envoi.",
    icon: FileText,
  },
];

const TODAY_FEED = [
  { time: "07:30", label: "Priorités du jour proposées" },
  { time: "09:00", label: "12 messages de prospection prêts à envoyer" },
  { time: "12:30", label: "Idée de post LinkedIn prête à publier" },
  { time: "15:00", label: "Planning réorganisé, à valider" },
  { time: "18:00", label: "Facture prête à envoyer" },
];

const WITHOUT_STRUCTURE = [
  "Décider de vos priorités au feeling, chaque matin",
  "Perdre des clients faute d'avoir relancé à temps",
  "Une visibilité qui dépend de vos coups de motivation",
  "Un administratif qui s'accumule en retard",
];

const WITH_STRUCTURE = [
  "Un plan d'action clair, proposé chaque jour",
  "Des messages de prospection prêts en quelques minutes",
  "Des idées de contenu prêtes à publier",
  "Devis et factures préparés en un clic",
];

// ---------- Sub-components ----------

function Nav() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#E2E5EA]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span
          className="text-[16px] font-extrabold text-[#0D1117] tracking-tight"
          style={{ fontFamily: "var(--font-display, 'Manrope', sans-serif)" }}
        >
          Solis
        </span>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#5B6472]">
          <a href="#solution" className="hover:text-[#0D1117] transition-colors">Solution</a>
          <a href="#structure" className="hover:text-[#0D1117] transition-colors">Comment ça marche</a>
          <Link href="/prospect-ia" className="hover:text-[#0D1117] transition-colors">
            Essayer Prospection IA
          </Link>
        </nav>
        <a
          href="#rejoindre"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0D1117] text-white text-sm font-medium px-4 py-2 hover:bg-[#20242C] transition-colors"
        >
          Rejoindre la liste d'attente
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 sm:pt-28">
      <div className="max-w-2xl">
        <h1
          className="text-[#0D1117] text-4xl sm:text-[3.1rem] font-extrabold tracking-tight leading-[1.1]"
          style={{ fontFamily: "var(--font-display, 'Manrope', sans-serif)" }}
        >
          Solis, l'allié qui vous aide à structurer et scaler votre activité en solo.
        </h1>
        <p className="mt-6 text-lg text-[#5B6472] leading-relaxed max-w-xl">
          Chaque jour, Solis vous propose vos priorités, prépare vos messages de
          prospection, vos idées de contenu et vos relances clients. Vous gardez
          la main sur chaque décision — lui vous fait gagner le temps nécessaire
          pour scaler plus vite.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="#rejoindre"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#155EEF] text-white text-sm font-medium px-5 py-3 hover:bg-[#0F4CD1] transition-colors"
          >
            Rejoindre la liste d'attente
            <ArrowRight className="h-4 w-4" size={16} />
          </a>
          <a
            href="#structure"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#E2E5EA] text-[#0D1117] text-sm font-medium px-5 py-3 hover:bg-[#F5F7FA] transition-colors"
          >
            Voir le produit
          </a>
        </div>
      </div>

      {/* Signature — mockup produit façon dashboard */}
      <div className="mt-16 rounded-2xl border border-[#E2E5EA] bg-white shadow-[0_1px_2px_rgba(13,17,23,0.04),0_12px_32px_-16px_rgba(13,17,23,0.12)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2E5EA] bg-[#FAFBFC]">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#E2E5EA]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#E2E5EA]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#E2E5EA]" />
          </div>
          <span
            className="text-xs text-[#8A93A3]"
            style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
          >
            app.solis.co/aujourdhui
          </span>
        </div>

        <div className="flex flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="sm:w-44 border-b sm:border-b-0 sm:border-r border-[#E2E5EA] p-3 flex sm:flex-col gap-1 overflow-x-auto">
            <div className="flex items-center gap-2 rounded-md bg-[#EEF3FF] text-[#155EEF] px-3 py-2 text-sm font-medium whitespace-nowrap">
              <Circle className="h-2 w-2 fill-current" size={8} />
              Aujourd'hui
            </div>
            {PILLARS.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#5B6472] whitespace-nowrap"
              >
                <p.icon className="h-3.5 w-3.5" size={14} />
                {p.name}
              </div>
            ))}
          </div>

          {/* Feed */}
          <div className="flex-1 p-5">
            <p className="text-xs text-[#8A93A3] mb-4 uppercase tracking-wide">Ce que Solis vous a préparé aujourd'hui</p>
            <div className="space-y-3.5">
              {TODAY_FEED.map((item) => (
                <div key={item.time} className="flex items-center gap-3">
                  <span
                    className="text-xs text-[#8A93A3] w-11 shrink-0"
                    style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
                  >
                    {item.time}
                  </span>
                  <div className="h-4 w-4 rounded-full bg-[#12B76A]/10 flex items-center justify-center shrink-0">
                    <Check className="h-2.5 w-2.5 text-[#12B76A]" size={10} />
                  </div>
                  <span className="text-sm text-[#0D1117]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="solution" className="bg-[#F5F7FA] border-y border-[#E2E5EA]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2
          className="text-[#0D1117] text-2xl sm:text-3xl font-extrabold tracking-tight max-w-lg"
          style={{ fontFamily: "var(--font-display, 'Manrope', sans-serif)" }}
        >
          Être seul ne devrait pas vouloir dire improviser.
        </h2>
        <p className="mt-3 text-[#5B6472] max-w-lg">
          Sans structure, chaque journée repart de zéro. Avec une structure, chaque
          journée s'appuie sur la précédente.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white border border-[#E2E5EA] p-6">
            <p className="text-xs font-semibold text-[#8A93A3] mb-4 tracking-wide uppercase">
              Sans structure
            </p>
            <ul className="space-y-3">
              {WITHOUT_STRUCTURE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#5B6472]">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#D8DEE9] mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-white border border-[#155EEF]/20 p-6 ring-1 ring-[#155EEF]/5">
            <p className="text-xs font-semibold text-[#155EEF] mb-4 tracking-wide uppercase">
              Avec une vraie structure
            </p>
            <ul className="space-y-3">
              {WITH_STRUCTURE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#0D1117]">
                  <Check className="h-4 w-4 text-[#155EEF] mt-0.5 shrink-0" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function StructureSection() {
  return (
    <section id="structure" className="max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-lg mb-14">
        <h2
          className="text-[#0D1117] text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ fontFamily: "var(--font-display, 'Manrope', sans-serif)" }}
        >
          5 piliers. Une seule structure.
        </h2>
        <p className="mt-3 text-[#5B6472]">
          Chaque pilier prend en charge une fonction que vous géreriez normalement
          seul, à la main.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PILLARS.map((p) => (
          <div
            key={p.name}
            className="rounded-xl border border-[#E2E5EA] p-6 hover:border-[#155EEF]/30 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-[#F5F7FA] flex items-center justify-center mb-4">
              <p.icon className="h-4 w-4 text-[#155EEF]" size={18} />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-[#0D1117] font-semibold">{p.name}</h3>
              {p.available && (
                <span className="text-[10px] font-semibold text-[#155EEF] bg-[#155EEF]/10 rounded px-1.5 py-0.5">
                  DISPONIBLE
                </span>
              )}
            </div>
            <p className="text-sm text-[#5B6472] mt-2 leading-relaxed">{p.description}</p>
            {p.available && (
              <Link
                href="/prospect-ia"
                className="inline-flex items-center gap-1 text-sm text-[#155EEF] font-medium mt-3 hover:text-[#0F4CD1] transition-colors"
              >
                Essayer maintenant
                <ArrowRight className="h-3.5 w-3.5" size={14} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setSubmitted(true);
    } catch {
      setError("Impossible d'enregistrer votre email pour le moment. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rejoindre" className="bg-[#F5F7FA] border-t border-[#E2E5EA]">
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2
          className="text-[#0D1117] text-3xl sm:text-4xl font-extrabold tracking-tight max-w-lg mx-auto"
          style={{ fontFamily: "var(--font-display, 'Manrope', sans-serif)" }}
        >
          Donnez à votre activité la structure qu'elle mérite.
        </h2>
        <p className="text-[#5B6472] mt-4 max-w-md mx-auto">
          Rejoignez la liste d'attente pour être parmi les premiers à utiliser Solis.
        </p>
        {submitted ? (
          <p className="mt-8 text-[#155EEF] font-medium">Merci — vous êtes sur la liste.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@entreprise.com"
              className="flex-1 rounded-md bg-white border border-[#E2E5EA] px-4 py-3 text-sm text-[#0D1117] placeholder:text-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#155EEF] text-white text-sm font-medium px-5 py-3 hover:bg-[#0F4CD1] transition-colors disabled:opacity-60"
            >
              {loading ? "Envoi..." : "Rejoindre"}
              {!loading && <ArrowRight className="h-4 w-4" size={16} />}
            </button>
          </form>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#8A93A3]">
      <span className="font-semibold text-[#0D1117]">Solis</span>
      <span>© 2026 TRB Consulting — Fait pour les solopreneurs.</span>
    </footer>
  );
}

// ---------- Main component ----------

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Nav />
      <Hero />
      <ProblemSection />
      <StructureSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}