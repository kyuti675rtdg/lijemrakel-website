"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
  ArrowLeft,
  Globe,
  ShieldCheck,
  Handshake,
  Check,
} from "lucide-react";

type AuthView = "login" | "forgot" | "reset";

export default function AdminLoginPage() {
  const router = useRouter();
  const [view, setView] = useState<AuthView>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Password Reset State
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const savedEmail = localStorage.getItem("lijemrakel_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get("resetToken");
      if (tokenParam) {
        setResetToken(tokenParam);
        setView("reset");
        setCheckingSession(false);
        return;
      }
    }

    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          router.replace("/admin");
        } else {
          setCheckingSession(false);
        }
      })
      .catch(() => {
        setCheckingSession(false);
      });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("lijemrakel_remember_email", email.trim());
      } else {
        localStorage.removeItem("lijemrakel_remember_email");
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error occurred. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Please enter your registered admin email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not process password reset request.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg(
        data.message ||
          "A password recovery link has been sent to your email address."
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!resetToken.trim() || !newPassword) {
      setError("Please enter your reset token and new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken.trim(),
          newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Password reset failed.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg(
        data.message || "Your password has been updated! You can now sign in."
      );
      setTimeout(() => {
        setView("login");
      }, 1200);
    } catch {
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#052355] animate-spin" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row font-sans selection:bg-[#F7941D] selection:text-white overflow-x-hidden">
      {/* LEFT PANEL: Corporate Global Trade Visual Panel (Matches Reference 1:1) */}
      <div className="relative w-full lg:w-[54%] xl:w-[55%] min-h-[540px] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#D8E9F7] select-none">
        {/* Background Container Ship & Port Image */}
        <img
          src="/images/admin/login-hero-ship.png"
          alt="Lijemrakel Global Trade Container Ship at Port"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600&auto=format&fit=crop&q=85";
          }}
        />

        {/* Soft Airy Sky Gradient at Top-Left for Crisp Navy Typography */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(235,244,252,0.88) 0%, rgba(235,244,252,0.72) 28%, rgba(235,244,252,0.18) 52%, rgba(4,24,56,0.45) 78%, rgba(3,19,46,0.92) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-4/5 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 18% 22%, rgba(245,250,255,0.82) 0%, rgba(245,250,255,0.35) 42%, transparent 72%)",
          }}
        />

        {/* Subtle Network Constellation Lines in Upper-Right Sky */}
        <svg
          className="absolute top-0 right-0 w-[65%] h-[50%] pointer-events-none opacity-60"
          viewBox="0 0 500 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="white" strokeWidth="0.9" strokeOpacity="0.55">
            <line x1="160" y1="90" x2="250" y2="60" />
            <line x1="250" y1="60" x2="340" y2="105" />
            <line x1="340" y1="105" x2="430" y2="70" />
            <line x1="250" y1="60" x2="285" y2="145" />
            <line x1="160" y1="90" x2="210" y2="165" />
            <line x1="210" y1="165" x2="285" y2="145" />
            <line x1="285" y1="145" x2="340" y2="105" />
            <line x1="285" y1="145" x2="375" y2="180" />
            <line x1="340" y1="105" x2="375" y2="180" />
            <line x1="375" y1="180" x2="460" y2="140" />
            <line x1="210" y1="165" x2="260" y2="225" />
            <line x1="285" y1="145" x2="260" y2="225" />
          </g>
          {[
            [160, 90, 2.5],
            [250, 60, 3.5],
            [340, 105, 3],
            [430, 70, 2.5],
            [210, 165, 3],
            [285, 145, 4],
            [375, 180, 3],
            [460, 140, 2.5],
            [260, 225, 2.5],
          ].map(([cx, cy, r], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r={r * 2.8} fill="white" fillOpacity="0.22" />
              <circle cx={cx} cy={cy} r={r} fill="white" />
            </g>
          ))}
        </svg>

        {/* Top Content: Official Logo, Tagline, Headline & Subtitle */}
        <div className="relative z-20 px-8 sm:px-12 xl:px-16 pt-10 sm:pt-14 xl:pt-16">
          {/* Official Brand Logo Lockup */}
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-14 h-14 rounded-xl bg-[#F7941D] p-1.5 shadow-[0_6px_18px_rgba(247,148,29,0.32)] flex items-center justify-center shrink-0 transition-transform group-hover:scale-[1.02]">
              <div className="w-full h-full rounded-[8px] bg-white flex items-center justify-center p-1 overflow-hidden">
                <img
                  src="/images/logo/lijemrakel-logo.png"
                  alt="Lijemrakel Trading PLC Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[26px] sm:text-[30px] font-extrabold tracking-[0.04em] text-[#072146] leading-none">
                LIJEMRAKEL
              </span>
              <span className="text-[13.5px] sm:text-[15px] font-medium tracking-[0.2em] text-[#072146] leading-none mt-1.5">
                TRADING PLC
              </span>
            </div>
          </Link>

          {/* Brand Pillars Sub-header */}
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.15em] text-[#17325C] uppercase">
            <span>GLOBAL TRADE</span>
            <span className="text-[#6984A9] font-normal">/</span>
            <span>TRUSTED PARTNER</span>
            <span className="text-[#6984A9] font-normal">/</span>
            <span>LASTING VALUE</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="mt-7 sm:mt-9 font-heading text-[30px] sm:text-[38px] xl:text-[42px] font-extrabold text-[#072146] leading-[1.16] tracking-[-0.015em] max-w-[520px]">
            Expanding Opportunities
            <br />
            Across Borders
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-3.5 sm:mt-4 text-[14.5px] sm:text-[16px] text-[#284268] font-normal leading-[1.6] max-w-[430px]">
            We connect markets, deliver quality products,
            <br className="hidden sm:inline" /> and build a stronger, sustainable future.
          </p>
        </div>

        {/* Bottom Content: 3 Feature Pillars & Sweeping Orange/Navy Wave Ribbon */}
        <div className="relative z-20 px-8 sm:px-12 xl:px-16 pb-12 sm:pb-14 pt-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 items-center max-w-[600px]">
            {/* Pillar 1 */}
            <div className="flex items-center gap-3 sm:pr-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0">
                <Globe className="w-7 h-7 stroke-[1.6]" />
              </div>
              <div>
                <p className="text-[12.5px] sm:text-[13px] font-bold text-white leading-snug">
                  Import &amp; Export
                </p>
                <p className="text-[10.5px] text-white/75 leading-tight mt-0.5">
                  Global Trade Solutions
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-3 sm:px-5 sm:border-l sm:border-white/25">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-7 h-7 stroke-[1.6]" />
              </div>
              <div>
                <p className="text-[12.5px] sm:text-[13px] font-bold text-white leading-snug">
                  Reliable Supply
                </p>
                <p className="text-[10.5px] text-white/75 leading-tight mt-0.5">
                  Quality You Can Trust
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-3 sm:pl-5 sm:border-l sm:border-white/25">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0">
                <Handshake className="w-7 h-7 stroke-[1.6]" />
              </div>
              <div>
                <p className="text-[12.5px] sm:text-[13px] font-bold text-white leading-snug">
                  Long-Term Partnership
                </p>
                <p className="text-[10.5px] text-white/75 leading-tight mt-0.5">
                  Growing Together
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Left Sweeping Orange & Dark Navy Wave Accent (Matches Reference) */}
        <svg
          className="absolute bottom-0 left-0 w-[60%] max-w-[440px] h-24 pointer-events-none z-10"
          viewBox="0 0 440 96"
          fill="none"
           preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orange Sweeping Ribbon */}
          <path
            d="M0 10 C 75 35, 130 76, 265 96 L 0 96 Z"
            fill="#F7941D"
          />
          {/* Deep Navy Inner Cutout Wave */}
          <path
            d="M0 28 C 68 52, 118 82, 200 96 L 0 96 Z"
            fill="#041938"
          />
        </svg>
      </div>

      {/* RIGHT PANEL: Clean White Centered Form Panel (Matches Reference 1:1) */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 min-h-[520px] lg:min-h-screen">
        <div className="w-full max-w-[390px]">
          {/* Alerts */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs font-medium leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs font-medium leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW 1: LOGIN */}
          {view === "login" && (
            <div>
              <h2 className="font-heading text-[32px] sm:text-[36px] font-extrabold text-[#072146] tracking-tight leading-tight">
                Welcome Back
              </h2>
              <p className="mt-2.5 text-[14.5px] text-[#5A6B82] leading-[1.55]">
                Sign in to your admin account to continue
                <br />
                managing the platform.
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <Mail className="w-[18px] h-[18px] text-[#6E7F96] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#DCE3EE] rounded-xl text-[14px] text-[#072146] placeholder:text-[#8C9BB0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className="w-[18px] h-[18px] text-[#6E7F96] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-11 pr-11 py-3.5 bg-white border border-[#DCE3EE] rounded-xl text-[14px] text-[#072146] placeholder:text-[#8C9BB0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E7F96] hover:text-[#072146] p-1 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between pt-1 pb-1.5">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={rememberMe}
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-colors border ${
                        rememberMe
                          ? "bg-[#2563EB] border-[#2563EB] text-white"
                          : "bg-white border-[#CBD5E1] text-transparent hover:border-[#2563EB]"
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="text-[13px] font-medium text-[#475569]">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSuccessMsg("");
                      setView("forgot");
                    }}
                    className="text-[13px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#052355] hover:bg-[#082E6E] active:bg-[#041B42] disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl shadow-[0_6px_18px_rgba(5,35,85,0.22)] transition-all flex items-center justify-center gap-2.5 text-[15px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Secure Login Divider */}
                <div className="pt-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#E6ECF5]" />
                  <span className="text-[12px] font-medium text-[#8C9BB0]">
                    Secure Login
                  </span>
                  <div className="h-px flex-1 bg-[#E6ECF5]" />
                </div>
              </form>
            </div>
          )}

          {/* VIEW 2: FORGOT PASSWORD */}
          {view === "forgot" && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMsg("");
                  setView("login");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B82] hover:text-[#072146] mb-5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
              <h2 className="font-heading text-[28px] sm:text-[32px] font-extrabold text-[#072146] tracking-tight">
                Password Recovery
              </h2>
              <p className="mt-2 text-[14px] text-[#5A6B82] leading-relaxed">
                Enter your registered admin email address to receive a 6-digit verification code.
              </p>

              <form onSubmit={handleRequestReset} className="mt-7 space-y-4">
                <div className="relative">
                  <Mail className="w-[18px] h-[18px] text-[#6E7F96] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#DCE3EE] rounded-xl text-[14px] text-[#072146] placeholder:text-[#8C9BB0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#052355] hover:bg-[#082E6E] disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl shadow-[0_6px_18px_rgba(5,35,85,0.22)] transition-all flex items-center justify-center gap-2 text-[15px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* VIEW 3: RESET PASSWORD */}
          {view === "reset" && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMsg("");
                  setView("login");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B82] hover:text-[#072146] mb-5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
              <h2 className="font-heading text-[28px] sm:text-[32px] font-extrabold text-[#072146] tracking-tight">
                Set New Password
              </h2>
              <p className="mt-2 text-[14px] text-[#5A6B82] leading-relaxed">
                Choose a new password for your administrator account.
              </p>

              <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                <div className="relative">
                  <KeyRound className="w-[18px] h-[18px] text-[#6E7F96] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Password Reset Token"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#DCE3EE] rounded-xl text-[14px] font-mono text-[#072146] placeholder:font-sans placeholder:text-[#8C9BB0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-[18px] h-[18px] text-[#6E7F96] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min. 8 characters)"
                    className="w-full pl-11 pr-11 py-3.5 bg-white border border-[#DCE3EE] rounded-xl text-[14px] text-[#072146] placeholder:text-[#8C9BB0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E7F96] hover:text-[#072146] p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-[18px] h-[18px] text-[#6E7F96] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#DCE3EE] rounded-xl text-[14px] text-[#072146] placeholder:text-[#8C9BB0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#052355] hover:bg-[#082E6E] disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl shadow-[0_6px_18px_rgba(5,35,85,0.22)] transition-all flex items-center justify-center gap-2 text-[15px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password &amp; Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
