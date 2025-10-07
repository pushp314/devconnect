"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

function SignInButton({
  provider,
  icon,
  children,
}: {
  provider: "github" | "google";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      className="w-full h-12 text-base"
      onClick={() => signIn(provider, { callbackUrl: "/feed" })}
    >
      {icon}
      {children}
    </Button>
  );
}

export { SignInButton };
