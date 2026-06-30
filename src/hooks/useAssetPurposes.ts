import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// --- Type Definitions ---
export interface AssetPurpose {
  id: string;
  purpose_key: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// --- Custom Hooks ---
export const useAssetPurposes = () => {
  const [data, setData] = useState<AssetPurpose[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurposes = async () => {
    setIsLoading(true);
    setError(null);
    const { data: purposes, error } = await supabase.functions.invoke('core-actions', {
      body: { action: 'get_asset_purposes' }
    });

    if (error) {
      setError(error.message);
      console.error('Error fetching asset purposes:', error);
    } else {
      setData(purposes || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPurposes();
  }, []);

  return { data, isLoading, error, refetch: fetchPurposes };
};

export const useCreateAssetPurpose = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (newPurpose: { purpose_key: string; description: string | null }) => {
    setIsPending(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke('core-actions', {
      body: { action: 'create_asset_purpose', payload: { purposeData: newPurpose } }
    });

    if (error) {
      setError(error.message);
      console.error('Error creating asset purpose:', error);
      setIsPending(false);
      return { success: false, error: error.message };
    }
    setIsPending(false);
    return { success: true, data };
  };

  return { mutate, isPending, error };
};

export const useUpdateAssetPurpose = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (updatedPurpose: AssetPurpose) => {
    setIsPending(true);
    setError(null);
    const { purposeId, ...purposeData } = { purposeId: updatedPurpose.id, purposeData: { purpose_key: updatedPurpose.purpose_key, description: updatedPurpose.description } };
    const { data, error } = await supabase.functions.invoke('core-actions', {
    });

    if (error) {
      setError(error.message);
      console.error('Error updating asset purpose:', error);
      setIsPending(false);
      return { success: false, error: error.message };
    }
    setIsPending(false);
    return { success: true, data };
  };

  return { mutate, isPending, error };
};

export const useDeleteAssetPurpose = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (id: string) => {
    setIsPending(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke('core-actions', {
      body: { action: 'delete_asset_purpose', payload: { purposeId: id } }
    });

    if (error) {
      setError(error.message);
      console.error('Error deleting asset purpose:', error);
      setIsPending(false);
      return { success: false, error: error.message };
    }
    setIsPending(false);
    return { success: true };
  };

  return { mutate, isPending, error };
};