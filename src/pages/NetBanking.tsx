
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Beneficiary {
  id: string;
  accountNumber: string;
  ifscCode: string;
  name: string;
}

const NetBanking = () => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    amount: '',
    accountNumber: '',
    reenterAccountNumber: '',
    ifscCode: '',
    beneficiaryName: '',
    transferType: '',
    purpose: '',
    remarks: '',
    saveAsBeneficiary: false
  });
  
  const [savedBeneficiaries, setSavedBeneficiaries] = useState<Beneficiary[]>([]);
  const [showSavedBeneficiaries, setShowSavedBeneficiaries] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load saved beneficiaries from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedBeneficiaries');
    if (saved) {
      setSavedBeneficiaries(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setFormData(prev => ({
      ...prev,
      accountNumber: beneficiary.accountNumber,
      reenterAccountNumber: beneficiary.accountNumber,
      ifscCode: beneficiary.ifscCode,
      beneficiaryName: beneficiary.name
    }));
    setShowSavedBeneficiaries(false);
  };

  const saveBeneficiary = () => {
    if (formData.accountNumber && formData.ifscCode && formData.beneficiaryName) {
      const newBeneficiary: Beneficiary = {
        id: Date.now().toString(),
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        name: formData.beneficiaryName
      };
      
      const updatedBeneficiaries = [...savedBeneficiaries, newBeneficiary];
      setSavedBeneficiaries(updatedBeneficiaries);
      localStorage.setItem('savedBeneficiaries', JSON.stringify(updatedBeneficiaries));
      
      toast({
        title: "Beneficiary Saved",
        description: "Beneficiary details have been saved for future transfers.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.accountNumber !== formData.reenterAccountNumber) {
      toast({
        title: "Error",
        description: "Account numbers do not match.",
        variant: "destructive"
      });
      return;
    }

    // Save beneficiary if checkbox is checked
    if (formData.saveAsBeneficiary) {
      saveBeneficiary();
    }

    toast({
      title: "Transfer Initiated",
      description: `₹${formData.amount} transfer to ${formData.beneficiaryName} has been initiated.`,
    });

    console.log('Transfer submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Net Banking - Fund Transfer</h1>
            <p className="text-gray-600 mt-1">Transfer funds to other accounts securely</p>
          </div>
          <span className="text-sm text-gray-500 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            Demo Transaction
          </span>
        </div>

        {/* Transfer Type Buttons */}
        <div className="flex space-x-4 mb-6">
          <Button 
            variant={!showSavedBeneficiaries ? "default" : "outline"}
            onClick={() => setShowSavedBeneficiaries(false)}
            className={!showSavedBeneficiaries ? "bg-primary text-white" : ""}
          >
            New Transfer
          </Button>
          <Button 
            variant={showSavedBeneficiaries ? "default" : "outline"}
            onClick={() => setShowSavedBeneficiaries(true)}
            className={showSavedBeneficiaries ? "bg-primary text-white" : ""}
          >
            Saved Beneficiaries
          </Button>
        </div>

        {/* Saved Beneficiaries List */}
        {showSavedBeneficiaries && (
          <Card className="mb-6 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Saved Beneficiaries</CardTitle>
            </CardHeader>
            <CardContent>
              {savedBeneficiaries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No saved beneficiaries yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Add new transfers and save them for future use.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedBeneficiaries.map((beneficiary) => (
                    <div 
                      key={beneficiary.id}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                      onClick={() => handleBeneficiarySelect(beneficiary)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">{beneficiary.name}</p>
                          <p className="text-sm text-gray-600">Account: {beneficiary.accountNumber}</p>
                          <p className="text-sm text-gray-600">IFSC: {beneficiary.ifscCode}</p>
                        </div>
                        <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From Account and Amount */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-gray-900">Transfer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromAccount" className="text-sm font-medium text-gray-700">From Account</Label>
                  <Select value={formData.fromAccount} onValueChange={(value) => handleInputChange('fromAccount', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings-1234">Savings Account - ****1234</SelectItem>
                      <SelectItem value="current-5678">Current Account - ****5678</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter transfer amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beneficiary Details */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-blue-600">Beneficiary Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter beneficiary account number"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reenterAccountNumber" className="text-sm font-medium text-gray-700">Re-enter Account Number</Label>
                  <Input
                    id="reenterAccountNumber"
                    placeholder="Confirm account number"
                    value={formData.reenterAccountNumber}
                    onChange={(e) => handleInputChange('reenterAccountNumber', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode" className="text-sm font-medium text-gray-700">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    placeholder="Enter IFSC code (e.g., HDFC0000123)"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaryName" className="text-sm font-medium text-gray-700">Beneficiary Name</Label>
                  <Input
                    id="beneficiaryName"
                    placeholder="Enter full name as per bank account"
                    value={formData.beneficiaryName}
                    onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Transfer Details */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-green-600">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transferType" className="text-sm font-medium text-gray-700">Transfer Type</Label>
                  <Select value={formData.transferType} onValueChange={(value) => handleInputChange('transferType', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select transfer method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neft">NEFT (National Electronic Funds Transfer)</SelectItem>
                      <SelectItem value="rtgs">RTGS (Real Time Gross Settlement)</SelectItem>
                      <SelectItem value="imps">IMPS (Immediate Payment Service)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">Purpose of Transfer</Label>
                  <Select value={formData.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family-maintenance">Family Maintenance</SelectItem>
                      <SelectItem value="education">Education Expenses</SelectItem>
                      <SelectItem value="medical">Medical Treatment</SelectItem>
                      <SelectItem value="business">Business Transaction</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  placeholder="Add any additional notes or comments"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="saveAsBeneficiary"
                  checked={formData.saveAsBeneficiary}
                  onCheckedChange={(checked) => handleInputChange('saveAsBeneficiary', checked as boolean)}
                />
                <Label htmlFor="saveAsBeneficiary" className="text-sm text-gray-700 cursor-pointer">
                  Save this beneficiary for future transfers
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="px-12 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-lg h-12 min-w-[200px]"
            >
              Proceed with Transfer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NetBanking;
