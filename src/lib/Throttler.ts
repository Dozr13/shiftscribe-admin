import { LinkedList } from './data/LinkedList';

/*
  Throttle System

  Automatically throttle requests based on an interval and limit.

  When the limit is reached, the throttle will lock. This will not allow any more requests
  until each request has timed out.

  Utilizes linked lists to quickly handle large limits.

  Ryan | 06.01.23
*/

interface Request {
  calledAt: number;
}

/**
 * Throttle requests based on an interval and limit.
 */
class RequestThrottle {
  private onThrottleCallback = () => {};
  private interval: number;
  private locked = false;
  private queue: LinkedList<Request>;
  private limit: number;
  private onStateChangeCallback = (State: boolean) => {};

  /**
   *
   * @param Request Callback Method
   * @param limit Number of Requests Within the interval
   * @param Timeout (Optional) If the queue is exceeded, this is the duration they will wait before their next request.
   * @param interval
   */
  constructor(limit: number, interval: number) {
    this.limit = limit;
    this.interval = interval;
    this.queue = new LinkedList<Request>();
  }

  private getTime() {
    return Date.now() / 1000;
  }

  /**
   * When the state of the throttle changes, this method is called with the updated state.
   * @experimental
   * @param Callback
   */
  private stateChange(Callback: (State: boolean) => void) {
    this.onStateChangeCallback = Callback;
  }

  private setLocked(State: boolean) {
    this.locked = State;
    this.onStateChangeCallback(State);
  }

  /**
   * Set a callback to be called when the throttle limit has been exceeded.
   *
   * Calls each time throttle is invoked while locked.
   *
   * @param Callback Method to call on throttle
   */
  onThrottle(Callback: () => void) {
    this.onThrottleCallback = Callback;
  }

  private throttleCheck(): boolean {
    let Tail = this.queue.GetTail();

    // Trim the oldest records.
    while (Tail) {
      if (this.getTime() - Tail.Data.calledAt > this.interval) {
        this.queue.Pop();
        Tail = this.queue.GetTail();
      } else break;
    }

    // If the queue size is zero, unlock the throttle.
    if (this.queue.Size() === 0) this.setLocked(false);
    if (this.locked) return false;

    if (this.queue.Size() >= this.limit) {
      this.setLocked(true);
      return false;
    }

    this.queue.Prepend({ calledAt: this.getTime() });

    return true;
  }

  private canRun(): boolean {
    const Result = this.throttleCheck();

    if (!Result) this.onThrottleCallback();

    return Result;
  }

  debounce(): boolean {
    return !this.canRun();
  }

  /**
   * Run a synchronous function through the throttle.
   *
   * Asynchrnous operations given to this method will run, but may bypass the throttle if they yeild long.
   *
   * ```ts
   * const throttle = new RequestThrottle(5, 10) // 5 Requests every 10 Seconds
   *
   * const Result = Throttle.Try(() => {
   *  return 10 + 15
   * })
   *
   * console.log(Reuslt) // 25
   * ```
   * @param Fn
   * @returns
   */
  try<R>(fn: () => R): void {
    if (!this.canRun()) return;
    this.setLocked(true);
    fn();
    this.setLocked(false);
  }

  /**
     * Run a promise through the throttle.
     *
     * The promise will resolve `undefined` if the throttle's limits have been exceeded. This is done to keep error handling pure.
     *
     * **Example:**
     * ```ts
     * const throttle = new RequestThrottle(5, 10) // 5 Requests every 10 Seconds
     *
     * throttle.tryAsync(() => fetch('https://api.github.com/users/neohertz/repos'))
     *  .then(Res => Res.json())
     *  .then(Repos => {
     *    for (const Repo of Repos) {
     *      console.log(Repo.name);
     *    }
     * })

     * });
     * ```
     * @param fn
     * @returns
     */
  async tryAsync<R extends unknown>(fn: () => Promise<R | undefined>): Promise<R | undefined> {
    if (!this.canRun()) return undefined;
    if (this.locked) return undefined;

    this.setLocked(true);

    let Err;
    let Res;

    try {
      Res = await fn();
    } catch (e) {
      Err = e;
    }

    this.setLocked(false);
    if (Err) throw Err;
    return Res;
  }
}

export default RequestThrottle;
