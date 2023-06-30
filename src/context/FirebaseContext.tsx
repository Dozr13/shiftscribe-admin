import { PropsWithChildren, createContext, useContext } from 'react';

import 'firebase/database';
import {
  DataSnapshot,
  QueryConstraint,
  child,
  get,
  getDatabase,
  limitToFirst,
  onValue,
  query,
  ref,
  set,
  update,
} from 'firebase/database';

// Declare our Context Methods.
const Context = {
  /**
   * Attempt to overwrite the database at a given path.
   *
   * **Be careful. This method is cheaper, but can easily wipe the entire database.**
   * @param Path
   * @param Data Object
   * @returns Promise<void>
   */
  rawWrite: (Path: string, Data: Record<string, unknown> | null) => {
    return set(ref(getDatabase(), Path), Data);
  },

  /**
   * Safely update data at a given path.
   *
   * May still overwrite data depending on the path structure.
   * @param Path
   * @param Data
   * @returns
   */
  update: (Path: string, Data: Record<string, unknown>) => {
    return update(ref(getDatabase(), Path), Data);
  },

  /**
   * Attempt to write to the database given a path. If this path contains data, the promise will reject.
   *
   * This method will read the database before we write, so it can potentially be expensive.
   *
   * @param Path
   * @param Data Object
   */
  safeWrite: (Path: string, Data: Record<string, unknown>) => {
    return new Promise<void>((res, rej) => {
      Context.read(Path).then((Res) => {
        if (Res.toJSON() !== null) rej();
        else res(Context.rawWrite(Path, Data));
      });
    });
  },

  /**
   * Attempt to fetch (once) the data at a given path.
   * @param Path
   * @returns Promise<DataSnapshot>
   */
  read: (Path: string) => {
    return get(child(ref(getDatabase()), Path));
  },

  /**
   * Listen for changes at a specified path.
   *
   * Call the result of this method to abort the listener:
   * ```ts
   * const Unsubscribe = Watch("/users/ryan", (s) => {})
   * // Later...
   * Unsubscribe()
   * ```
   * @param Path
   * @param Callback (DataSnapshot) -> Void
   * @returns Unsubscribe
   */
  watch: (Path: string, Callback: (Snapshot: DataSnapshot) => void) => {
    const Ref = ref(getDatabase(), Path);
    return onValue(Ref, Callback);
  },

  /**
   * Query the database.
   *
   * Note: Only (1) order-by method can be used at a time.
   *
   * ```ts
   * Query("users", orderByChild("metrics/uploads")).then(Snapshot => {
   *  console.log(Snapshot)
   * });
   *
   * ```
   * @param Path
   * @param Data
   * @returns Promise<DataSnapshot>
   */
  query: (Path: string, ...Data: QueryConstraint[]) => {
    const Query = query(ref(getDatabase(), Path), ...Data);
    return get(Query);
  },

  /**
   * Deturmine if the current path contains data.
   *
   * Useful if you don't need the data at a path, but instead want to know if it exists.
   *
   * Example:
   * ```ts
   * const db = useFirebase();
   *
   * // Bad Practice
   * const data = await db.get("/orgs/wcc")
   * console.log(data.exists())
   *
   * // Good Practice
   * const exists = await db.exists("/orgs/wcc")
   * console.log(exists)
   * ```
   *
   * @param Path string
   * @returns Promise<boolean>
   */
  exists: async (Path: string) => {
    const Query = query(ref(getDatabase(), Path), limitToFirst(1));
    let Res = await get(Query);
    return Res.exists();
  },

  /**
   * Get the current time since unix epoch (millis)
   * @returns number
   */
  now: (): number => {
    return Date.now();
  },
};

// Create the context with the type (implied).
const FirebaseContext = createContext(Context);

/**
 * Use Firebase context.
 * @returns FirebaseContext
 */
export const useFirebase = () => useContext(FirebaseContext);

/**
 * Provide firebase abstraction to children components.
 */
export function DatabaseProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <FirebaseContext.Provider value={Context}>
      {children}
    </FirebaseContext.Provider>
  );
}
