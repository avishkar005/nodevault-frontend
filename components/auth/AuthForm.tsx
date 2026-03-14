"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/useToast";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Enter valid email"),
  password: z.string().min(1),
});

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords not match",
    path: ["confirmPassword"],
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {

  const router = useRouter();
  const { login, register: registerUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";

  const schema = isLogin ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData | RegisterData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginData | RegisterData) => {

    let success = false;

    if (isLogin) {
      success = await login(
        (data as LoginData).email,
        (data as LoginData).password
      );
    } else {
      success = await registerUser(
        (data as RegisterData).name,
        (data as RegisterData).email,
        (data as RegisterData).password
      );
    }

    if (success) {
      router.replace("/dashboard");
    } else {
      toast({
        title: "Authentication Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[360px] space-y-4">
        <h1 className="text-2xl font-semibold">
          {isLogin ? "Login" : "Register"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {!isLogin && (
            <div>
              <Label>Name</Label>
              <Input {...register("name")} />
              {(errors as any).name && (
                <p className="text-red-500 text-sm">
                  {(errors as any).name.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label>Email</Label>
            <Input {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" {...register("confirmPassword")} />
              {(errors as any).confirmPassword && (
                <p className="text-red-500 text-sm">
                  {(errors as any).confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <Button disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <p className="text-sm text-center">
          {isLogin ? "No account?" : "Already registered?"}{" "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="font-semibold"
          >
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}