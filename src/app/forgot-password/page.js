"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// UI Components
import Breadcrumb from "@/components/common/Breadcrumb";
import Badge from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";

import ShapeDeco from "@/components/ShapeDeco";
import Ready from "@/components/Ready";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";
import { forgotPasswordSchema } from "@/lib/schemas";

export default function ForgotPassword() {
  const router = useRouter();
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const throttle = (callback, delay) => {
      let lastCall = 0;
      return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
          return;
        }
        lastCall = now;
        return callback(...args);
      };
    };

    const handleMouseMove = throttle((e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    }, 50);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (response.success) {
        setSuccess(
          "If an account exists with that email, we sent you a reset link."
        );
      } else {
        setError(response.message || "Request failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Forgot Password" breadCrumb="forgot-password" />
      <section
        ref={containerRef}
        className="relative min-h-screen w-full overflow-hidden bg-white py-0 dark:bg-dark"
      >
        <div className="pointer-events-none absolute top-0 z-0 h-full w-full overflow-hidden opacity-10">
          <div className="absolute top-1/2 left-12 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] -rotate-90">
            <ScrollingText
              text="RECOVERY RECOVERY RECOVERY"
              className="text-[20vh] font-DurkBoldItalic uppercase whitespace-nowrap text-gray-800"
              scrubSpeed={2}
              scrollTrigger={containerRef}
            />
          </div>
        </div>

        <div className="relative z-10 mx-0 px-0">
          <div className="flex flex-col items-start lg:flex-row">
            <ShapeDeco
              primaryColor="bg-primary"
              width="30%"
              height={40}
              position="bottom-left"
            />
            <div className="relative order-2 mt-12 w-full px-4 lg:order-1 lg:mt-0 lg:w-1/2 lg:px-12 xl:px-24">
              <div className="relative z-10 py-10 lg:py-24">
                <Badge
                  text="Account Recovery"
                  badgeText="Reset"
                  textColor="text-white"
                  backgroundColor="bg-secondary"
                  badgeBackgroundColor="bg-white"
                  className="mb-6"
                />

                <h1 className="text-black dark:text-black text-5xl md:text-7xl my-4 font-DurkItalic font-medium leading-relaxed">
                  Forgot Password<span className="text-secondary">.</span>
                </h1>

                <p className="mb-10 max-w-lg text-gray-600">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>

                <FormError message={error} />
                {success && (
                  <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-600 border border-green-200">
                    {success}
                  </div>
                )}

                <div className="mb-10 mt-6 rounded-xl bg-gray-50 text-black dark:text-black p-6 shadow-md transition-shadow duration-300 hover:shadow-2xl sm:p-8">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Your Email <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="email@website.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
                        }}
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </button>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                          Remember your password?{" "}
                          <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                          >
                            Back to Login
                          </Link>
                        </p>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="hidden lg:block relative order-1 h-[70vh] w-full lg:h-screen lg:w-1/2">
              <div
                className="h-full w-full relative"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 28px) 0, 100% 0%, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
                }}
              >
                <div className="halftone-overlay opacity-[10%] absolute inset-0 z-10" />
                <Image
                  src="/login/tournament-video.jpg"
                  alt="forgot password image"
                  fill
                  className="object-cover opacity-90"
                />
                <ShapeDeco primaryColor="bg-black" width="70%" height={40} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70 z-20"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-30">
                  <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                    Secure & Safe
                  </h3>
                  <p className="mb-4 max-w-md text-white">
                    We prioritize your account security. Reset your password to
                    regain access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Ready />
    </>
  );
}
