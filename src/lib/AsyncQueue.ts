/**
 * Aync Queue Implementation
 */

interface item {
  method: Function;
  args: any[];
  res: Function;
}

export class AsyncQueue {
  private queue = new Array<item>();
  private queueLocked = false;

  private async step(recurse?: boolean) {
    if (this.queueLocked && !recurse) return;

    this.queueLocked = true;

    if (this.queue.length > 0) {
      const { method, args, res } = this.queue.shift()!;
      const result = await method(...args);
      res(result);
      this.step(true);
    } else {
      this.queueLocked = false;
    }
  }

  /**
   * Run a request throught the asyncrhonous queue.
   * @param method Method to call
   * @param args
   * @returns
   */
  async run<T>(method: () => Promise<T>, ...args: any[]): Promise<T> {
    return new Promise<T>((res) => {
      this.queue.push({
        method: method,
        args: args,
        res: res,
      });

      this.step();
    });
  }
}
