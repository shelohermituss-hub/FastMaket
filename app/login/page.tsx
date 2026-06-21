import LoginScreen from "@/components/login/LoginScreen";

export default function LoginPage() {
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
      <LoginScreen />
    </main>
  );
}
