import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEducationalTour } from "../hooks/useToursStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { isLoaded, isLoggedIn, login } = useEducationalTour();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setPassword("");
      setError("");
      navigate({ to: "/dashboard" });
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-700">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (isLoggedIn) {
    navigate({ to: "/dashboard" });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-700 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 mb-4">
              <span className="text-3xl">🎬</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Educational Tour Vlog</h1>
            <p className="text-slate-300">Your 7-Day Learning Journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Enter Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-12"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-lg"
            >
              Enter Platform
            </Button>
          </form>

          <div className="mt-8 text-center text-slate-400 text-sm">
            <p>Welcome! Please enter your credentials to access the content editor.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-white text-sm font-semibold">Educational</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl mb-2">🎥</div>
            <p className="text-white text-sm font-semibold">Vlog Format</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl mb-2">🌍</div>
            <p className="text-white text-sm font-semibold">7 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
