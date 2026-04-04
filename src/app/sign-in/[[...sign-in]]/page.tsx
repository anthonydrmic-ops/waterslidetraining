import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--background)] flex items-center justify-center p-6">
      <div className="noise-overlay" />
      <SignIn />
    </div>
  );
}
