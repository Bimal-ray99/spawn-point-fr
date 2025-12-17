"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

// UI Components
import Breadcrumb from "@/components/common/Breadcrumb";
import Badge from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { FormError } from "@/components/ui/form-error";

import { loginPageContent } from "@/constants/loginSchema"; // Reusing content or create new if needed
import ShapeDeco from "@/components/ShapeDeco";
import Ready from "@/components/Ready";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";
import { registerSchema } from "@/lib/schemas";

export default function Register() {
  const router = useRouter();
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      gamerTag: "",
      phone: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    // Prepend +91 to phone number
    const payload = {
      ...data,
      phone: `+91${data.phone}`,
    };

    try {
      // Using specific API route
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (response.success) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        // Handle detailed backend errors
        let msg = response.message || "Registration failed.";
        if (response.error) {
          if (response.error.details) {
            msg = response.error.details;
          } else if (response.error.message) {
            msg = response.error.message;
          }
        }
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = "An error occurred. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <>
      <Breadcrumb title="Register" breadCrumb="register" />
      <section
        ref={containerRef}
        className="relative min-h-screen w-full overflow-hidden bg-white py-0 dark:bg-dark"
      >
        <div className="pointer-events-none absolute top-0 z-0 h-full w-full overflow-hidden opacity-10">
          <div className="absolute top-1/2 left-12 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] -rotate-90">
            <ScrollingText
              text="REGISTER REGISTER REGISTER"
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
                  text="Join the community"
                  badgeText="Sign Up"
                  textColor="text-white"
                  backgroundColor="bg-secondary"
                  badgeBackgroundColor="bg-white"
                  className="mb-6"
                />

                <h1 className="text-black dark:text-black text-5xl md:text-7xl my-4 font-DurkItalic font-medium leading-relaxed">
                  Create Account<span className="text-secondary">.</span>
                </h1>

                <p className="mb-10 max-w-lg text-gray-600">
                  Join thousands of gamers and start your journey today.
                </p>

                <FormError message={error} />

                <div className="mb-10 mt-6 rounded-xl bg-gray-50 text-black dark:text-black p-6 shadow-md transition-shadow duration-300 hover:shadow-2xl sm:p-8">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                      noValidate
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Full Name <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Email <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="email@example.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Password <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <PasswordInput
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gamerTag"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gamer Tag</FormLabel>
                              <FormControl>
                                <Input placeholder="ProGamer123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Phone <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <PhoneInput
                                  placeholder="1234567890"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Date of Birth{" "}
                                <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
                        }}
                      >
                        {isLoading ? "Creating Account..." : "Register"}
                      </button>

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-gray-50 px-2 text-gray-500">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <FcGoogle className="h-5 w-5" />
                        Sign in with Google
                      </button>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                          Already have an account?{" "}
                          <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                          >
                            Login
                          </Link>
                        </p>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>

            {/* Image Section - Reusing Login Image for now or placeholder */}
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
                  src="/login/tournament-video.jpg" // Using same image as login for consistency
                  alt="register page image"
                  fill
                  className="object-cover opacity-90"
                />
                <ShapeDeco primaryColor="bg-black" width="70%" height={40} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70 z-20"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-30">
                  <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                    Join the Arena
                  </h3>
                  <p className="mb-4 max-w-md text-white">
                    Create your profile and start competing in top-tier
                    tournaments.
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
