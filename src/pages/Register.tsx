
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAppSettings } from '@/lib/settings';

const Register: React.FC = () => {
  const appSettings = getAppSettings();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Coins className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{appSettings.siteName}</h1>
          <p className="text-muted-foreground">
            Create a free account to start earning and redeeming
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary underline underline-offset-4">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
