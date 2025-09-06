"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { SignInFlow } from "../types"
import { useState } from "react"
import { TriangleAlert } from "lucide-react"

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const { signIn } = useAuthActions()

  const handleProviderSignUp = (value: "github" | "google") => {
    setPending(true)
    void signIn(value)
      .finally(() => setPending(false)
    )
  }

  const handlePasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setPending(true)
    void signIn("password", { name, email, password, flow: "signUp" as SignInFlow })
      .catch(() => {
        setError("Password must be at least 8 characters long")
      })
      .finally(() => setPending(false))
  }

  return (
    <div className="md:h-auto 3xl:w-[420px] flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold">Enter your email to continue</h1>
      <h1 className="text-lg my-5">or choose another way to sign in</h1>
      
      <Card className="border-none shadow-none w-full max-w-sm"> {/*border-none shadow-none*/}
        {!!error && (
          <div className="w-full bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <TriangleAlert className="size-5" />
            <p>{error}</p>
          </div>
        )}

        <CardContent className="space-y-5 px-0 pb-0">
          <form onSubmit={handlePasswordSignUp} className="space-y-5">
            <Input
              name="name"
              disabled={false}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="py-5 text-lg"
              />
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
              disabled={pending}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="py-5 text-lg"
            />
            <Input
              type="password"
              name="Confirm password"
              disabled={pending}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="py-5 text-lg"
            />
            <Button
              className="w-full text-lg"
              type="submit"
              size="lg"
              disabled={pending}
              >
              Continue
            </Button>
          </form>

          <p className="text-center">OR SIGN IN WITH</p>

          <div className="flex justify-between gap-y-2.5">
            <Button
              className="text-lg w-45"
              disabled={pending}
              variant="outline"
              size="lg"
              onClick={() => handleProviderSignUp("google")}
              >
              <FcGoogle className="size-5"/>
              Google
            </Button>
            <Button
              className="text-lg w-45"
              disabled={pending}
              variant="outline"
              size="lg"
              onClick={() => handleProviderSignUp("github")}
              >
              <FaGithub className="size-5"/>
              Github
            </Button>
          </div>

          <div>
            <p className="text-center text-md">Already using slack?</p>
            <p className="text-sky-700 hover:underline cursor-pointer text-center text-md" onClick={() => setState("signIn")}>
              Sign in to an existing workspace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpCard
