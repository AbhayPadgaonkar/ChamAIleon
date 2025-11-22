'use client';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Transfer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    accountNumber: "",
    beneficiaryName: "",
    amount: "",
  });
  const [errors, setErrors] = useState({
    accountNumber: "",
    beneficiaryName: "",
    amount: "",
  });

  const validateForm = () => {
    const newErrors = {
      accountNumber: "",
      beneficiaryName: "",
      amount: "",
    };
    let isValid = true;

    // Account number validation (10-16 digits)
    if (!formData.accountNumber) {
      newErrors.accountNumber = "Account number is required";
      isValid = false;
    } else if (!/^\d{10,16}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 10-16 digits";
      isValid = false;
    }

    // Beneficiary name validation
    if (!formData.beneficiaryName.trim()) {
      newErrors.beneficiaryName = "Beneficiary name is required";
      isValid = false;
    } else if (formData.beneficiaryName.trim().length < 3) {
      newErrors.beneficiaryName = "Name must be at least 3 characters";
      isValid = false;
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
      isValid = false;
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
      isValid = false;
    } else if (parseFloat(formData.amount) > 125840.50) {
      newErrors.amount = "Insufficient balance";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Transfer Successful!",
        description: `₹${parseFloat(formData.amount).toLocaleString("en-IN")} transferred to ${formData.beneficiaryName}`,
      });
      
      // Reset form
      setFormData({
        accountNumber: "",
        beneficiaryName: "",
        amount: "",
      });
      
      // Navigate back after a delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bank Transfer</h1>
            <p className="text-muted-foreground">Send money securely</p>
          </div>
        </div>

        {/* Available Balance Card */}
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Available Balance</div>
            <div className="text-2xl font-bold text-primary">
              ₹125,840.50
            </div>
          </CardContent>
        </Card>

        {/* Transfer Form */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <CardDescription>Enter the recipient's information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className={errors.accountNumber ? "border-destructive" : ""}
                />
                {errors.accountNumber && (
                  <p className="text-sm text-destructive">{errors.accountNumber}</p>
                )}
              </div>

              {/* Beneficiary Name */}
              <div className="space-y-2">
                <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                <Input
                  id="beneficiaryName"
                  type="text"
                  placeholder="Enter beneficiary name"
                  value={formData.beneficiaryName}
                  onChange={(e) => handleInputChange("beneficiaryName", e.target.value)}
                  className={errors.beneficiaryName ? "border-destructive" : ""}
                />
                {errors.beneficiaryName && (
                  <p className="text-sm text-destructive">{errors.beneficiaryName}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className={errors.amount ? "border-destructive" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount}</p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 5000, 10000, 25000].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange("amount", amount.toString())}
                    >
                      ₹{amount.toLocaleString("en-IN")}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" />
                Transfer Money
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Note */}
        <Card className="border-border bg-secondary/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              🔒 Your transaction is secured with bank-grade encryption. Please verify all details before confirming the transfer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transfer;
