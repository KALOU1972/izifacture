import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { PainPoints } from "@/components/landing/PainPoints";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-ld-background text-ld-on-background font-body-md min-h-screen flex flex-col relative overflow-x-hidden selection:bg-ld-primary-container selection:text-white">
      <Header />
      <main className="flex-grow flex flex-col">
        <Hero />
        <SocialProof />
        <PainPoints />
      </main>
      <Footer />
    </div>
  );
}
