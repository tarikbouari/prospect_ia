


import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "TRB — La structure d'une entreprise, le travail d'une seule personne",
  description:
    "TRB donne à votre activité solo l'organisation d'une équipe complète : stratégie, prospection, contenu, organisation et relation client.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={`${display.variable} ${body.variable} antialiased bg-white`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}


// import type { Metadata } from "next";
// import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
// import "./globals.css";

// const display = Manrope({
//   subsets: ["latin"],
//   weight: ["700", "800"],
//   variable: "--font-display",
// });

// const body = Inter({
//   subsets: ["latin"],
//   variable: "--font-body",
// });

// const mono = JetBrains_Mono({
//   subsets: ["latin"],
//   weight: ["400", "500"],
//   variable: "--font-mono",
// });

// export const metadata: Metadata = {
//   title: "Solis — L'outil qui structure votre entreprise pendant que vous travaillez seul",
//   description:
//     "Chaque matin, Solis prépare vos priorités, relance vos prospects, avance votre contenu et suit vos clients à votre place.",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fr">
//       <body
//         className={`${display.variable} ${body.variable} ${mono.variable} antialiased bg-white`}
//         style={{ fontFamily: "var(--font-body)" }}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }