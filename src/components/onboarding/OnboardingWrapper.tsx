'use client';

import { useState, useEffect } from 'react';
import OnboardingFlow from './OnboardingFlow';

interface User {
  id: string;
  onboardingCompleted: boolean;
  role?: string;
}

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export default function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          setUser(data.user);
          // Show onboarding if not completed
          if (!data.user.onboardingCompleted) {
            setShowOnboarding(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (role: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role,
          onboardingCompleted: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Failed to complete onboarding');
      }

      const data = await response.json();
      setUser({ ...user!, role, onboardingCompleted: true });
      setShowOnboarding(false);
      
      // Reload page to update UI
      window.location.reload();
    } catch (error: any) {
      throw error;
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  if (loading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {showOnboarding && user && (
        <OnboardingFlow
          currentRole={user.role}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </>
  );
}
