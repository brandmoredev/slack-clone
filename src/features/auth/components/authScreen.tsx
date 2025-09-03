"use client"

import { useState } from "react"
import { SignInFlow } from "../types"
import SignInCard from "./signInCard";
import SignUpCard from "./signUpCard";

const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="h-full flex items-center justify-center">
        {state === "signIn" ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
    </div>
  )
}

export default AuthScreen