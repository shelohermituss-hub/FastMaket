import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center px-8">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4040FF, #6B21FF)" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Create Account</h1>
        <p className="text-gray-400 text-sm mb-8">Sign up page — coming soon</p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #4040FF, #6B21FF)" }}
        >
          ← Back to Onboarding
        </Link>
      </div>
    </main>
  );
}
