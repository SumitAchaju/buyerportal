import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { Navigate } from "react-router";

type Props = {
  children: React.ReactNode;
};

function LoginRedirectGuard({ children }: Props) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }
  if (!!session) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

export default LoginRedirectGuard;
