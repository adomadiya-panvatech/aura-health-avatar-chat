import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, HelpCircle, Shield, Pill, Clock, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface HealthcarePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const healthcarePrompts = [
  {
    icon: Calendar,
    title: "Schedule Appointment",
    prompt: "I'd like to schedule an appointment with a doctor.",
    category: "Scheduling"
  },
  {
    icon: HelpCircle,
    title: "General Health Questions",
    prompt: "I have some general health questions I'd like to discuss.",
    category: "Information"
  },
  {
    icon: Shield,
    title: "Insurance Coverage",
    prompt: "I need help understanding my insurance coverage and benefits.",
    category: "Insurance"
  },
  {
    icon: Pill,
    title: "Medication Information",
    prompt: "I have questions about my medications and prescriptions.",
    category: "Medications"
  },
  {
    icon: Clock,
    title: "Urgent Care",
    prompt: "I need urgent medical care but it's not an emergency.",
    category: "Urgent"
  },
  {
    icon: Phone,
    title: "Patient Support",
    prompt: "I need help with patient services and support options.",
    category: "Support"
  }
];

export const HealthcarePrompts = ({ onSelectPrompt }: HealthcarePromptsProps) => {
  return (
    <Card className="p-6 shadow-medical">
      <h3 className="font-semibold text-foreground mb-4">
        Quick Healthcare Assistance
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Choose a topic to get started, or ask your own question
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {healthcarePrompts.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className="w-full h-auto p-4 justify-start text-left hover:bg-secondary/50 hover:shadow-soft transition-all duration-300"
              onClick={() => onSelectPrompt(item.prompt)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.category}
                  </div>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
      
      {/* Additional healthcare info */}
      <div className="mt-6 p-4 bg-gradient-medical rounded-lg border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Healthcare Privacy Notice</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This AI assistant provides general healthcare information and support. 
          For medical emergencies, call 911. For urgent medical needs, contact your healthcare provider directly.
          All conversations are secure and follow healthcare privacy standards.
        </p>
      </div>
    </Card>
  );
};