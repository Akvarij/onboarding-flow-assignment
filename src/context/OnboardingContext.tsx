import { createContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";

type AccountType = "individual" | "business" | null;

interface Member {
  id: string;
  address: string;
}

interface RegisterPayload {
  accountType: "individual" | "business";
  name: string;
  email: string;
  password: string;
  terms: boolean;
  address: string;
  country: "SL" | "US" | "EN";
  team: string[];
}

interface OnboardingState {
  accountType: AccountType;
  registration: Record<string, unknown>;
  profile: Record<string, unknown>;
  members: Member[];
  step: number;
  completed: boolean;
}

type OnboardingAction =
  | { type: "SET_ACCOUNT_TYPE"; payload: AccountType }
  | { type: "UPDATE_REGISTRATION"; payload: Record<string, unknown> }
  | { type: "UPDATE_PROFILE"; payload: Record<string, unknown> }
  | { type: "ADD_MEMBER" }
  | { type: "UPDATE_MEMBER"; id: string; payload: Partial<Member> }
  | { type: "REMOVE_MEMBER"; id: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "COMPLETE" }
  | { type: "RESET" };

const initialState: OnboardingState = {
  accountType: null,
  registration: {},
  profile: {},
  members: [{ id: crypto.randomUUID(), address: "" }],
  step: 0,
  completed: false,
};

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case "SET_ACCOUNT_TYPE":
      return { ...state, accountType: action.payload };
    case "UPDATE_REGISTRATION":
      return {
        ...state,
        registration: { ...state.registration, ...action.payload },
      };
    case "UPDATE_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case "ADD_MEMBER":
      return {
        ...state,
        members: [...state.members, { id: crypto.randomUUID(), address: "" }],
      };
    case "UPDATE_MEMBER":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.id ? { ...m, ...action.payload } : m,
        ),
      };
    case "REMOVE_MEMBER":
      return {
        ...state,
        members: state.members.filter((m) => m.id !== action.id),
      };
    case "NEXT_STEP":
      return { ...state, step: state.step + 1 };
    case "PREV_STEP":
      return { ...state, step: Math.max(0, state.step - 1) };
    case "COMPLETE":
      return { ...state, completed: true };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  setAccountType: (type: AccountType) => void;
  updateRegistration: (data: Record<string, unknown>) => void;
  updateProfile: (data: Record<string, unknown>) => void;
  addMember: () => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  removeMember: (id: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  complete: () => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState, () => {
    const saved = sessionStorage.getItem("onboarding");
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    sessionStorage.setItem("onboarding", JSON.stringify(state));
  }, [state]);

  const setAccountType = (type: AccountType) =>
    dispatch({ type: "SET_ACCOUNT_TYPE", payload: type });

  const updateRegistration = (data: Record<string, unknown>) =>
    dispatch({ type: "UPDATE_REGISTRATION", payload: data });

  const updateProfile = (data: Record<string, unknown>) =>
    dispatch({ type: "UPDATE_PROFILE", payload: data });

  const addMember = () => dispatch({ type: "ADD_MEMBER" });

  const updateMember = (id: string, data: Partial<Member>) =>
    dispatch({ type: "UPDATE_MEMBER", id, payload: data });

  const removeMember = (id: string) => dispatch({ type: "REMOVE_MEMBER", id });

  const nextStep = () => dispatch({ type: "NEXT_STEP" });
  const prevStep = () => dispatch({ type: "PREV_STEP" });
  const complete = () => dispatch({ type: "COMPLETE" });
  const reset = () => dispatch({ type: "RESET" });

  return (
    <OnboardingContext.Provider
      value={{
        state,
        dispatch,
        setAccountType,
        updateRegistration,
        updateProfile,
        addMember,
        updateMember,
        removeMember,
        nextStep,
        prevStep,
        complete,
        reset,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export { OnboardingContext };

export type {
  OnboardingState,
  OnboardingAction,
  OnboardingContextValue,
  AccountType,
  Member,
  RegisterPayload,
};
