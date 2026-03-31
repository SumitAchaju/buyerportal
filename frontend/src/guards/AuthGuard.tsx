import { authClient } from "@/lib/auth-client";
import { useSessionStore } from "@/store/auth-store";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

type Props = {
  children: React.ReactNode;
};

function AuthGuard({ children }: Props) {
  const { data: session, isPending, error } = authClient.useSession();
  const location = useLocation();

  const setSession = useSessionStore((s) => s.setSession);
  const clearSession = useSessionStore((s) => s.clearSession);

  useEffect(() => {
    if (session) {
      setSession(session as any);
    } else {
      clearSession();
    }
  }, [session, setSession, clearSession]);

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }

  if (!session || error) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;
