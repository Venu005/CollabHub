/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { SIgnInFlow } from "../types";
import { SignInCard } from "./SignInCard";
import { SignUpCard } from "./SignInUpCard";
const AuthScreen = () => {
  const [state, setState] = useState<SIgnInFlow>("signIn");
  return (
    <div className="h-full flex justify-center items-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
