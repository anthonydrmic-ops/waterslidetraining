import { getSupabaseAdmin } from "@/lib/supabase";
import { Certificate, CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const supabase = getSupabaseAdmin();

  let cert: {
    id: string;
    user_name: string;
    course_id: string;
    score: number | null;
    total: number | null;
    issued_at: string;
    verified: boolean;
  } | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", certId)
      .single();
    cert = data;
  }

  const isValid = cert?.verified === true;
  const issuedDate = cert?.issued_at
    ? new Date(cert.issued_at).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative flex items-center justify-center p-6">
      <div className="noise-overlay" />
      <div className="max-w-md w-full">
        {isValid ? (
          <div className="card-shell">
            <div className="card-core p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} weight="fill" className="text-emerald-500" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 mb-1">
                Certificate Verified
              </h1>
              <p className="text-sm text-stone-400 mb-6">
                This is a valid SlideSure certification.
              </p>

              <div className="bg-stone-50 rounded-2xl p-6 mb-6 text-left space-y-4">
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-0.5">
                    Certificate ID
                  </p>
                  <p className="text-sm font-mono font-bold text-stone-800">{cert!.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-0.5">
                    Certified To
                  </p>
                  <p className="text-sm font-semibold text-stone-800">{cert!.user_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-0.5">
                    Course
                  </p>
                  <p className="text-sm text-stone-700">
                    Waterslide Assurance & Competency System
                  </p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-0.5">
                      Score
                    </p>
                    <p className="text-sm font-mono font-bold text-stone-800">
                      {cert!.score}/{cert!.total}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-0.5">
                      Issued
                    </p>
                    <p className="text-sm text-stone-700">{issuedDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Certificate size={16} weight="duotone" className="text-[var(--accent)]" />
                <span className="text-xs text-stone-400">
                  Slide<span className="font-bold text-stone-600">Sure</span> - A REST Group Product
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-shell">
            <div className="card-core p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5">
                <XCircle size={32} weight="fill" className="text-red-500" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 mb-1">
                Certificate Not Found
              </h1>
              <p className="text-sm text-stone-400 mb-2">
                No valid certificate exists for ID: <span className="font-mono font-bold">{certId}</span>
              </p>
              <p className="text-xs text-stone-300 mb-6">
                This may be an invalid or expired certificate. Contact the certificate holder for clarification.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            restgroup.com.au
          </Link>
        </div>
      </div>
    </div>
  );
}
