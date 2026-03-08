import { useNavigate } from "react-router-dom";
import ClientOnboardingWizard from "@/components/ClientOnboardingWizard";

const ClientOnboarding = () => {
  const navigate = useNavigate();

  return (
    <ClientOnboardingWizard
      onComplete={() => navigate("/portal")}
    />
  );
};

export default ClientOnboarding;
