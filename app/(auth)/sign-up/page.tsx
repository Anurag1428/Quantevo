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
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const SignUp = () => {
  const router = useRouter();
  const [formError, setFormError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    getValues,
  } = useForm<SignUpFormData & { confirmPassword?: string; termsAccepted?: boolean }>({
      defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: 'India',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology',
      confirmPassword: '',
      termsAccepted: false,
      },
      mode: 'onBlur'
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const passwordsMatch = password === confirmPassword && password.length > 0;

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

  const onSubmit = async (data: SignUpFormData & { confirmPassword?: string; termsAccepted?: boolean }) => {
    setFormError('');
    
    if (!termsAccepted) {
      setFormError('You must accept the terms and conditions to continue.');
      toast.error('Terms not accepted', {
        description: 'Please accept the terms and conditions.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      toast.error('Password mismatch', {
        description: 'Please ensure both passwords are identical.',
      });
      return;
    }

    try {
      const { confirmPassword, termsAccepted, ...submitData } = data;
      const result = await signUpWithEmail(submitData as SignUpFormData);
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
      <div className="mb-6">
        <h1 className="form-title">Sign Up & Personalize</h1>
        <p className="text-sm text-gray-600 mt-2">Join thousands of smart investors. Takes less than 2 minutes.</p>
      </div>

      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
            label="Email Address"
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
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter a strong password"
              {...register('password', {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters required" }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
          
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
                Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              {...register('confirmPassword', {
                required: "Please confirm your password",
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10 ${
                errors.confirmPassword ? 'border-red-500' : confirmPassword && !passwordsMatch ? 'border-red-500' : confirmPassword && passwordsMatch ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && passwordsMatch && (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <CheckCircle className="w-4 h-4" />
              Passwords match
            </div>
          )}
          {confirmPassword && !passwordsMatch && (
            <p className="text-red-500 text-xs">Passwords do not match</p>
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

        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 cursor-pointer accent-yellow-500"
          />
          <label className="text-sm text-gray-700 cursor-pointer">
            I agree to the <a href="/terms" className="text-yellow-600 hover:underline font-semibold">Terms & Conditions</a> and <a href="/privacy" className="text-yellow-600 hover:underline font-semibold">Privacy Policy</a>
          </label>
        </div>

        <Button 
          type="submit" 
          className={`yellow-btn w-full mt-6 h-10 font-semibold transition-all ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={isSubmitting || !termsAccepted}
        >
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
