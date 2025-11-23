"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase"; // adjust path if needed

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"; // if you have a spinner component; otherwise fallback
import { toast } from "sonner"; // ensure Toaster is in layout

export default function Dashboard() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true); // initial auth loading
  const [adminLoading, setAdminLoading] = useState(false); // for fetching admin doc
  const [admin, setAdmin] = useState(null); // admin doc data
  const [uid, setUid] = useState(null);

  // UI states
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  // listen for auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoadingAuth(false);
        router.push("/admin/signin"); // redirect to admin sign-in, adjust route
        return;
      }
      setUid(user.uid);
      setLoadingAuth(false);

      // fetch admin doc
      setAdminLoading(true);
      try {
        const dref = doc(db, "admin", user.uid);
        const snap = await getDoc(dref);
        if (snap.exists()) {
          setAdmin(snap.data());
        } else {
          // If no admin doc, sign out and redirect
          await signOut(auth);
          router.push("/admin/signin");
          toast.error("Not authorized as admin.");
        }
      } catch (err) {
        console.error("Failed fetching admin:", err);
        toast.error("Failed to load admin profile.");
      } finally {
        setAdminLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  // Close popover when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [popoverOpen]);

  // Derived values
  const displayName = admin?.Name || `${admin?.firstName || ""} ${admin?.lastName || ""}`.trim() || "";
  const initials = (() => {
    if (!displayName) return "";
    const parts = displayName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  // Logout
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut(auth);
      toast.success("Logged out");
      router.push("/admin/signin");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
      setLogoutLoading(false);
    }
  };

  // Save Reports placeholder
  const handleSaveReports = async () => {
    setReportLoading(true);
    try {
      // TODO: replace with actual report generation API call
      // await fetch("/api/admin/generate-report", { method: "POST", body: ... })
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Report saved to Reports folder (demo)");
    } catch (err) {
      console.error("Report error:", err);
      toast.error("Failed to save report");
    } finally {
      setReportLoading(false);
    }
  };

  // loading skeleton
  if (loadingAuth || adminLoading) {
    return (
      <div className="min-h-screen bg-background px-8 py-4 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Logo />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <div className="text-muted-foreground">Loading admin...</div>
          </div>
        </div>
      </div>
    );
  }

  // main UI
  return (
    <div className="min-h-screen bg-background px-8 py-4">
    <header className="flex items-center justify-between w-full">
  
  {/* LEFT — Logo */}
  <div className="flex items-center">
    <Logo />
  </div>

  {/* RIGHT — Save Reports + Admin Avatar */}
  <div className="flex items-center gap-6">

    {/* Save Reports */}
    <Button
      variant="outline"
      onClick={handleSaveReports}
      disabled={reportLoading}
    >
      {reportLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Saving...
        </span>
      ) : (
        "Save Reports"
      )}
    </Button>

    {/* Admin Name + Initials Popover */}
    <div className="relative" ref={popoverRef}>
      <div className="flex items-center gap-3">
        <div className="text-right mr-1">
          <div className="text-sm font-medium text-foreground">
            {displayName || "Admin"}
          </div>
          <div className="text-xs text-muted-foreground">Administrator</div>
        </div>

        <button
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold"
          onClick={() => setPopoverOpen((s) => !s)}
          aria-expanded={popoverOpen}
        >
          {initials || "AD"}
        </button>
      </div>

      {popoverOpen && (
        <div className="absolute right-0 mt-3 w-44 bg-card border border-border rounded-lg shadow-md z-30">
          <div className="p-3">
            <button
              className="w-full text-left px-3 py-2 rounded hover:bg-secondary/30"
              onClick={() => {
                router.push("/admin/profile");
                setPopoverOpen(false);
              }}
            >
              Profile
            </button>

            <hr className="my-2" />

            <button
              className="w-full text-left px-3 py-2 rounded text-destructive hover:bg-secondary/30 flex items-center justify-between"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>

  </div>
</header>
      <main className="mt-8">
        {/* Insert dashboard content here */}
        <div className="max-w-7xl mx-auto">
        
          <div className="mt-6">{/* ... */}</div>
        </div>
      </main>
    </div>
  );
}
