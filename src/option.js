// @flow
/* eslint-disable no-use-before-define */

class AbstractOption<+A> {
  // Abstract
  +isEmpty: boolean;
  +nonEmpty: boolean;
  get(): A {
    throw new Error('Unimplemented AbstractOption#get');
  }

  map<B>(f: (A) => B): Option<B> {
    return this.isEmpty ? none : some(f(this.get()));
  }
  flatMap<B>(f: (A) => Option<B>): Option<B> {
    return this.isEmpty ? none : f(this.get());
  }
  forEach(f: (A) => void): void {
    if (this.nonEmpty) {
      f(this.get());
    }
  }
  getOrElse<B>(def: B): A | B {
    return this.isEmpty ? def : this.get();
  }
  getOrElseL<B>(def: () => B): A | B {
    return this.isEmpty ? def() : this.get();
  }
  filter(p: (A) => boolean): Option<A> {
    return this.isEmpty || p(this.get()) ? (this: any) : none;
  }
  equals(anything: mixed) {
    if (anything instanceof AbstractOption) {
      return this.isEmpty
        ? anything.isEmpty
        : anything.nonEmpty && this.get() === anything.get();
    } else {
      return false;
    }
  }
}

class Some<+A> extends AbstractOption<A> {
  +value: A;

  constructor(value: A) {
    super();
    this.value = value;
  }

  isEmpty: false = false;
  nonEmpty: true = true;
  get(): A {
    return this.value;
  }
}

class None<+A> extends AbstractOption<A> {
  isEmpty: true = true;
  nonEmpty: false = false;
  get() {
    throw new Error('Called None.get');
  }
}

export const some = <A>(a: A): Some<A> => new Some(a);
export const none: Option<empty> = new None();
export const of = <A>(a: A): Option<$NonMaybeType<A>> =>
  a === null || a === undefined ? none : some(a);

export type Option<+A> = Some<A> | None<A>;

export default {
  some,
  none,
  of,
};
