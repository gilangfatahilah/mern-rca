import { FormEvent, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

export interface User {
  fullName: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const { signUp, isSigningUp } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<User>({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = (): boolean | string => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signUp(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>

              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Full Name"
              placeholder="Your name"
              value={formData.fullName}
              onChange={(value) =>
                setFormData({ ...formData, fullName: value })
              }
              Icon={User}
              required
            />

            <FormInput
              label="Email"
              placeholder="youremail@example.com"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              Icon={Mail}
              required
            />

            <FormInput
              label="Password"
              placeholder="Your password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(value) =>
                setFormData({ ...formData, password: value })
              }
              Icon={Lock}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isPassword
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to={"/login"} className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
