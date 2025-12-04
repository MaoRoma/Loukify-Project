import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

function VerifyEmailContent() {
  return <VerifyEmailForm />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-[#6a6a6a]">Loading verification page...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
