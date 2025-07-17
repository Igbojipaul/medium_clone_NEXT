"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from "next/link";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    router.push("/feed");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    if (form.password !== form.password2) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      await register(form)
      router.push("/feed")
    } catch (err) {
      console.log(err);
      
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-r from-gray-800 to-gray-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <div className="text-white font-bold text-xl">GRAY.</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
            <p className="text-gray-600 mt-2">Join our community today</p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 py-5"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Google</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 py-5"
            >
              <FaApple className="w-5 h-5 text-gray-800" />
              <span>Apple</span>
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="py-5 px-4 text-base rounded-xl"
                placeholder="Choose a username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="py-5 px-4 text-base rounded-xl"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="py-5 px-4 text-base rounded-xl"
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <Input
                name="password2"
                type="password"
                value={form.password2}
                onChange={handleChange}
                required
                className="py-5 px-4 text-base rounded-xl"
                placeholder="Confirm your password"
              />
            </div>
            
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-red-700 text-sm whitespace-pre-wrap">
                {error}
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full py-6 text-base cursor-pointer text-gray-200 rounded-xl bg-gradient-to-r from-gray-800 to-gray-500 hover:from-gray-900 hover:to-gray-600 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}