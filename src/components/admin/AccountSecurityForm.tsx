"use client";

import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function AccountSecurityForm() {
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "loading" }
    | { type: "success"; message: string }
    | { type: "error"; message: string }
  >({ type: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 12) {
      setStatus({
        type: "error",
        message: "Use at least 12 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "The passwords do not match.",
      });
      return;
    }

    setStatus({ type: "loading" });
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setStatus({
      type: "success",
      message: "Your password has been updated.",
    });
  }

  return (
    <Card className="max-w-xl p-6 sm:p-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="new-password">
            New password
          </label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="confirm-password">
            Confirm password
          </label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {status.type === "error" ? (
          <p className="text-sm text-red-700" role="alert">
            {status.message}
          </p>
        ) : null}

        {status.type === "success" ? (
          <p className="text-sm text-emerald-700" role="status">
            {status.message}
          </p>
        ) : null}

        <Button type="submit" disabled={status.type === "loading"}>
          {status.type === "loading" ? "Updating..." : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
