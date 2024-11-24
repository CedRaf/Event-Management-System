import React, { useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

function Auth({ setGoogleToken }) {
  const session = useSession(); 
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (session?.provider_token) {
      setGoogleToken(session.provider_token);
    }
  }, [session, setGoogleToken]);

  const googleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar',
        },
      });git checkout categories-branch
      if (error) {
        alert('Error signing in with Google.');
        console.error(error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <div className="auth-container">
      <button onClick={googleSignIn}>Sign in with Google</button>
    </div>
  );
}

export default Auth;
