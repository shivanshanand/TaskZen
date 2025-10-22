import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle, Calendar, BarChart2, Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-2">
      <Card className="w-full max-w-2xl shadow-xl p-0 overflow-hidden">
        {/* Brand & Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <div className="mb-3 text-4xl font-extrabold tracking-tight">
            TaskZen <span className="text-yellow-300">AI</span>
          </div>
          <div className="text-lg font-medium mb-2">
            <span className="italic">
              Your all-in-one calendar-powered todo app.
            </span>
          </div>
          <CardDescription className="text-white/80 text-base">
            Plan. Focus. Succeed — from daily tasks to big goals, with beautiful
            UI, analytics, and AI assistance.
          </CardDescription>
        </div>
        {/* Benefits/features */}
        <CardContent className="flex flex-col md:flex-row gap-4 justify-center px-5 py-6 bg-gradient-to-br from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <Calendar className="h-5 w-5" /> Smart calendar scheduling
            </div>
            <div className="flex items-center gap-2 text-purple-600 font-medium">
              <BarChart2 className="h-5 w-5" /> Real-time analytics & streaks
            </div>
            <div className="flex items-center gap-2 text-yellow-600 font-medium">
              <Zap className="h-5 w-5" /> Fast AI suggestions & reminders
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <CheckCircle className="h-5 w-5" /> Distraction-free experience
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
              className="w-full"
            >
              <Button
                type="submit"
                className="w-full h-12 mt-4 rounded-lg shadow-lg bg-gradient-to-tr from-blue-600 to-purple-600 text-lg font-bold"
                size="lg"
              >
                <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </form>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              No registration needed. Secure login with Google. <br />
              By continuing, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>
              &nbsp;and&nbsp;
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
