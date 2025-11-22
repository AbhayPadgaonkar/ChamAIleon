"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Firebase Imports
import { auth, db } from "../firebase"; // Ensure this path matches your project structure
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Index = () => {
  const router = useRouter();
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // 1. Listen for Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login"); // Redirect if not logged in
      } else {
        
        // 2. Once we have the UID, Listen to the Firestore Document
        const docRef = doc(db, "users", currentUser.uid);

        // onSnapshot gives real-time updates
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No user data found");
          }
          setLoading(false); // Data loaded
        });

        // Cleanup listener when component unmounts or user changes
        return () => unsubscribeSnapshot();
      }
    });

    // Cleanup auth listener
    return () => unsubscribeAuth();
  }, [router]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  // --- EMPTY STATE (Safe guard) ---
  if (!userData) return null;

  // Extract data with fallbacks to prevent crashes
  const balance = userData.accBalance || 0;
  const transactions = userData.transactions || [];
  const fixedDeposits = userData.fixedDeposits || [];
  const documents = userData.documents || [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {userData.firstName} {userData.lastName}
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link href="/transferPage">
              <Send className="h-4 w-4" />
              Transfer Money
            </Link>
          </Button>
        </div>

        {/* Account Balance Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Account Balance</CardTitle>
                <CardDescription>Savings Account - ****{userData.uid.slice(0,4)}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {showBalance
                ? `₹${balance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}`
                : "••••••••"}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                 <p className="text-muted-foreground text-sm">No transactions yet.</p>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          transaction.type === "credit"
                            ? "bg-green-100 dark:bg-green-900/20"
                            : "bg-red-100 dark:bg-red-900/20"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : ""}₹
                      {Math.abs(transaction.amount).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fixed Deposits */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Fixed Deposits</CardTitle>
            <CardDescription>Your investment portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {fixedDeposits.length === 0 ? (
                 <p className="text-muted-foreground text-sm col-span-2">No active fixed deposits.</p>
              ) : (
                fixedDeposits.map((fd) => (
                  <div
                    key={fd.id}
                    className="rounded-lg border border-border bg-secondary/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        FD Amount
                      </span>
                      <Badge variant="secondary">{fd.tenure}</Badge>
                    </div>
                    <div className="mb-1 text-2xl font-bold text-foreground">
                      ₹{fd.amount.toLocaleString("en-IN")}
                    </div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Interest Rate:{" "}
                      <span className="font-semibold text-primary">
                        {fd.rate}% p.a.
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Matures on: {fd.maturityDate}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Your bank documents and statements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.length === 0 ? (
                 <p className="text-muted-foreground text-sm">No documents found.</p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;