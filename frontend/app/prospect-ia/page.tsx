// 
"use client";
import React, { useState } from "react";
import {
  Link2, FileText, Mail, Copy, Check, ArrowRight, ArrowLeft,
  RefreshCw, Loader2, Building2, Send
} from "lucide-react";

const CHANNELS = [
  { id: "linkedin",        label: "LinkedIn",        icon: "💼", desc: "Message court 80 mots, ton professionnel" },
  { id: "email",           label: "Email",           icon: "✉️",  desc: "Format classique avec objet, 150 mots" },
  { id: "instagram",       label: "Instagram DM",    icon: "📸", desc: "Ton décontracté, 60 mots" },
  { id: "plan_commercial", label: "Plan Commercial", icon: "📋", desc: "Format structuré en 5 sections" },
  { id: "twitter",         label: "Twitter / X",     icon: "🐦", desc: "Ultra court, 40 mots" },
];

const STEPS = [
  { id: 1, key: "url",     label: "01_CIBLE" },
  { id: 2, key: "channel", label: "02_CANAL" },
  { id: 3, key: "services",label: "03_OFFRE" },
  { id: 4, key: "result",  label: "04_MESSAGE" },
];

function extractDomain(url: string) {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace("www.", "");
  } catch {
    return "";
  }
}

async function generateMessage({ url, services, channel }: { url: string; services: string; channel: string }){
  const response = await fetch("https://prospect-ia.onrender.com/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, services, channel }),
  });

  const data = await response.json();
if (!response.ok) throw new Error(data.detail || "Erreur serveur");
  return data.message;
}

export default function MainPage() {
  const [step, setStep]           = useState(1);
  const [url, setUrl]             = useState("");
  const [channel, setChannel]     = useState("email");
  const [services, setServices]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [editedMsg, setEditedMsg] = useState("");
  const [copied, setCopied]       = useState(false);
  const [error, setError]         = useState("");

  const domain = extractDomain(url);
  const selectedChannel = CHANNELS.find((c) => c.id === channel);

  const goNext = async () => {
    setError("");

    if (step === 1) {
      if (!domain) { setError("Entrez une URL valide, ex: https://www.exemple.com"); return; }
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!services.trim()) { setError("Décrivez le service que vous proposez."); return; }
      setLoading(true);
      try {
        const msg = await generateMessage({ url, services, channel });
        setResult(msg);
        setEditedMsg(msg);
        setStep(4);
      } catch (e) {
        setError((e as Error).message);
      }finally {
        setLoading(false);
      }
    }
  };

  const goBack = () => { setError(""); if (step > 1) setStep(step - 1); };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const msg = await generateMessage({ url, services, channel });
      setResult(msg);
      setEditedMsg(msg);
    } catch (e) {
      setError("Erreur lors de la régénération.");
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(1); setUrl(""); setChannel("email");
    setServices(""); setResult(null); setEditedMsg(""); setError("");
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-start justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-[#0A1E3F] flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-white" size={18} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#0A1E3F] tracking-tight leading-none">Prospect-IA</p>
            <p className="text-xs text-[#64748B] mt-1 font-mono tracking-wide">GÉNÉRATEUR DE MESSAGES DE PROSPECTION</p>
          </div>
        </div>

        {/* Step tracker */}
        <div className="mb-6">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-[15px] h-px bg-[#E2E8F0]" />
            <div
              className="absolute left-0 top-[15px] h-px bg-[#1E56A0] transition-all duration-500 ease-out"
              style={{ width: step === 1 ? "0%" : step === 2 ? "33%" : step === 3 ? "66%" : "100%" }}
            />
            {STEPS.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 bg-white">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    done ? "bg-[#1E56A0] border-[#1E56A0]" : active ? "bg-white border-[#1E56A0] border-2" : "bg-white border-[#E2E8F0]"
                  }`}>
                    {done
                      ? <Check className="h-4 w-4 text-white" size={16} />
                      : <span className={`text-xs font-mono font-semibold ${active ? "text-[#1E56A0]" : "text-[#94A3B8]"}`}>{s.id}</span>
                    }
                  </div>
                  <span className={`text-[10px] font-mono tracking-wider hidden sm:block ${active || done ? "text-[#0A1E3F]" : "text-[#94A3B8]"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="border border-[#E2E8F0] rounded-xl bg-white shadow-[0_1px_2px_rgba(10,30,63,0.04)]">
          <div className="p-6 sm:p-8">

            {/* Step 1 — URL */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link2 className="h-4 w-4 text-[#1E56A0]" size={16} />
                  <h2 className="text-[#0A1E3F] font-semibold text-lg">Quel est le site du prospect ?</h2>
                </div>
                <p className="text-sm text-[#64748B] mb-5">L'agent va analyser la page pour en extraire le contexte.</p>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.exemple.com"
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-[#0A1E3F] font-mono text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E56A0]/20 focus:border-[#1E56A0] transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && goNext()}
                />
                {domain && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#F1F5F9] px-2.5 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#1E56A0]" />
                    <span className="text-xs font-mono text-[#1E56A0]">{domain}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 2 — Canal */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Send className="h-4 w-4 text-[#1E56A0]" size={16} />
                  <h2 className="text-[#0A1E3F] font-semibold text-lg">Sur quel canal ?</h2>
                </div>
                <p className="text-sm text-[#64748B] mb-5">
                  Le message sera adapté au format et au ton du canal choisi.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {CHANNELS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setChannel(c.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                        channel === c.id
                          ? "border-[#1E56A0] bg-[#EFF4FB]"
                          : "border-[#E2E8F0] hover:border-[#1E56A0]/40"
                      }`}
                    >
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <p className={`text-sm font-medium ${channel === c.id ? "text-[#1E56A0]" : "text-[#0A1E3F]"}`}>
                          {c.label}
                        </p>
                        <p className="text-xs text-[#64748B]">{c.desc}</p>
                      </div>
                      {channel === c.id && (
                        <Check className="ml-auto h-4 w-4 text-[#1E56A0]" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Services */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-[#1E56A0]" size={16} />
                  <h2 className="text-[#0A1E3F] font-semibold text-lg">Quel service leur proposez-vous ?</h2>
                </div>
                <p className="text-sm text-[#64748B] mb-2">
                  Décrivez votre offre — elle sera reliée au contexte de{" "}
                  <span className="font-mono text-[#1E56A0]">{domain}</span>.
                </p>
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-[#F1F5F9] px-2.5 py-1">
                  <span className="text-sm">{selectedChannel?.icon}</span>
                  <span className="text-xs font-mono text-[#1E56A0]">{selectedChannel?.label}</span>
                </div>
                <textarea
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder='Ex : "Développeur web freelance spécialisé en tunnels de vente"'
                  rows={4}
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-[#0A1E3F] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E56A0]/20 focus:border-[#1E56A0] transition-colors resize-none"
                />
              </div>
            )}

            {/* Step 4 — Résultat */}
            {step === 4 && result && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedChannel?.icon}</span>
                    <h2 className="text-[#0A1E3F] font-semibold text-lg">Message {selectedChannel?.label}</h2>
                  </div>
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#1E56A0] transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} size={14} />
                    Régénérer
                  </button>
                </div>

                <textarea
                  value={editedMsg}
                  onChange={(e) => setEditedMsg(e.target.value)}
                  rows={10}
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-4 text-sm text-[#1E293B] leading-relaxed focus:outline-none resize-none"
                />

                <button
                  onClick={handleCopy}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-[#0A1E3F] hover:bg-[#132B54] text-white text-sm font-medium py-3 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" size={16} /> : <Copy className="h-4 w-4" size={16} />}
                  {copied ? "Copié !" : "Copier le message"}
                </button>
              </div>
            )}

            {loading && step === 3 && (
              <div className="mt-5 flex items-center gap-2.5 text-sm text-[#64748B]">
                <Loader2 className="h-4 w-4 animate-spin text-[#1E56A0]" size={16} />
                Analyse de {domain} et rédaction en cours…
              </div>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>

          {/* Footer nav */}
          {step !== 4 && (
            <div className="flex items-center justify-between border-t border-[#E2E8F0] px-6 sm:px-8 py-4">
              <button
                onClick={goBack}
                disabled={step === 1}
                className="flex items-center gap-1.5 text-sm text-[#64748B] disabled:opacity-0 hover:text-[#0A1E3F] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" size={16} />
                Retour
              </button>
              <button
                onClick={goNext}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-[#1E56A0] hover:bg-[#174679] text-white text-sm font-medium px-5 py-2.5 transition-colors disabled:opacity-60"
              >
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" size={16} />
                  : <>
                      {step === 3 ? "Générer le message" : "Continuer"}
                      <ArrowRight className="h-4 w-4" size={16} />
                    </>
                }
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex items-center justify-between border-t border-[#E2E8F0] px-6 sm:px-8 py-4">
              <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0A1E3F] transition-colors">
                <ArrowLeft className="h-4 w-4" size={16} />
                Modifier l'offre
              </button>
              <button onClick={restart} className="text-sm font-medium text-[#1E56A0] hover:text-[#0A1E3F] transition-colors">
                Nouveau prospect
              </button>
            </div>
          )}
        </div>
         {/* footer */}
         <div className="flex items-center justify-between border-t border-[#E2E8F0] px-6 sm:px-8 py-4">
          <p className="text-sm text-[#64748B]">© 2026 Prospect-IA created by tarike Bouari. Tous droits réservés.</p>
         </div>
      </div>
    </div>
  );
}
