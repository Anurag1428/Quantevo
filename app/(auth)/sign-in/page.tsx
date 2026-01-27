'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import FacialLogin from '@/components/FacialLogin';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { signInWithEmail } from '@/lib/actions/authaction';
import { signInWithFacial, canUseFacialSignIn } from '@/lib/actions/facial-signin';
import { Camera } from 'lucide-react';

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const [signInMethod, setSignInMethod] = useState<'email' | 'facial'>('email');
  const [facialEmail, setFacialEmail] = useState('');
  const [canUseFacial, setCanUseFacial] = useState(false);
  const [isCheckingFacial, setIsCheckingFacial] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  // Check if facial sign-in is available for this email
  const handleCheckFacial = async (email: string) => {
    setFacialEmail(email);
    setIsCheckingFacial(true);
    try {
      const hasFacial = await canUseFacialSignIn(email);
      setCanUseFacial(hasFacial);
      if (hasFacial) {
        setSignInMethod('facial');
        toast.success('Facial recognition available for this account');
      } else {
        toast.info('No facial profile found. Using email/password.');
        setSignInMethod('email');
      }
    } catch (error) {
      console.error('Error checking facial:', error);
      toast.error('Failed to check facial profile');
      setSignInMethod('email');
    } finally {
      setIsCheckingFacial(false);
    }
  };

  // Email/Password sign-in
  const onSubmitEmail = async (data: SignInFormData) => {
    try {
      // Check if facial is available for this email
      await handleCheckFacial(data.email);

      // For now, proceed with email/password auth
      const result = await signInWithEmail(data);
      if (result.success) {
        toast.success('Signed in successfully!');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Sign in failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Sign in failed');
    }
  };

  // Facial recognition success handler
  const handleFacialSuccess = async (faceDescriptor: string) => {
    try {
      toast.loading('Verifying facial recognition...');

      const result = await signInWithFacial(facialEmail, faceDescriptor);

      if (result.success && result.isMatch) {
        toast.dismiss();
        toast.success(`Welcome back! Similarity: ${result.similarity}%`);
        // TODO: Set session/JWT token here
        router.push('/dashboard');
      } else {
        toast.dismiss();
        toast.error(result.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Facial verification failed');
      console.error(error);
    }
  };

  const handleFacialError = (error: string) => {
    toast.error(error);
  };

  // UI: Email/Password Sign-in
  if (signInMethod === 'email') {
    return (
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="form-title">Welcome Back</h1>
          <p className="text-sm text-gray-400">Sign in to your QuantEvo account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-5">
          <InputField
            name="email"
            label="Email Address"
            placeholder="your@email.com"
            register={register}
            error={errors.email}
            validation={{
              required: 'Email is required',
              pattern: {
                value: /^\w+@\w+\.\w+$/,
                message: 'Enter a valid email address',
              },
            }}
          />

          <InputField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            register={register}
            error={errors.password}
            validation={{
              required: 'Password is required',
            }}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="w-4 h-4 rounded" />
              Remember me
            </label>
            <a href="#" className="text-yellow-500 hover:text-yellow-400">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isCheckingFacial}
            className="yellow-btn w-full"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Facial Sign-in Alternative */}
          {canUseFacial && (
            <Button
              type="button"
              onClick={() => setSignInMethod('facial')}
              variant="outline"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              <Camera className="w-4 h-4" />
              Use Facial Recognition
            </Button>
          )}

          <FooterLink
            text="Don't have an account?"
            linkText="Sign up"
            href="/sign-up"
          />
        </form>
      </div>
    );
  }

  // UI: Facial Recognition Sign-in
  if (signInMethod === 'facial') {
    return (
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="form-title">Facial Recognition Login</h1>
          <p className="text-sm text-gray-400">
            {facialEmail || 'Sign in with your face'}
          </p>
        </div>

        <FacialLogin
          mode="login"
          onSuccess={handleFacialSuccess}
          onError={handleFacialError}
        />

        <Button
          type="button"
          onClick={() => {
            setSignInMethod('email');
            setFacialEmail('');
            setCanUseFacial(false);
          }}
          variant="outline"
          className="w-full"
        >
          Use Email & Password Instead
        </Button>

        <FooterLink
          text="Don't have an account?"
          linkText="Sign up"
          href="/sign-up"
        />
      </div>
    );
  }
}
