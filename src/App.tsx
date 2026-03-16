import { OnboardingProvider } from "./context/OnboardingContext";
import { useOnboarding } from "./hooks/useOnboarding";
import JoinUsScreen from "./pages/JoinUsPage";
import RegisterScreen from "./pages/RegisterPage";
import CompleteProfileScreen from "./pages/CompleteProfilePage";
import InviteTeamScreen from "./pages/InviteTeamPage";
import SuccessScreen from "./pages/SuccessPage";

function App() {
  return (
    <OnboardingProvider>
      <OnboardingRouter />
    </OnboardingProvider>
  );
}

function OnboardingRouter() {
  const { state } = useOnboarding();
  const steps = [
    <JoinUsScreen />,
    <RegisterScreen />,
    <CompleteProfileScreen />,
    <InviteTeamScreen />,
    <SuccessScreen />,
  ];
  return steps[state.step] ?? <SuccessScreen />;
}

export default App;
