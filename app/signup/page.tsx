"use client";

import { useState } from "react";
import SignUpLanding from "@/components/signup/SignUpLanding";
import SignUpPhone from "@/components/signup/SignUpPhone";
import SignUpOTP from "@/components/signup/SignUpOTP";
import SignUpSuccess from "@/components/signup/SignUpSuccess";

type Step = "landing" | "phone" | "otp" | "success";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("landing");
  const [phone, setPhone] = useState("");

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
      {step === "landing" && (
        <SignUpLanding onEmail={() => setStep("phone")} />
      )}
      {step === "phone" && (
        <SignUpPhone
          onBack={() => setStep("landing")}
          onNext={(p) => { setPhone(p); setStep("otp"); }}
        />
      )}
      {step === "otp" && (
        <SignUpOTP
          phone={phone}
          onBack={() => setStep("phone")}
          onVerified={() => setStep("success")}
        />
      )}
      {step === "success" && (
        <SignUpSuccess />
      )}
    </main>
  );
}
