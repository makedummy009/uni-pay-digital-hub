
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Lock, Shield } from 'lucide-react';

interface CreditCardModalProps {
  open: boolean;
  onClose: () => void;
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    saveCard: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!formData.nameOnCard.trim()) {
      newErrors.nameOnCard = 'Please enter name on card';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Payment processing... This is a demo implementation.');
      onClose();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Pay via Credit/Debit Card
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Card Number</label>
            <div className="relative">
              <Input
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                maxLength={19}
                className={errors.cardNumber ? 'border-red-500' : ''}
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Expiry Date</label>
              <Input
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                maxLength={5}
                className={errors.expiryDate ? 'border-red-500' : ''}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">CVV</label>
              <Input
                placeholder="123"
                type="password"
                value={formData.cvv}
                onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                maxLength={4}
                className={errors.cvv ? 'border-red-500' : ''}
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Name on Card</label>
            <Input
              placeholder="John Doe"
              value={formData.nameOnCard}
              onChange={(e) => setFormData({...formData, nameOnCard: e.target.value})}
              className={errors.nameOnCard ? 'border-red-500' : ''}
            />
            {errors.nameOnCard && <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="save-card"
              checked={formData.saveCard}
              onCheckedChange={(checked) => setFormData({...formData, saveCard: checked as boolean})}
            />
            <label htmlFor="save-card" className="text-sm">
              I agree to save my card details for future use
            </label>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Shield size={16} />
            <span>PCI DSS Compliant</span>
            <Lock size={16} className="ml-auto" />
            <span>Secure Checkout</span>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard}
          >
            PROCEED
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardModal;
