import { ImageResponse } from "next/og";
import { getSupabaseAdmin } from "@/lib/supabase";

// Personalised 1200x630 certificate tile for social previews (LinkedIn, etc.).
// Referenced from the /verify/[certId] page's Open Graph + Twitter metadata.
// Uses only solid colours and flexbox so it renders reliably through Satori.

export const dynamic = "force-dynamic";

const NAVY = "#0B3A66";
const GOLD = "#C9A13B";
const CREAM = "#FAF8F3";
const CTA = "#F05A28";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const certId = searchParams.get("id");

  let name: string | null = null;
  let issuedAt: string | null = null;

  if (certId) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase
        .from("certificates")
        .select("user_name, issued_at, verified")
        .eq("id", certId)
        .single();
      if (data?.verified) {
        name = data.user_name;
        issuedAt = data.issued_at;
      }
    }
  }

  const dateLabel = issuedAt
    ? new Date(issuedAt).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: CREAM,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top + bottom accent rules */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, backgroundColor: NAVY, display: "flex" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12, backgroundColor: GOLD, display: "flex" }} />

        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#9a8f7a", marginBottom: 22 }}>
          CERTIFICATE OF COMPETENCY
        </div>

        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, marginBottom: 8 }}>
          <span style={{ color: NAVY }}>Slide</span>
          <span style={{ color: CTA }}>Sure</span>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#6b6356", marginBottom: 34 }}>
          Waterslide Assurance &amp; Competency System
        </div>

        <div style={{ display: "flex", width: 130, height: 3, backgroundColor: GOLD, marginBottom: 34 }} />

        <div style={{ display: "flex", fontSize: 18, letterSpacing: 3, color: "#9a8f7a", marginBottom: 14 }}>
          THIS CERTIFIES THAT
        </div>

        <div style={{ display: "flex", fontSize: 70, fontWeight: 800, color: "#1c1917", marginBottom: 38, textAlign: "center" }}>
          {name || "A Certified Operator"}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, color: NAVY, fontWeight: 700 }}>REST Group</div>
          <div style={{ display: "flex", width: 1, height: 26, backgroundColor: "#d8d0c2", marginLeft: 24, marginRight: 24 }} />
          <div style={{ display: "flex", fontSize: 24, color: "#047857", fontWeight: 700, letterSpacing: 1 }}>VERIFIED</div>
          {dateLabel ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", width: 1, height: 26, backgroundColor: "#d8d0c2", marginLeft: 24, marginRight: 24 }} />
              <div style={{ display: "flex", fontSize: 24, color: "#6b6356" }}>{dateLabel}</div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
