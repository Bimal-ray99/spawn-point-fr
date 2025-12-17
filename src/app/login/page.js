"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

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
import { FormError } from "@/components/ui/form-error";

import { loginPageContent } from "@/constants/loginSchema";
import ShapeDeco from "@/components/ShapeDeco";
import Ready from "@/components/Ready";
import { ScrollingText } from "@/components/ScrollingText/ScrollingText";
import { loginSchema } from "@/lib/schemas";

export default function Login() {
  const router = useRouter();
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Text parallax effect with throttled event listener
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Throttle function to limit the rate of function calls
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
    }, 50); // Update position at most every 50ms

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Form initialization with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login...");
      // Using specific API route
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const response = await res.json();

      console.log("Login response:", response);

      if (response.success) {
        // Store token and user data - API returns accessToken not token
        const token = response.data.accessToken || response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log("Token stored:", token ? "YES" : "NO");
        console.log("User stored:", response.data.user ? "YES" : "NO");

        // Redirect to profile page
        router.push("/profile");
      } else {
        let msg =
          response.message || "Login failed. Please check your credentials.";
        if (response.error) {
          if (response.error.details) {
            msg = response.error.details;
          } else if (response.error.message) {
            msg = response.error.message;
          }
        }
        setError(msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <>
      <Breadcrumb title="Login" breadCrumb="login" />
      <section
        ref={containerRef}
        className="relative min-h-screen w-full overflow-hidden bg-white py-0 dark:bg-dark"
      >
        {/* Background text with mouse movement */}
        <div className="pointer-events-none absolute top-0 z-0 h-full w-full overflow-hidden opacity-10">
          <div className="absolute top-1/2 left-12 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] -rotate-90">
            <ScrollingText
              text={`${loginPageContent.backgroundText} ${loginPageContent.backgroundText} ${loginPageContent.backgroundText}`}
              className="text-[20vh] font-DurkBoldItalic uppercase whitespace-nowrap text-gray-800"
              scrubSpeed={2}
              scrollTrigger={containerRef}
            />
          </div>
        </div>

        <div className="relative z-10 mx-0 px-0">
          <div className="flex flex-col items-start lg:flex-row">
            {/* Content Section - Login Form */}
            <ShapeDeco
              primaryColor="bg-primary"
              width="30%"
              height={40}
              position="bottom-left"
            />
            <div className="relative order-2 mt-12 w-full px-4 lg:order-1 lg:mt-0 lg:w-1/2 lg:px-12 xl:px-24">
              <div className="relative z-10 py-10 lg:py-24">
                {/* Badge */}
                <Badge
                  text={loginPageContent.subtitle}
                  badgeText={loginPageContent.badge}
                  textColor="text-white"
                  backgroundColor="bg-secondary"
                  badgeBackgroundColor="bg-white"
                  className="mb-6"
                />

                {/* Heading */}
                <h1 className="text-black dark:text-black text-5xl md:text-7xl my-4 font-DurkItalic font-medium leading-relaxed">
                  {loginPageContent.title}
                  <span className="text-secondary">.</span>
                </h1>

                {/* Description */}
                <p className="mb-10 max-w-lg text-gray-600">
                  {loginPageContent.description}
                </p>

                {/* Error message */}
                <FormError message={error} />

                {/* Login Form */}
                <div className="mb-10 rounded-xl bg-gray-50 text-black dark:text-black p-6 shadow-md transition-shadow duration-300 hover:shadow-2xl sm:p-8">
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
                              Your Email
                              <span className="ml-1 text-primary">*</span>
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

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Password
                              <span className="ml-1 text-primary ">*</span>
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

                      <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                        <FormField
                          control={form.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer text-sm font-normal">
                                Remember me
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <Link
                          href={loginPageContent.forgotPasswordLink}
                          className="text-sm text-gray-600 transition-colors hover:text-primary"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
                        }}
                      >
                        {isLoading ? "Logging in..." : "Login"}
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
                          Dont have an account?{" "}
                          <Link
                            href={loginPageContent.registerLink}
                            className="font-medium text-primary hover:underline"
                          >
                            Sign Up
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
                {/* Image */}
                <div className="halftone-overlay opacity-[10%] absolute inset-0 z-10" />
                <Image
                  src={loginPageContent.imageSrc}
                  alt="login page image"
                  fill
                  className="object-cover opacity-90"
                />

                <ShapeDeco primaryColor="bg-black" width="70%" height={40} />

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70 z-20"></div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-30">
                  <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                    {loginPageContent.imageTitle}
                  </h3>
                  <p className="mb-4 max-w-md text-white">
                    {loginPageContent.imageDescription}
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                      24/7 Support
                    </div>
                  </div>
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
