import ForgotPassword from "@/components/forgot-password/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <main style={{
      position: "relative",
      width: "100%",
      height: "100dvh",
      overflow: "hidden",
      maxWidth: 430,
      margin: "0 auto",
      background: "white",
    }}>
      <ForgotPassword />
    </main>
  );
}
