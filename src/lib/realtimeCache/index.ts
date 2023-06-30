import { child, get, getDatabase, ref } from 'firebase/database';
import { AsyncQueue } from '../AsyncQueue';

/**
 * Cache implementation speedrun any% glitchless
 *
 * reduces reads on non critical data
 */

export class RealtimeCache<T> {
  private state?: T;
  private lastAccessed: number;
  private lifetime: number;
  private queue = new AsyncQueue();

  /**
   * Create a Cache Object
   * @param path path to mutate
   * @param lifetime time in seconds
   */
  constructor(lifetime: number) {
    this.lifetime = lifetime * 1000;
    this.lastAccessed = Date.now();
  }

  private invalidated() {
    if (Date.now() - this.lastAccessed > this.lifetime || this.state === undefined) {
      this.lastAccessed = Date.now();
      return true;
    }

    return false;
  }

  /**
   * Read the cached values. If the last read is outside the allocated time for reads, fix that.
   * @param path string
   * @returns any
   */
  async read(path: string) {
    return this.queue.run(async () => {
      if (this.invalidated()) {
        console.log('[Cache] Time Expired. Revalidating...');
        const data = await get(child(ref(getDatabase()), path));

        if (data.exists()) {
          this.state = data.toJSON() as T;
        } else {
          this.state = undefined;
        }
      }

      return this.state;
    });
  }
}
