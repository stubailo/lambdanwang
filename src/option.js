// @flow
/* eslint-disable no-use-before-define */

type OptionCommon<+A> = {
  +get: () => A,
  +map: <B>((A) => B) => Option<B>,
  +flatMap: <B>((A) => Option<B>) => Option<B>,
  +forEach: ((A) => void) => void,
  +getOrElse: <B>(B) => A | B,
  +getOrElseL: <B>(() => B) => A | B,
  +filter: ((A) => boolean) => Option<A>,
  +equals: (mixed) => boolean,
};

export type None = {
  isEmpty: true,
  nonEmpty: false,
} & OptionCommon<empty>;

export type Some<+A> = {
  +value: A,
  isEmpty: false,
  nonEmpty: true,
} & OptionCommon<A>;

export type Option<+A> = Some<A> | None;

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

class _None<+A> extends AbstractOption<A> {
  isEmpty: true = true;
  nonEmpty: false = false;
  get() {
    throw new Error('Called None.get');
  }
}

class _Some<+A> extends AbstractOption<A> {
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

export const some = <A>(a: A): Some<A> => new _Some(a);
export const none: None = new _None();

export const of = <A>(a: A): Option<$NonMaybeType<A>> => {
  if (a === null || a === undefined) {
    return none;
  } else {
    return some(a);
  }
};

export default {
  some,
  none,
  of,
};
