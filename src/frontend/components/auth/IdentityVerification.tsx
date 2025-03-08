/**
 * CivIQ - A civic discourse platform
 * Copyright (c) 2025 CivIQ Foundation
 * 
 * This software is licensed under the CivIQ Ethical Licensing Agreement,
 * based on the Hippocratic License with additional provisions.
 * See LICENSE.md and TERMS_OF_USE.md for full details.
 * 
 * By using this software, you agree to uphold CivIQ's mission of fostering
 * meaningful, evidence-based discussions and combating misinformation.
 */

import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface IdentityVerificationProps {
  onVerificationComplete: (fingerprint: string) => void;
  onVerificationFailed: (error: string) => void;
}

/**
 * Component that handles browser fingerprinting for identity verification
 * Uses FingerprintJS to generate a unique browser fingerprint
 */
const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  onVerificationComplete,
  onVerificationFailed,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateFingerprint() {
      try {
        setLoading(true);
        
        // Initialize FingerprintJS
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        
        // Get the visitor identifier
        const result = await fp.get();
        
        // Use the result's visitorId as the fingerprint
        const fingerprint = result.visitorId;
        
        // Store in localStorage for device binding
        localStorage.setItem('device_fingerprint', fingerprint);
        
        // Notify parent component that verification is complete
        onVerificationComplete(fingerprint);
        
        setLoading(false);
      } catch (err) {
        console.error('Fingerprint generation failed:', err);
        setError('Unable to verify your device. Please enable JavaScript and cookies.');
        onVerificationFailed('Fingerprint generation failed');
        setLoading(false);
      }
    }

    generateFingerprint();
  }, [onVerificationComplete, onVerificationFailed]);

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="text-lg font-medium text-gray-900">Verifying your device...</h3>
        <p className="text-sm text-gray-600">This helps us prevent bots and multiple accounts.</p>
        <div className="mt-3 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md mb-4">
        <h3 className="text-lg font-medium text-red-800">Verification Failed</h3>
        <p className="text-sm text-red-700">{error}</p>
        <button 
          className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-50 p-4 rounded-md mb-4">
      <h3 className="text-lg font-medium text-green-800">Device Verified</h3>
      <p className="text-sm text-green-700">Your device has been successfully verified.</p>
    </div>
  );
};

export default IdentityVerification;