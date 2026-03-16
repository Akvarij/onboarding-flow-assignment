import { useContext } from "react";
import { OnboardingContext } from "../context/OnboardingContext";
import type { OnboardingContextValue } from "../context/OnboardingContext";

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
