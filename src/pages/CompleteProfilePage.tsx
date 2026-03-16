import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useOnboarding } from "../hooks/useOnboarding";
import AuthLayout from "../components/AuthLayout";
import lockImg from "../assets/lock_24px.png";

export default function CompleteProfileScreen() {
  const { state, updateProfile, nextStep, prevStep } = useOnboarding();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    address: string;
    country: string;
  }>({
    defaultValues: {
      address: (state.profile.address as string) ?? "",
      country: (state.profile.country as string) ?? "",
    },
  });

  function onSubmit(data: { address: string; country: string }) {
    updateProfile(data);
    nextStep();
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
        Step 02/03
      </p>
      <p className="font-semibold gap-1 text-base text-[#8692A6]">
        Residency Info.
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
        Complete Your Profile!
      </h1>
      <p className="font-[Inter] font-normal text-[20px] mb-8 text-lg align-middle leading-[28px] text-[#8692A6] tracking-[0%] pt-2">
        For the purpose of industry regulation, your details are required.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="address"
          className="block font-[Inter] font-medium text-[16px] mb-4 mt-8 align-middle leading-[100%] text-[#696F79] tracking-[0%]"
        >
          Your address*
        </label>
        <Controller
          name="address"
          control={control}
          rules={{
            required: "Your address is required",
          }}
          render={({ field }) => (
            <input
              id="address"
              {...field}
              placeholder="Please enter address"
              className={`
                group flex h-[64px] w-full items-center gap-4 rounded-md border px-5 py-4 text-left
                hover:border-blue-400 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
            />
          )}
        />
        {errors.address && (
          <p className="text-red-600 mt-2">{errors.address.message}</p>
        )}
        <label
          htmlFor="country"
          className="block font-[Inter] font-medium text-[16px] mb-4 mt-8 align-middle leading-[100%] text-[#696F79] tracking-[0%]"
        >
          Country of residence*
        </label>
        <div className="relative">
          <Controller
            name="country"
            control={control}
            rules={{
              required: "Please select a country",
            }}
            render={({ field }) => (
              <select
                id="country"
                {...field}
                className={`
                  appearance-none h-[64px] w-full rounded-md border px-5 py-4 pr-10
                  hover:border-blue-400 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                  ${field.value === "" ? "text-[#8692A6]" : "text-black"}
                `}
              >
                <option value="" disabled>
                  Please select
                </option>
                <option value="SL" className="text-black">
                  Slovenia(SL)
                </option>
                <option value="US" className="text-black">
                  USA(US)
                </option>
                <option value="EN" className="text-black">
                  England(EN)
                </option>
              </select>
            )}
          />
          {errors.country && (
            <p className="text-red-600 mt-2">{errors.country.message}</p>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 h-[64px] w-full rounded-md bg-[#1565D8] text-white font-[Inter] font-semibold text-[18px] tracking-wide hover:bg-blue-700 transition-colors duration-150"
        >
          Save & Continue
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
