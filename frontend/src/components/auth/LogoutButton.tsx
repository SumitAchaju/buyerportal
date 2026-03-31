import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router"; // or react-router-dom
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import showToast from "@/components/toast";

export function LogoutButton() {
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      showToast({
        title: "Logged out",
        message: "You have been successfully signed out.",
        variant: "success",
      });
      // Redirect to login page and clear history
      navigate("/login", { replace: true });
    },
    onError: (error: Error) => {
      showToast({
        title: "Logout failed",
        message: error.message || "Something went wrong.",
        variant: "error",
      });
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={logoutMutation.isPending}
      onClick={() => logoutMutation.mutate()}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      {logoutMutation.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Logout
    </Button>
  );
}
