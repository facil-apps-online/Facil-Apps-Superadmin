import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("AuthCallback: Effect triggered.");
    const success = searchParams.get('success');
    const tenantId = searchParams.get('tenantId');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error'); // Get error message

    try {
      if (success === 'true' && tenantId) {
        console.log(`AuthCallback: Success for tenant ${tenantId}. Invalidating queries.`);
        queryClient.invalidateQueries({ queryKey: ['tenantIntegrations', tenantId] });
        
        if (window.opener) {
          console.log("AuthCallback: Posting success message to opener.");
          window.opener.postMessage({ type: 'auth-success', provider }, window.location.origin);
        }
      } else if (success === 'false') {
        console.error(`AuthCallback: Auth failed with error: ${error}`);
        if (window.opener) {
          console.log("AuthCallback: Posting error message to opener.");
          window.opener.postMessage({ type: 'auth-error', provider, error }, window.location.origin);
        }
      }
    } catch (e) {
      console.error("AuthCallback: Error processing auth callback.", e);
    } finally {
      // Close the popup window after a short delay
      console.log("AuthCallback: Attempting to close window.");
      setTimeout(() => {
        try {
          window.close();
          console.log("AuthCallback: Window closed successfully.");
        } catch (e) {
          console.error("AuthCallback: Error closing window.", e);
        }
      }, 100);
    }

  }, [queryClient, searchParams]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Procesando autenticación...</h1>
      <p>Esta ventana se cerrará automáticamente.</p>
    </div>
  );
}