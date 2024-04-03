"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface ButtonPorps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export default function LoginButton({
  children,
  mode = "redirect",
  asChild,
}: ButtonPorps) {
  const router = useRouter();

  function handleClick() {
    console.log('clicked')
    router.push("/auth/login");
  }

  if (mode === "modal") {
    return <span>TODO: Implement modal</span>;
  }
  return (
    <>
     <Button variant={'secondary'} size={'lg'} onClick={handleClick} className="cursor-point">
        {children}
     </Button>
    </>
  );
}
