
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Shield, Globe, Clock, Users, Check } from "lucide-react";
import { HealthcareAvatar } from "./HealthcareAvatar";

export const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    { icon: Clock, text: "24/7 Available" },
    { icon: Globe, text: "Multi-language Support" },
    { icon: Shield, text: "EHR Integration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-medical">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HealthcareAI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">How it Works</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-smooth">Testimonials</a>
            <Button variant="outline" size="sm">Book a Demo</Button>
            <Button 
              variant="medical" 
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Try Live Bot
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="outline" className="w-fit">
              <Check className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                AI-Powered
                <br />
                Healthcare
                <br />
                <span className="text-primary">Assistant</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Transform patient care with our empathetic AI assistant. Conduct 
                symptom triage, provide medical information, schedule 
                appointments, and maintain detailed records - all while ensuring 
                HIPAA compliance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Play className="w-4 h-4" />
                Try Live Bot
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Calendar className="w-4 h-4" />
                Book a Demo
              </Button>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap gap-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <feature.icon className="w-4 h-4 text-primary" />
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Avatar Preview */}
          <div className="relative">
            <Card className="relative h-96 lg:h-[500px] overflow-hidden bg-gradient-avatar shadow-medical">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto flex items-center justify-center border-4 border-primary/30">
                    <img 
                      src="/lovable-uploads/0d349819-e976-4d1f-8956-ce06674eebc2.png" 
                      alt="Dr. Sarah AI" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Dr. Sarah AI</h3>
                    <p className="text-muted-foreground">Your AI Healthcare Assistant</p>
                  </div>
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-sm mx-4">
                    <p className="text-sm text-foreground">
                      "Hello! I'm here to help with your healthcare needs. I can assist with symptom 
                      assessment, answer medical questions, and schedule appointments."
                    </p>
                  </div>
                  <Button 
                    variant="medical" 
                    onClick={() => setIsModalOpen(true)}
                    className="animate-glow"
                  >
                    Start Conversation
                  </Button>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="absolute top-4 right-4">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Modal with Healthcare Avatar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-7xl h-[90vh] max-h-screen p-0 m-4 sm:m-6">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <DialogTitle className="text-lg sm:text-xl">AI Healthcare Assistant</DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-4 sm:p-6 pt-0 overflow-hidden">
            <HealthcareAvatar />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
