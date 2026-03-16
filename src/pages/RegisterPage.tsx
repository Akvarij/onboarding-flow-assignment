import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import { useOnboarding } from "../hooks/useOnboarding";
import lockImg from "../assets/lock_24px.png";

export default function RegisterScreen() {
  const { state, updateRegistration, nextStep, prevStep } = useOnboarding();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    fullName: string;
    email: string;
    password: string;
    terms: string;
  }>({
    defaultValues: {
      fullName: (state.registration.fullName as string) ?? "",
      email: (state.registration.email as string) ?? "",
      password: "", // don't restore hashed password
    },
  });

  async function onSubmit(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    const hashedPassword = await hashPassword(data.password);
    updateRegistration({ ...data, password: hashedPassword });
    nextStep();
  }

  async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

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

  const stepCounter = (
    <div className="text-right">
      <p className="text-xs text-gray-400 uppercase tracking-widest">
        Step 01/03
      </p>
      <p className="font-semibold gap-1 text-base text-[#8692A6]">
        Personal Info.
      </p>
    </div>
  );

  return (
    <AuthLayout topLeft={back} topRight={stepCounter}>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
      <h1 className="font-[Inter] font-bold mb-2 text-[30px] tracking-tight leading-[100%] text-[#000000] tracking-[0%]">
        Register Individual Account!
      </h1>
      <p className="font-[Inter] font-normal text-[20px] mb-8 pt-2 text-lg align-middle leading-[28px] text-[#8692A6] tracking-[0%]">
        For the purpose of industry regulation, your details are required.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="fullName"
          className="block font-[Inter] font-medium text-[16px] mb-4 mt-8 align-middle leading-[100%] text-[#696F79] tracking-[0%]"
        >
          Your fullname*
        </label>
        <Controller
          name="fullName"
          control={control}
          rules={{
            required: "Your fullname is required",
            minLength: {
              value: 5,
              message: "Full name must be at least 5 characters",
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              id="fullName"
              placeholder="Enter fullname"
              className={`
                group flex h-[64px] w-full items-center gap-4 rounded-md border px-5 py-4 text-left
                hover:border-blue-400 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
            />
          )}
        />
        {errors.fullName && (
          <p className="text-red-600 mt-2">{errors.fullName.message}</p>
        )}
        <label
          htmlFor="email"
          className="block font-[Inter] font-medium text-[16px] mb-4 mt-8 align-middle leading-[100%] text-[#696F79] tracking-[0%]"
        >
          Email address*
        </label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Your email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email",
            },
          }}
          render={({ field }) => (
            <input
              id="email"
              type="email"
              {...field}
              placeholder="Enter email address"
              className={`
                group flex h-[64px] w-full items-center gap-4 rounded-md border px-5 py-4 text-left
                transition-all duration-150
                hover:border-blue-400 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
            />
          )}
        />
        {errors.email && (
          <p className="text-red-600 mt-2">{errors.email.message}</p>
        )}
        <label
          htmlFor="password"
          className="block font-[Inter] font-medium text-[16px] mb-4 mt-8 align-middle leading-[100%] text-[#696F79] tracking-[0%]"
        >
          Create password*
        </label>
        <div className="relative">
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Your password is required",
              validate: (v) => {
                const rules: [RegExp, string][] = [
                  [/[A-Z]/, "Must include at least one uppercase letter"],
                  [/[a-z]/, "Must include at least one lowercase letter"],
                  [/[0-9]/, "Must include at least one number"],
                  [
                    /[^A-Za-z0-9]/,
                    "Must include at least one special character",
                  ],
                ];
                for (const [regex, message] of rules)
                  if (!regex.test(v)) return message;
                return true;
              },
            }}
            render={({ field }) => (
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...field}
                placeholder="Password"
                className={`
                group flex h-[64px] w-full items-center gap-4 rounded-md border px-5 py-4 text-left
                transition-all duration-150
                hover:border-blue-400 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
                pr-16
              `}
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#696F79]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-600 mt-2">{errors.password.message}</p>
        )}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Controller
              name="terms"
              control={control}
              rules={{
                required: "This is required",
              }}
              render={({ field }) => (
                <input
                  id="terms"
                  {...field}
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              )}
            />
            <label
              htmlFor="terms"
              className="font-[Inter] text-[16px] font-medium text-[#696F79] cursor-pointer"
            >
              I agree to{" "}
              <a className="font-[Inter] text-[16px] font-medium text-blue-600 underline cursor-pointer">
                terms & conditions
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-600 mt-2">{errors.terms.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-8 h-[64px] w-full rounded-md bg-[#1565D8] text-white font-[Inter] font-semibold text-[18px] tracking-wide hover:bg-blue-700 transition-colors duration-150"
        >
          Register Account
        </button>
        <p className="mt-4 flex items-center justify-center gap-2 font-[Inter] text-[14px] text-[#8692A6]">
          <img src={lockImg} alt="lock" className="h-4 w-4" />
          Your Info is safely secured
        </p>
      </form>
      </motion.div>
    </AuthLayout>
  );
}
