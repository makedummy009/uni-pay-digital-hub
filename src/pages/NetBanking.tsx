
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import NetBankingHeader from '@/components/netbanking/NetBankingHeader';
import SavedBeneficiaries from '@/components/netbanking/SavedBeneficiaries';
import TransferDetails from '@/components/netbanking/TransferDetails';
import BeneficiaryDetails from '@/components/netbanking/BeneficiaryDetails';
import AdditionalInformation from '@/components/netbanking/AdditionalInformation';

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
        <NetBankingHeader />

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
          <SavedBeneficiaries 
            beneficiaries={savedBeneficiaries}
            onBeneficiarySelect={handleBeneficiarySelect}
          />
        )}

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <TransferDetails
            fromAccount={formData.fromAccount}
            amount={formData.amount}
            onFromAccountChange={(value) => handleInputChange('fromAccount', value)}
            onAmountChange={(value) => handleInputChange('amount', value)}
          />

          <BeneficiaryDetails
            accountNumber={formData.accountNumber}
            reenterAccountNumber={formData.reenterAccountNumber}
            ifscCode={formData.ifscCode}
            beneficiaryName={formData.beneficiaryName}
            onAccountNumberChange={(value) => handleInputChange('accountNumber', value)}
            onReenterAccountNumberChange={(value) => handleInputChange('reenterAccountNumber', value)}
            onIfscCodeChange={(value) => handleInputChange('ifscCode', value)}
            onBeneficiaryNameChange={(value) => handleInputChange('beneficiaryName', value)}
          />

          <AdditionalInformation
            transferType={formData.transferType}
            purpose={formData.purpose}
            remarks={formData.remarks}
            saveAsBeneficiary={formData.saveAsBeneficiary}
            onTransferTypeChange={(value) => handleInputChange('transferType', value)}
            onPurposeChange={(value) => handleInputChange('purpose', value)}
            onRemarksChange={(value) => handleInputChange('remarks', value)}
            onSaveAsBeneficiaryChange={(value) => handleInputChange('saveAsBeneficiary', value)}
          />

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
