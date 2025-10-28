import { MusicProviderAdapter, MusicProviderId } from './types';
import { MUSIC_PROVIDER_DESCRIPTORS, createNotImplementedAdapter } from './registry';
import { createSpotifyAdapter } from './adapters/spotifyAdapter';

/**
 * Singleton registry for music provider adapters.
 *
 * Manages the lifecycle and access to music provider adapters.
 * Provides a central location for adapter registration and retrieval.
 *
 * Benefits:
 * - No async initialization needed
 * - Can be used outside React context
 * - Easier to test
 * - Clear ownership of adapter lifecycle
 */
class AdapterRegistry {
  private adapters: Map<MusicProviderId, MusicProviderAdapter> = new Map();
  private isInitialized: boolean = false;

  /**
   * Initializes the registry with default adapters.
   * Must be called before using the registry.
   *
   * @param getSession - Function to retrieve session for a provider
   */
  initialize(getSession: (providerId: MusicProviderId) => any): void {
    if (this.isInitialized) {
      console.warn('AdapterRegistry already initialized. Skipping re-initialization.');
      return;
    }

    // Register all available providers
    MUSIC_PROVIDER_DESCRIPTORS.forEach((descriptor) => {
      if (descriptor.id === MusicProviderId.Spotify) {
        this.adapters.set(
          descriptor.id,
          createSpotifyAdapter({
            getSession: () => getSession(descriptor.id),
          })
        );
      } else {
        // Create not-implemented adapter for unsupported providers
        this.adapters.set(descriptor.id, createNotImplementedAdapter(descriptor));
      }
    });

    this.isInitialized = true;
  }

  /**
   * Registers a custom adapter for a provider.
   * Useful for testing or adding new providers.
   *
   * @param id - Provider ID
   * @param adapter - Adapter implementation
   */
  register(id: MusicProviderId, adapter: MusicProviderAdapter): void {
    this.adapters.set(id, adapter);
  }

  /**
   * Gets the adapter for a specific provider.
   *
   * @param id - Provider ID
   * @returns The adapter for the provider, or undefined if not registered
   */
  get(id: MusicProviderId): MusicProviderAdapter | undefined {
    return this.adapters.get(id);
  }

  /**
   * Gets all registered adapters.
   *
   * @returns Array of all adapters
   */
  getAll(): MusicProviderAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Checks if an adapter is registered for a provider.
   *
   * @param id - Provider ID
   * @returns True if adapter is registered
   */
  has(id: MusicProviderId): boolean {
    return this.adapters.has(id);
  }

  /**
   * Clears all registered adapters.
   * Primarily used for testing.
   */
  clear(): void {
    this.adapters.clear();
    this.isInitialized = false;
  }

  /**
   * Gets the initialization status of the registry.
   *
   * @returns True if registry has been initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const adapterRegistry = new AdapterRegistry();
