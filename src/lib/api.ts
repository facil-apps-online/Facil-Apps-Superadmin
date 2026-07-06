import { supabase } from './supabaseClient';

/**
 * A centralized wrapper for invoking 'core-actions' Edge Function.
 * The supabase-js client will automatically attach the correct Authorization header.
 * @param action The specific action to be executed by the 'core-actions' function.
 * @param payload Optional payload for the action.
 * @returns The data returned by the Edge Function.
 */
export const invokeCoreAction = async (action: string, payload?: any) => {
  const { data, error } = await supabase.functions.invoke('core-actions', {
    body: {
      action,
      payload,
    },
  });

  if (error) throw error;
  if (data && data.success === false) {
    throw new Error(data.message || 'The function returned an error with no message.');
  }
  return data;
};
