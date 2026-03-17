import type { Metadata } from "next";
import { LoginCard } from "@/components/LoginCard";

export const metadata: Metadata = {
  title: "Client Access",
  description:
    "Secure client portal for AlignAI by ByteStream Strategies project access.",
};

export default function ClientAccessPage() {
  return (
    <section className="hero-panel flex min-h-screen items-center justify-center pt-16">
      <div className="container-main py-14">
        <LoginCard />
      </div>
    </section>
  );
}
