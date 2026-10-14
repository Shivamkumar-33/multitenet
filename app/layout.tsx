import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Toaster } from "sonner";
import { syncUserToDatabase } from "@/lib/sync-user";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuAI - AI-Powered Document Analysis",
  description: "Analyze and collaborate on documents with Google Gemini AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = Boolean(
    publishableKey &&
      (publishableKey.startsWith("pk_test_") || publishableKey.startsWith("pk_live_"))
  );

  if (!isClerkConfigured) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6 text-slate-900">
            <div className="max-w-xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                  D
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">DocuAI Setup</h1>
                  <p className="text-sm text-slate-500">Configure your credentials in .env to activate the app</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm space-y-1">
                <p className="font-semibold flex items-center gap-2">
                  <span>⚠️</span> Missing or Placeholder Clerk Key
                </p>
                <p className="text-amber-800">
                  Your <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> is currently set to the default placeholder.
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <h2 className="font-semibold text-slate-900">Follow these 3 quick steps:</h2>
                
                <ol className="list-decimal list-inside space-y-3">
                  <li className="pl-1">
                    <span className="font-medium text-slate-900">Get Clerk API Keys:</span>
                    <p className="text-slate-600 pl-5 pt-1">
                      Go to <a href="https://clerk.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">clerk.com</a> → Create an application → Navigate to <strong>API Keys</strong>.
                    </p>
                  </li>
                  
                  <li className="pl-1">
                    <span className="font-medium text-slate-900">Update your .env file:</span>
                    <div className="mt-1.5 pl-5">
                      <pre className="bg-slate-900 text-slate-100 text-xs p-3 rounded-lg overflow-x-auto font-mono">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...`}
                      </pre>
                    </div>
                  </li>

                  <li className="pl-1">
                    <span className="font-medium text-slate-900">Save and Refresh:</span>
                    <p className="text-slate-600 pl-5 pt-1">
                      Save <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono font-bold">.env</code>. The application will detect the change and load immediately!
                    </p>
                  </li>
                </ol>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Server running on localhost:3000</span>
                <span>Next.js 16 + Turbopack</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  await syncUserToDatabase();
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
