import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useOnboarding } from "../hooks/useOnboarding";
import AuthLayout from "../components/AuthLayout";
import lockImg from "../assets/lock_24px.png";
import addTeammateIcon from "../assets/add-teammate-icon.png";
import removeMemberIcon from "../assets/remove-member-icon.png";

export default function InviteTeamScreen() {
  const { addMember, updateMember, removeMember, nextStep, prevStep, state } =
    useOnboarding();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, string>>({
    defaultValues: Object.fromEntries(
      state.members.map((m) => [m.id, m.address]),
    ),
  });
  const members = state.members;

  function onSubmit() {
    nextStep();
  }

  function addNewMember(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    addMember();
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
        Step 03/03
      </p>
      <p className="font-semibold gap-1 text-base text-[#8692A6]">Team</p>
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
        Invite your team
      </h1>
      <p className="font-[Inter] font-normal text-[20px] mb-8 pt-2 text-lg align-middle leading-[28px] text-[#8692A6] tracking-[0%]">
        For the purpose of industry regulation, your details are required.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="teammateEmail"
          className="block font-[Inter] font-medium text-[16px] mb-4 mt-8 align-middle leading-[100%] text-[#696F79] tracking-[0%]"
        >
          Teammate email*
        </label>
        {members.map((member) => (
          <div key={member.id} className="mt-4">
          <div className="flex items-center gap-3">
            <Controller
              name={member.id}
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email",
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  id={member.id}
                  placeholder="Please enter address"
                  onChange={(e) => {
                    field.onChange(e);
                    updateMember(member.id, { address: e.target.value });
                  }}
                  className={`
                flex h-[64px] w-full items-center gap-4 rounded-md border px-5 py-4 text-left
                hover:border-blue-400 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
                />
              )}
            />
            <button
              type="button"
              onClick={() => removeMember(member.id)}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={members.length == 1}
            >
              <img src={removeMemberIcon} alt="remove" className="h-6 w-6" />
            </button>
            </div>
            {errors[member.id] && (
              <p className="text-red-600 mt-2">{errors[member.id]?.message}</p>
            )}
          </div>
        ))}
        <button
          onClick={addNewMember}
          disabled={members.length >= 5}
          className="mt-4 h-[19px] w-full flex items-center gap-2 text-[#1565D8] font-[Inter] font-medium text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img
            src={addTeammateIcon}
            alt="add teammate"
            className="h-[19px] w-[19px]"
          />
          Add teammate
        </button>
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
