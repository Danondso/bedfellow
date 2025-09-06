import { SpotifyAuthContext, type SpotifyAuthContextData } from '@context/SpotifyAuthContext';
import { spotifyGETData } from '@services/spotify/SpotifyAPI.service';
import { useContext, useEffect, useState } from 'react';
import type { UseProfileHookResponse } from './types';

const useProfile = (): UseProfileHookResponse => {
  const { authState } = useContext<SpotifyAuthContextData>(SpotifyAuthContext);
  const { token } = authState;
  const [profile, setProfile] = useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);
  const [error, setError] = useState<SpotifyApi.ErrorObject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isPremium = profile?.product === 'premium';

  const getData = async () => {
    setLoading(true);
    setError(null);
    if (!token) throw new Error('Authentication token is required to fetch user profile. Please ensure you are logged in to Spotify.');

    try {
      const { data } = await spotifyGETData('v1/me/', token);
      setProfile(data);
      setLoading(false);
      return data;
    } catch (error) {
      const spotifyError = error as SpotifyApi.ErrorObject;
      setError(spotifyError);
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);

  return {
    loading,
    error,
    profile,
    isPremium,
  };
};

export default useProfile;
