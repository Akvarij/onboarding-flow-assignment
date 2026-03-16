import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import { useOnboarding } from "../hooks/useOnboarding";
import type { AccountType } from "../context/OnboardingContext";

/* Pentagon SVG wrapper to match the screenshot's icon shape */
function PentagonIcon({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 44 44"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <polygon
          points="22,2 42,14 36,38 8,38 2,14"
          fill={active ? "#dbeafe" : "#f3f4f6"}
          stroke={active ? "#93c5fd" : "#e5e7eb"}
          strokeWidth="1"
        />
      </svg>
      <button
        className={`relative z-10 ${active ? "text-blue-700" : "text-gray-500"}`}
      >
        {children}
      </button>
    </div>
  );
}

const IndividualIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BusinessIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

interface CardOption {
  id: AccountType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const options: CardOption[] = [
  {
    id: "individual",
    label: "Individual",
    description: "Personal account to manage all you activities.",
    icon: <IndividualIcon />,
  },
  {
    id: "business",
    label: "Business",
    description: "Own or belong to a company, this is for you.",
    icon: <BusinessIcon />,
  },
];

export default function JoinUsScreen() {
  const { state, setAccountType, nextStep } = useOnboarding();

  function handleSelect(id: AccountType) {
    setAccountType(id);
    nextStep();
  }

  const signIn = (
    <p className="text-sm text-gray-500">
      Already have an account?{" "}
      <a href="#" className="font-semibold text-blue-600 hover:underline">
        Sign In
      </a>
    </p>
  );

  return (
    <AuthLayout topRight={signIn}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="mb-2 text-[28px] font-bold tracking-tight text-gray-900">
          Join Us!
        </h1>
        <p className="mb-8 pt-2 text-sm leading-relaxed text-gray-500">
          To begin this journey, tell us what type of account you'd be opening.
        </p>

        <div className="flex flex-col gap-4">
          {options.map((option) => {
            const active = state.accountType === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                group flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left
                transition-all duration-150
                hover:border-blue-400 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
                ${active ? "border-blue-400 bg-white shadow-sm" : "border-gray-200 bg-white"}
              `}
              >
                <PentagonIcon active={active}>{option.icon}</PentagonIcon>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {option.description}
                  </p>
                </div>

                {active && (
                  <svg
                    className="flex-shrink-0 text-blue-500"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AuthLayout>
  );
}
