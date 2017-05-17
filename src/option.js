// @flow
/* eslint-disable no-use-before-define */

class AbstractOption<A> {
  // Abstract
  isEmpty: $Subtype<boolean>;
  nonEmpty: $Subtype<boolean>;
  get(): A {
    throw new Error('Unimplemented AbstractOption#get');
  }

  map<B>(f: A => B): Option<B> {
    return this.isEmpty ? none : some(f(this.get()));
  }
  flatMap<B>(f: A => Option<B>): Option<B> {
    return this.isEmpty ? none : f(this.get());
  }
  getOrElse<B>(def: B): (A | B) {
    return this.isEmpty ? def : this.get();
  }
  filter(p: A => boolean): Option<A> {
    return (this.isEmpty || p(this.get())) ? (this: any) : none;
  }
}

class Some<A> extends AbstractOption<A> {
  value: A;
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

class None extends AbstractOption<any> {
  isEmpty: true = true;
  nonEmpty: false = false;
  get() {
    throw new Error('Called None.get');
  }
}

export const some = <A>(a: A): Some<A> => new Some(a);
export const none = new None();
export const of = <A>(a: A): Option<$NonMaybeType<A>> => {
  return (a === null || a === undefined) ? none : some(a);
};

export type Option<A> = Some<A> | None;

export default {
  some,
  none,
};
