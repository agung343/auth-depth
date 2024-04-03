"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { newVerification } from "@/actions/verification";
import { FormError } from "../ui/form-error";
import { FormSuccess } from "../ui/form-success";

export function NewVerificationForm() {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing Token Verification");
      return;
    }

    newVerification(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data?.success);
      })
      .catch(() => setError("Something went wrong"));
  }, [error, success, token]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirm email verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && <BeatLoader />}
        {!success && <FormError message={error} />}
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
}
