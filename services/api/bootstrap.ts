import { ApiClient, IApiClient } from './client';
import { HttpTransport } from './transport';
import { MockTransport } from './mocks';

// This function determines whether to use the mock backend or a real one.
const shouldUseMock = () => {
  // In a typical web environment, we'd use environment variables.
  // In the Studio environment, checking for `import.meta.env` can be unreliable or throw errors.
  // The most robust approach is to assume MOCK mode unless a specific
  // production-like condition is met.
  
  // Safely check for import.meta.env
  const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : {};
  const remoteApiUrl = (env.VITE_API_BASE_URL || '').trim();

  // If a remote URL is explicitly provided, use the real transport. Otherwise, mock.
  return !remoteApiUrl;
};

const useMock = shouldUseMock();

// FIX: Correctly assign either the mock client or a new instance of the real client.
// This ensures that the apiClient is always of type IApiClient and resolves the instantiation error.
export const apiClient: IApiClient = useMock ? MockTransport : new ApiClient(HttpTransport);

if (useMock) {
  console.info('API client bootstrapped in MOCK mode. All API calls are simulated locally.');
} else {
  console.info('API client bootstrapped in HTTP mode. Connecting to remote backend.');
}