import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { SignInFlow } from "../types"
import { useState } from "react"

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { signIn } = useAuthActions()

  const handleProviderSignIn = (value: "github" | "google") => {
    void signIn(value)
  }

  return (
    <div className="md:h-auto 3xl:w-[420px] flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold">Enter your email to sign in</h1>
      <h1 className="text-lg my-5">or choose another way to sign in</h1>
      
      <Card className="border-none shadow-none w-full max-w-sm"> {/*border-none shadow-none*/}
        <CardContent className="space-y-5 px-0 pb-0">
          <form className="space-y-5">
            <Input
              type="email"
              name="email"
              disabled={false}
              placeholder="name@work-email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-5 text-lg"
              />
            <Input
              type="password"
              name="password"
              disabled={false}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="py-5 text-lg"
            />
            <Button
              className="w-full text-lg"
              type="submit"
              size="lg"
              disabled={false}
              >
              Sign in with email
            </Button>
          </form>

          <p className="text-center">OR SIGN IN WITH</p>

          <div className="flex justify-between gap-y-2.5">
            <Button
              className="text-lg w-45"
              disabled={false}
              onClick={() => {}}
              variant="outline"
              size="lg"
              >
              <FcGoogle className="size-5"/>
              Google
            </Button>
            <Button
              className="text-lg w-45"
              disabled={false}
              onClick={() => handleProviderSignIn("github")}
              variant="outline"
              size="lg"
              >
              <FaGithub className="size-5"/>
              Github
            </Button>
          </div>

          <p className="text-center text-md">
            Don&apos;t have an account? {" "}
            <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signUp")}>Sign up</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInCard
