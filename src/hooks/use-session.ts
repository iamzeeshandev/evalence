import type { Session } from 'next-auth';
import type { GetSessionParams, SessionContextValue} from 'next-auth/react';
import { getSession, useSession } from 'next-auth/react';

/**
 * Safely fetches the session during SSR or at runtime.
 * @param {GetSessionParams | undefined} context - The context object provided by Next.js (optional).
 * @returns {Promise<Session | null>} The session object or null if not available.
 */
export async function getSafeSession(
  context?: GetSessionParams
): Promise<Session | null> {
  if (context && context.req) {
    return getSession(context); // Directly return the promise
  }

  if (typeof window === 'undefined') {
    return null; // Return null during SSR/static build
  }

  return getSession(); // Directly return the promise
}

/**
 * A safer version of the useSession hook that prevents fetching during SSR or static builds.
 * @returns {SessionContextValue} An object containing session data, status, and update function.
 */
export function useSafeSession(): SessionContextValue {
  // Always call `useSession` unconditionally
  const session = useSession();

  if (typeof window === 'undefined') {
    // Mock behavior during SSR/static builds
    const mockUpdate = async (): Promise<Session | null> => null;
    return { data: null, status: 'loading', update: mockUpdate };
  }

  // Return the actual session during runtime
  return session;
}
