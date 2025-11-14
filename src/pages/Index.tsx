import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ShipmentTimeline } from "@/components/ShipmentTimeline";
import { UploadForm } from "@/components/UploadForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <UploadForm />
        <ShipmentTimeline />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
