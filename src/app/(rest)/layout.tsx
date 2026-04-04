import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "../rest-styles.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "REST Group Asia Pacific | Assurance, Risk & Asset Performance",
  description:
    "REST Group Asia Pacific - independent assurance, risk advisory and asset performance services for the Recreation, Entertainment, Sport and Tourism sector.",
  icons: {
    icon: "/rest-assets/favicon.svg",
  },
};

export default function RestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`rest-site ${dmSerif.variable} ${plusJakarta.variable}`}
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--charcoal)",
        background: "var(--white)",
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}
