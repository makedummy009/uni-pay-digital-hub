
import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const dummyMessages = [
    { type: 'user', text: 'Hi, can you help me with my transactions?' },
    { type: 'bot', text: 'Sure! What do you want to know — last month\'s summary or recent payments?' },
    { type: 'user', text: 'Show me recent payments' },
    { type: 'bot', text: 'Here are your recent payments. You can also use the Transaction History section above for more details.' }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real implementation, this would handle the message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          title="Chat with Assistant"
        >
          <MessageSquare size={24} />
        </Button>
      </div>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black bg-opacity-50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Panel */}
          <div className="w-80 bg-white shadow-xl animate-slide-in-right">
            <Card className="h-full rounded-none border-0">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Virtual Assistant</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-0">
                {/* Messages Area */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
                  {dummyMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
