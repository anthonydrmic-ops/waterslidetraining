import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--background)] flex items-center justify-center p-6">
      <div className="noise-overlay" />
      <SignUp />
    </div>
  );
}
