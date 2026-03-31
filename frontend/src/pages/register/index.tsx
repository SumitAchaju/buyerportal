import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { FacebookIcon, GoogleIcon } from "@/assets/IconHub";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2,
  CheckCircle2,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import showToast from "@/components/toast";
import { authClient } from "@/lib/auth-client";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

// ── Schema ───────────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

const registerDefaultValues: RegisterData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

// ── Email availability status type ───────────────────────────────────────────
type EmailStatus = "idle" | "checking" | "available" | "taken" | "invalid";

// ── useEmailAvailability hook ─────────────────────────────────────────────────
function useEmailAvailability(email: string, isValidEmail: boolean) {
  const [status, setStatus] = useState<EmailStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset if email cleared or invalid
    if (!email || !isValidEmail) {
      setStatus(email && !isValidEmail ? "invalid" : "idle");
      return;
    }

    // Debounce — wait 600ms after user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setStatus("checking");

    debounceRef.current = setTimeout(async () => {
      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        // better-auth exposes a check endpoint — adapt path to your setup
        // e.g. GET /api/auth/check-email?email=...
        const res = await fetch(
          `http://localhost:3000/api/v1/custom-auth/check-email?email=${encodeURIComponent(email)}`,
          { signal: abortRef.current.signal },
        );

        if (!res.ok) throw new Error("Check failed");

        const data = await res.json();
        // Expects: { available: boolean }
        setStatus(data.data.available ? "available" : "taken");
      } catch (err: unknown) {
        // Ignore abort errors from stale requests
        if (err instanceof Error && err.name !== "AbortError") {
          setStatus("idle");
        }
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [email, isValidEmail]);

  return status;
}

// ── EmailStatusIndicator ─────────────────────────────────────────────────────
function EmailStatusIndicator({ status }: { status: EmailStatus }) {
  if (status === "idle" || status === "invalid") return null;

  return (
    <div
      className={`flex items-center gap-1.5 text-xs mt-1.5 transition-all ${
        status === "checking"
          ? "text-zinc-400"
          : status === "available"
            ? "text-emerald-600"
            : "text-red-500"
      }`}
    >
      {status === "checking" && (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Checking availability…</span>
        </>
      )}
      {status === "available" && (
        <>
          <CheckCircle className="w-3 h-3" />
          <span>Email is available</span>
        </>
      )}
      {status === "taken" && (
        <>
          <AlertCircle className="w-3 h-3" />
          <span>
            Email already registered.{" "}
            <Link
              to="/login"
              className="underline underline-offset-2 font-medium hover:text-red-700 transition-colors"
            >
              Sign in instead?
            </Link>
          </span>
        </>
      )}
    </div>
  );
}

// ── Password strength helper ──────────────────────────────────────────────────
const passwordRules = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = passwordRules.filter((r) => r.test(password)).length;
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-emerald-400",
  ];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {passwordRules.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < passed ? colors[passed - 1] : "bg-zinc-200"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {passwordRules.map((rule) => {
          const ok = rule.test(password);
          return (
            <span
              key={rule.label}
              className={`flex items-center gap-1 text-[11px] transition-colors ${
                ok ? "text-emerald-600" : "text-zinc-400"
              }`}
            >
              {ok ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              {rule.label}
            </span>
          );
        })}
      </div>
      {password.length > 0 && (
        <p className="text-[11px] text-zinc-500">
          Strength:{" "}
          <span
            className={`font-medium ${passed === 4 ? "text-emerald-600" : "text-zinc-700"}`}
          >
            {labels[Math.max(0, passed - 1)]}
          </span>
        </p>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
    mode: "onChange", // validate on change so isValid email flag is live
  });

  const password = form.watch("password");
  const email = form.watch("email");

  // Only run availability check when the email passes Zod's email format check
  const isValidEmailFormat = z.string().email().safeParse(email).success;
  const emailStatus = useEmailAvailability(email, isValidEmailFormat);

  const socialLogin = async (provider: "google" | "facebook") => {
    await authClient.signIn.social({
      provider,
      callbackURL: import.meta.env.VITE_FRONTEND_URL,
    });
  };

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      // Block submission if email is already taken
      if (emailStatus === "taken") {
        throw new Error("This email is already registered.");
      }

      const { data: signUpData, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        callbackURL: import.meta.env.VITE_FRONTEND_URL,
      });
      if (error) throw new Error(error.message);
      return signUpData;
    },
    onSuccess: () => {
      showToast({
        title: "Account created",
        message: "Welcome! Please check your email to verify your account.",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      showToast({
        title: "Registration failed",
        message: error?.message || "Something went wrong. Please try again.",
        variant: "error",
      });
    },
  });

  const register = (data: RegisterData) => registerMutation.mutate(data);

  // Disable submit while email is being checked or is taken
  const isSubmitBlocked =
    registerMutation.isPending ||
    emailStatus === "checking" ||
    emailStatus === "taken";

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-4">
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 48px)",
        }}
      />

      <div className="relative w-full max-w-[440px] bg-white border border-zinc-200 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-400" />

        <div className="px-8 pt-8 pb-9">
          {/* Header */}
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
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Join thousands of buyers in your workspace
            </p>
          </div>

          {/* OAuth */}
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

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <Separator className="flex-1" />
            <span className="text-xs text-zinc-400 shrink-0">
              or register with email
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(register)} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Jane"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Doe"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Email — with real-time availability check */}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid || emailStatus === "taken"}
                >
                  <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="jane@example.com"
                      aria-invalid={
                        fieldState.invalid || emailStatus === "taken"
                      }
                      required
                      // Subtle right-side tint based on status
                      className={
                        emailStatus === "available"
                          ? "border-emerald-400 focus-visible:ring-emerald-200"
                          : emailStatus === "taken"
                            ? "border-red-400 focus-visible:ring-red-200"
                            : ""
                      }
                    />
                    {/* Inline status icon inside the input */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {emailStatus === "checking" && (
                        <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                      )}
                      {emailStatus === "available" && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      {emailStatus === "taken" && (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Status message below the input */}
                  <EmailStatusIndicator status={emailStatus} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
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
                  <PasswordStrength password={password} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                    >
                      {showConfirm ? (
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

            {/* Terms */}
            <Controller
              control={form.control}
              name="terms"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex gap-2 items-start">
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      id={field.name}
                      className="mt-0.5"
                    />
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm text-zinc-600 cursor-pointer leading-snug font-normal"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-zinc-900 font-medium underline underline-offset-2 hover:text-zinc-600 transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-zinc-900 font-medium underline underline-offset-2 hover:text-zinc-600 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </FieldLabel>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitBlocked}
              className="w-full mt-2 h-10"
            >
              {registerMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Creating account…
                </span>
              ) : emailStatus === "checking" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Verifying email…
                </span>
              ) : (
                <span>Create account</span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-zinc-700 font-medium hover:text-zinc-900 underline underline-offset-2 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
