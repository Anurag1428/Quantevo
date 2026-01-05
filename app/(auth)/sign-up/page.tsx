"use client"

import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signUpWithEmail } from "@/lib/actions/auth.actions";

const SignUp = () => {
  const router = useRouter();
  const [formError, setFormError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpFormData>({
      defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: 'India',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology',
      },
      mode: 'onBlur'
  });

  const password = watch('password');

  // Evaluate password strength
  const evaluatePasswordStrength = (pwd: string) => {
    if (pwd.length < 8) {
      setPasswordStrength('weak');
      return;
    }
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (strength >= 3) {
      setPasswordStrength('strong');
    } else if (strength >= 2) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  if (password) {
    evaluatePasswordStrength(password);
  }

  const onSubmit = async (data: SignUpFormData) => {
    setFormError('');
    try {
      const result = await signUpWithEmail(data);
      if (result?.success) {
        toast.success('Account created successfully!', {
          description: 'Redirecting to dashboard...',
        });
        router.push('/');
      } else {
        const errorMsg = result?.error || 'An error occurred during sign-up.';
        setFormError(errorMsg);
        toast.error('Sign up failed', {
          description: errorMsg,
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Failed to create an account.';
      setFormError(errorMessage);
      toast.error('Sign up failed', {
        description: errorMessage,
      });
    }
  }

  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>

      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            register={register}
            error={errors.fullName}
            validation={{ 
              required: "Full Name is required", 
              minLength: { value: 2, message: "Minimum 2 characters required" }
            }}
        />

        <InputField
            name="email"
            label="Email"
            placeholder="contact@progamii.com"
            register={register}
            error={errors.email}
            validation={{ 
              required: "Email is required", 
              pattern: { 
                value: /^\w+@\w+\.\w+$/, 
                message: "Invalid email address"
              }
            }}
        />

        <div className="space-y-2">
          <InputField
              name="password"
              label="Password"
              placeholder="Enter a strong password"
              type="password"
              register={register}
              error={errors.password}
              validation={{ 
                required: "Password is required", 
                minLength: { value: 8, message: "Minimum 8 characters required" }
              }}
          />
          
          {password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'weak' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
              <p className={`text-xs font-medium ${
                passwordStrength === 'weak' ? 'text-red-600' : 
                passwordStrength === 'medium' ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                Password Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
              </p>
            </div>
          )}
        </div>

        <CountrySelectField
            name="country"
            label="Country"
            control={control}
            error={errors.country}
            required
        />

        <SelectField
            name="investmentGoals"
            label="Investment Goals"
            placeholder="Select your investment goals"
            options={INVESTMENT_GOALS}
            control={control}
            error={errors.investmentGoals}
            required
        />

        <SelectField
            name="riskTolerance"
            label="Risk Tolerance"
            placeholder="Select your risk level"
            options={RISK_TOLERANCE_OPTIONS}
            control={control}
            error={errors.riskTolerance}
            required
        />

        <SelectField
            name="preferredIndustry"
            label="Preferred Industry"
            placeholder="Select your preferred industry"
            options={PREFERRED_INDUSTRIES}
            control={control}
            error={errors.preferredIndustry}
            required
        />

        <Button type="submit" className="yellow-btn w-full mt-6 h-10 font-semibold" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Creating Account...
            </span>
          ) : (
            "Start Your Investing Journey"
          )}
        </Button>

        <FooterLink text="Already have an account?" linkText="Sign In" href="/sign-in" />
      </form>
    </>
  )
}

export default SignUp
