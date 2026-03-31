import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FacebookIcon, GoogleIcon } from "@/assets/IconHub";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import {
  loginDefaultValues,
  loginSchema,
  type LoginData,
} from "@/schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import showToast from "@/components/toast";
import { authClient } from "@/lib/auth-client";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const { from } = location.state || {};
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const socialLogin = async (provider: "google" | "facebook") => {
    await authClient.signIn.social({
      provider,
      callbackURL: `${import.meta.env.VITE_FRONTEND_URL}${from?.pathname || ""}`,
    });
  };

  const navigate = useNavigate();

  const navigateAfterLogin = () => {
    if (from?.pathname) {
      navigate(from.pathname, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const { data: signInData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      console.log(error);
      if (error) {
        throw new Error(error.message);
      }
      return signInData;
    },
    onSuccess: () => {
      showToast({
        title: "Login successful",
        message: "Welcome back to your workspace!",
        variant: "success",
      });
      navigateAfterLogin();
    },
    onError: (error: Error) => {
      showToast({
        title: "Login failed",
        message:
          error?.message || "Please check your credentials and try again.",
        variant: "error",
      });
    },
  });
  const login = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 48px)",
        }}
      />

      <div className="relative w-full max-w-[420px] bg-white border border-zinc-200 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-400" />

        <div className="px-8 pt-8 pb-9">
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-md bg-zinc-900 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-tight text-zinc-900">
                Buyer Portal
              </span>
            </div>
            <h1 className="text-[26px] font-bold text-zinc-900 leading-tight tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Sign in to continue to your workspace
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <Button
              variant="outline"
              className="w-full text-xs h-9 font-medium"
              onClick={() => socialLogin("google")}
            >
              <GoogleIcon /> Google
            </Button>
            <Button
              variant="outline"
              className="w-full text-xs h-9 font-medium"
              onClick={() => socialLogin("facebook")}
            >
              <FacebookIcon className="text-white" /> Facebook
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <Separator className="flex-1" />
            <span className="text-xs text-zinc-400 shrink-0">
              or continue with email
            </span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={form.handleSubmit(login)} className="space-y-4">
            <div className="space-y-1.5">
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="abc@example.com"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeIcon className="w-4 h-4" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="rememberMe"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-2 items-center">
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      id={field.name}
                    />
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm text-zinc-700 cursor-pointer peer-data-[state=checked]:text-zinc-900"
                    >
                      Remember me for 30 days
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full mt-2 h-10"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Signing in…
                </span>
              ) : (
                <span>Sign in</span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-zinc-700 font-medium hover:text-zinc-900 underline underline-offset-2 transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>

      <p className="fixed bottom-5 text-[11px] text-zinc-400 tracking-widest uppercase">
        Secure · Private · Yours
      </p>
    </div>
  );
}
