import { type ReactNode } from "react";
import buildingsImg from "../assets/buildings.jpg";
import lBracketImg from "../assets/L-bracket-vector.png";
import quoteImg from "../assets/quote-vector.png";
import dotsImg from "../assets/dots.png";

interface AuthLayoutProps {
  children: ReactNode;
  topLeft?: ReactNode;
  topRight?: ReactNode;
}

export default function AuthLayout({
  children,
  topLeft,
  topRight,
}: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Left panel ── */}
      <div className="relative hidden w-1/2 flex-col justify-center items-center overflow-hidden p-12 lg:flex ">
        {/* Building photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${buildingsImg})` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#0d47a1_0%,#1976d2_40%,#1565c0_60%,#0a3880_100%)] opacity-80" />
        {/* Subtle "glass curtain-wall" lines to mimic building texture */}

        {/* Dot grid — top right of panel */}
        <img src={dotsImg} className="absolute z-10 top-32 right-16" />

        {/* Quote */}
        <div className="relative z-10 w-full max-w-[473px] h-50%">
          <img src={quoteImg} alt="Quote" className="mb-3 block" />
          <p className="font-[Inter] tracking-[0%] text-[20px] font-normal align-middle leading-[38px] text-white/90">
            The passage experienced a surge in popularity during the 1960s when
            Letraset used it on their dry-transfer sheets, and again during the
            90s as desktop publishers bundled the text with their software.
          </p>
          <img
            src={lBracketImg}
            width={32}
            height={32}
            alt="L-bracket"
            className="absolute right-5 mt-6"
          />
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-white">
        {/* Top nav */}
        <div className="flex items-center justify-between px-10 py-6 pt-16">
          <div>{topLeft}</div>
          <div>{topRight}</div>
        </div>

        {/* Page content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
