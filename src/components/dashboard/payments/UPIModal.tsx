
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smartphone } from 'lucide-react';

interface UPIModalProps {
  open: boolean;
  onClose: () => void;
}

const UPIModal: React.FC<UPIModalProps> = ({ open, onClose }) => {
  const [upiId, setUpiId] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', logo: '🔵', color: 'bg-blue-50 hover:bg-blue-100' },
    { id: 'phonepe', name: 'PhonePe', logo: '🟣', color: 'bg-purple-50 hover:bg-purple-100' },
    { id: 'paytm', name: 'Paytm', logo: '🔵', color: 'bg-blue-50 hover:bg-blue-100' },
    { id: 'amazon', name: 'Amazon Pay', logo: '🟠', color: 'bg-orange-50 hover:bg-orange-100' },
    { id: 'bhim', name: 'BHIM', logo: '🟢', color: 'bg-green-50 hover:bg-green-100' },
    { id: 'razorpay', name: 'Razorpay', logo: '🔵', color: 'bg-blue-50 hover:bg-blue-100' },
  ];

  const handleVerify = () => {
    if (upiId.includes('@')) {
      setIsVerified(true);
      alert('UPI ID verified successfully!');
    } else {
      alert('Please enter a valid UPI ID (e.g., user@paytm)');
    }
  };

  const handlePayNow = () => {
    if (selectedApp && isVerified) {
      alert(`Redirecting to ${selectedApp} for payment... This is a demo implementation.`);
      onClose();
    } else {
      alert('Please select a UPI app and verify your UPI ID first.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone size={20} />
            Pay via UPI
          </DialogTitle>
          <p className="text-sm text-gray-600">Select any UPI App to pay using your UPI ID</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* UPI ID Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Enter UPI ID</label>
            <div className="flex gap-2">
              <Input
                placeholder="yourname@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={handleVerify}
                disabled={!upiId}
              >
                VERIFY
              </Button>
            </div>
            {isVerified && (
              <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                ✓ UPI ID verified successfully
              </p>
            )}
          </div>

          {/* UPI Apps Grid */}
          <div>
            <label className="text-sm font-medium mb-3 block">Select UPI App</label>
            <div className="grid grid-cols-2 gap-3">
              {upiApps.map((app) => (
                <Button
                  key={app.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${app.color} ${
                    selectedApp === app.name ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedApp(app.name)}
                >
                  <span className="text-2xl">{app.logo}</span>
                  <span className="text-xs font-medium">{app.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handlePayNow}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!selectedApp || !isVerified}
            >
              PAY NOW
            </Button>
            
            <div className="text-center text-xs text-gray-500">
              {selectedApp && isVerified ? (
                `Ready to pay with ${selectedApp}`
              ) : (
                'Please verify UPI ID and select an app'
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UPIModal;
