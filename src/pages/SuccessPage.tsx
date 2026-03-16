import { useEffect } from "react";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import successImage from "../assets/success-image.png";
import { useOnboarding } from "../hooks/useOnboarding";

export default function SuccessScreen() {
  const { state, prevStep } = useOnboarding();

  const back = (
    <button
      onClick={prevStep}
      className="flex items-center font-semibold gap-1 text-base text-[#8692A6]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Back
    </button>
  );

  useEffect(() => {
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        accountType: state.accountType,
        ...state.registration,
        ...state.profile,
        members: state.members,
      }),
    });
  });

  return (
    <AuthLayout topLeft={back}>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center"
      >
        <img src={successImage} alt="successImage" className="mb-6" />
        <h1 className="font-[Inter] font-bold mb-2 text-[30px] leading-[100%] text-[#000000]">
          Success
        </h1>
        <p className="font-[Inter] font-normal text-[20px] mb-8 pt-2 leading-[28px] text-[#8692A6]">
          You have received an email where you can read more about your account
          and setup your password.
        </p>
      </motion.div>
    </AuthLayout>
  );
}
