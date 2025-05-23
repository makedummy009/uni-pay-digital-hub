
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast';

// const RegisterForm = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name || !email || !mobile || !password || !confirmPassword) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     if (password !== confirmPassword) {
//       toast({
//         title: "Error",
//         description: "Passwords do not match",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       toast({
//         title: "Account created",
//         description: "Welcome to UNI-PAY! Your account has been created successfully.",
//       });
      
//       navigate('/dashboard');
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Registration failed. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold">Create your account</h1>
//         <p className="text-gray-600 mt-1">Join UNI-PAY to start making digital payments</p>
//       </div>
      
//       <form onSubmit={handleSubmit}>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Full Name</Label>
//             <Input 
//               id="name"
//               type="text" 
//               placeholder="John Doe" 
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input 
//               id="email"
//               type="email" 
//               placeholder="you@example.com" 
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="mobile">Mobile Number</Label>
//             <Input 
//               id="mobile"
//               type="tel" 
//               placeholder="+1234567890" 
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input 
//               id="password"
//               type="password" 
//               placeholder="••••••••" 
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="confirmPassword">Confirm Password</Label>
//             <Input 
//               id="confirmPassword"
//               type="password" 
//               placeholder="••••••••" 
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="kycDocs">Upload KYC Documents (Optional)</Label>
//             <Input 
//               id="kycDocs"
//               type="file" 
//               className="cursor-pointer"
//               accept=".pdf,.jpg,.jpeg,.png"
//               multiple
//             />
//             <p className="text-xs text-gray-500">
//               Upload Aadhaar, PAN, or Driving License (PDF/JPG/PNG)
//             </p>
//           </div>
          
//           <Button className="w-full" type="submit" disabled={isLoading}>
//             {isLoading ? "Creating account..." : "Sign up"}
//           </Button>
          
//           <p className="text-xs text-center text-gray-500">
//             By signing up, you agree to our Terms of Service and Privacy Policy.
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { 
  ref, 
  uploadBytesResumable,
  getDownloadURL 
} from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, storage, db } from '../../firebase/firebaseConfig';

interface KYCUploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  downloadURL: string | null;
}

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [kycUpload, setKycUpload] = useState<KYCUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    downloadURL: null
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF, JPG, or PNG file",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setKycUpload(prev => ({
        ...prev,
        file,
        downloadURL: null
      }));
    } else {
      e.target.value = '';
    }
  };

  const uploadKYCDocument = async (file: File, userId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `kyc_docs/${userId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setKycUpload(prev => ({ ...prev, uploading: true, progress: 0 }));

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setKycUpload(prev => ({ ...prev, progress }));
        },
        (error) => {
          setKycUpload(prev => ({ ...prev, uploading: false, progress: 0 }));
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setKycUpload(prev => ({ 
              ...prev, 
              uploading: false, 
              progress: 100,
              downloadURL 
            }));
            resolve(downloadURL);
          } catch (error) {
            setKycUpload(prev => ({ ...prev, uploading: false, progress: 0 }));
            reject(error);
          }
        }
      );
    });
  };

  const saveUserData = async (user: any, kycURL?: string) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name || user.displayName,
        email: user.email,
        mobile: mobile,
        kycDocumentURL: kycURL || null,
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified
      });
    } catch (error) {
      console.error('Error saving user data:', error);
      // Don't throw here - registration was successful
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !mobile || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, {
        displayName: name
      });

      let kycURL = null;

      // Upload KYC document if provided
      if (kycUpload.file) {
        try {
          kycURL = await uploadKYCDocument(kycUpload.file, user.uid);
          toast({
            title: "KYC Document Uploaded",
            description: "Your KYC document has been uploaded successfully",
          });
        } catch (uploadError) {
          console.error('KYC upload failed:', uploadError);
          toast({
            title: "Warning",
            description: "Account created but KYC upload failed. You can upload documents later.",
            variant: "destructive",
          });
        }
      }

      // Save additional user data to Firestore
      await saveUserData(user, kycURL);
      
      toast({
        title: "Account created successfully!",
        description: `Welcome to UNI-PAY, ${name}! Your account has been created.`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = error.message || "Registration failed. Please try again.";
      }
      
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user data to Firestore
      await saveUserData(user);
      
      toast({
        title: "Account created successfully!",
        description: `Welcome to UNI-PAY, ${user.displayName || user.email}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      let errorMessage = "Google signup failed. Please try again.";
      
      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          errorMessage = "An account already exists with this email using a different sign-in method.";
          break;
        case 'auth/cancelled-popup-request':
        case 'auth/popup-closed-by-user':
          errorMessage = "Signup cancelled. Please try again.";
          break;
        default:
          errorMessage = error.message || "Google signup failed. Please try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-gray-600 mt-1">Join UNI-PAY to start making digital payments</p>
      </div>

      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2" 
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {isGoogleLoading ? "Creating account..." : "Continue with Google"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name"
              type="text" 
              placeholder="Your Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input 
              id="mobile"
              type="tel" 
              placeholder="+1234567890" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              required
            />
            <p className="text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input 
              id="confirmPassword"
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kycDocs">Upload KYC Documents (Optional)</Label>
            <Input 
              id="kycDocs"
              type="file" 
              className="cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isLoading || isGoogleLoading || kycUpload.uploading}
            />
            <p className="text-xs text-gray-500">
              Upload Aadhaar, PAN, or Driving License (PDF/JPG/PNG, max 5MB)
            </p>
            
            {kycUpload.file && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  Selected: {kycUpload.file.name}
                </p>
                {kycUpload.uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${kycUpload.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading... {Math.round(kycUpload.progress)}%
                    </p>
                  </div>
                )}
                {kycUpload.downloadURL && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Document uploaded successfully
                  </p>
                )}
              </div>
            )}
          </div>
          
          <Button 
            className="w-full" 
            type="submit" 
            disabled={isLoading || isGoogleLoading || kycUpload.uploading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Creating account...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

