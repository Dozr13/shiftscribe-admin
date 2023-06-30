class Node<T> {
  Next: Node<T> | undefined;
  Last: Node<T> | undefined;
  Data: T;

  constructor(Data: T) {
    this.Data = Data;
  }
}

/**
 * Doubly-Linked List Data Structure
 *
 * O(1) for Preappend
 * O(n) for Iteration (Append, Delete, etc.)
 *
 * Written by Ryan
 */
export class LinkedList<T> {
  private Head: Node<T> | undefined;
  private Tail: Node<T> | undefined;
  private Length = 0;

  /**
   * Add an node to the end of the linked list.
   *
   * Computes at `O(1)`
   */
  Append(Data: T) {
    this.Length++;

    if (!this.Head) {
      this.Head = new Node<T>(Data);
      this.Tail = this.Head;
      return;
    }

    const Current = this.Tail;
    if (!Current) return;

    /**
     * Create the new node
     *
     * - Assign the current's next node to it,
     * - Assign it's last node to the current.
     */
    const New = new Node<T>(Data);
    New.Last = Current;
    Current.Next = New;
    this.Tail = New;
  }

  /**
   * Add a node to the start of the linked list.
   *
   * Computes at `O(1)`
   */
  Prepend(Data: T) {
    this.Length++;

    /**
     * Create a new node
     * - Set the next node to the previous head
     * - Set the head to this node.
     */
    const NewHead = new Node<T>(Data);
    NewHead.Next = this.Head;

    if (!NewHead.Next) this.Tail = NewHead;
    if (this.Head) this.Head.Last = NewHead;
    this.Head = NewHead;
  }

  /**
   * Returns number of entries within the linked list.
   */
  Size() {
    return this.Length;
  }

  /**
   * Return the first item (head) of the Linked List
   */
  GetHead() {
    return this.Head;
  }

  /**
   * Return the last item (tail) of the Linked List.
   */
  GetTail() {
    return this.Tail;
  }

  /**
   * Remove and return the first value of a linked list.
   *
   * Computes at `O(1)`
   */
  Shift(): T | undefined {
    if (!this.Head) return;

    this.Length--;

    const Next = this.Head.Next;
    const Target = this.Head;
    this.Head = undefined;

    if (!Next) {
      this.Tail = undefined;
      return Target.Data;
    }

    Next.Last = undefined;
    this.Head = Next;

    return Target.Data;
  }

  /**
   * Remove and return the last value of a linked list.
   *
   * Computes at `O(1)`
   */
  Pop(): T | undefined {
    if (!this.Tail) return;

    this.Length--;

    const Previous = this.Tail.Last;
    const Target = this.Tail;

    this.Tail = undefined;

    if (!Previous) {
      this.Head = undefined;
      return Target.Data;
    }

    Previous.Next = undefined;
    this.Tail = Previous;

    return Target.Data;
  }

  /**
   * Delete a node from the linked list.
   *
   * Given an Index, this method computes at `O(n)`
   *
   * Given a Node, this method computes at `O(1)`
   *
   * @param Pointer Node or Number
   */
  Delete(Pointer: Node<T> | number): Node<T> | undefined {
    let Target: Node<T> | undefined;

    if (typeof Pointer === 'number') Target = this.Get(Pointer);
    else Target = Pointer;

    if (Target) {
      if (Target.Last) Target.Last.Next = Target.Next;
      else this.Head = Target.Next;

      if (Target.Next) Target.Next.Last = Target.Last;
      else this.Tail = Target.Last;

      this.Length--;
    }

    return Target;
  }

  /**
   * Insert a node AT the index, shifting others accordingly.
   *
   * Computes at `O(n)`
   *
   * ```ts
   * List.Append("1") // Index 0
   * List.Append("2") // Index 1
   * List.Insert(1, "1.5")
   * console.log(...List.Iterator()) // 1, 1.5, 2
   * ```
   *
   * @param Index Number to Replace
   * @param Data Data to Insert
   * @returns void
   */
  Insert(Index: number, Data: T) {
    const Next = this.Get(Index);
    const Last = Next?.Last;

    if (!Next) return this.Append(Data);
    if (!Last) return this.Prepend(Data);

    const New = new Node(Data);
    Next.Last = New;
    New.Next = Next;
    Last.Next = New;
    New.Last = Last;

    this.Length++;
  }

  /**
   * Get the node at a given index.
   *
   * Computes at `O(n)`
   *
   * ```ts
   * List.Append("1")
   * List.Append("2")
   * console.log(List.Get(1).Data) // "2"
   * ```
   * @param Index Index of Node
   * @returns
   */
  Get(Index: number): Node<T> | undefined {
    let Current = this.Head;

    for (let i = 0; i < Index; i++) {
      if (!Current) return undefined;
      Current = Current.Next;
    }

    return Current;
  }

  /**
   * Generator for the linked list.
   *
   * Computes at `O(n)`
   */
  *Iterator(): Generator<T> {
    let Current = this.Head;

    while (Current) {
      yield Current.Data;
      Current = Current.Next;
    }
  }
}
