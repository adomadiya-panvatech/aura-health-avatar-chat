import { HealthcareAvatar } from "@/components/HealthcareAvatar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-medical">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Healthcare Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your intelligent 3D healthcare companion for patient support, 
            appointment scheduling, and medical guidance.
          </p>
        </div>
        
        <HealthcareAvatar />
      </div>
    </div>
  );
};

export default Index;
