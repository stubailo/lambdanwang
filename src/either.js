// @flow
/* eslint-disable no-use-before-define */
import type {Option} from './option.js';
import {some, none} from './option.js';

class AbstractEither<A, B> {
  isLeft: $Subtype<boolean>;
  isRight: $Subtype<boolean>;
  left: LeftProjection<A, B> = (new LeftProjection((this: any)));
  right: RightProjection<A, B> = (new RightProjection((this: any)));
}

class LeftProjection<A, B> {
  e: Either<A, B>;
  constructor(e: Either<A, B>) {
    this.e = e;
  }
  get() {
    const {e} = this;
    if (e.isLeft === true) {
      return e.a;
    } else {
      throw new Error('Either.left.value on Right');
    }
  }
  map<X>(f: A => X): Either<X, B> {
    const {e} = this;
    return e.isLeft === true ? left(f(e.a)) : right(e.b);
  }
  flatMap<X>(f: A => Either<X, B>): Either<X, B> {
    const {e} = this;
    return e.isLeft === true ? f(e.a) : right(e.b);
  }
  getOrElse<X>(def: X): (A | X) {
    const {e} = this;
    return e.isLeft === true ? e.a : def;
  }
  filter(p: A => boolean): Option<Either<A, B>> {
    const {e} = this;
    if (e.isLeft === true && p(e.a)) {
      return some(e);
    } else {
      return none;
    }
  }
  toOption(): Option<A> {
    const {e} = this;
    return e.isLeft === true ? some(e.a) : none;
  }
}

class RightProjection<A, B> {
  e: Either<A, B>;
  constructor(e: Either<A, B>) {
    this.e = e;
  }
  get() {
    const {e} = this;
    if (e.isRight === true) {
      return e.b;
    } else {
      throw new Error('Either.right.value on Left');
    }
  }
  map<X>(f: B => X): Either<A, X> {
    const {e} = this;
    return e.isRight === true ? right(f(e.b)) : left(e.a);
  }
  flatMap<X>(f: B => Either<A, X>): Either<A, X> {
    const {e} = this;
    return e.isRight === true ? f(e.b) : left(e.a);
  }
  getOrElse<X>(def: X): (B | X) {
    const {e} = this;
    return e.isRight === true ? e.b : def;
  }
  filter(p: B => boolean): Option<Either<A, B>> {
    const {e} = this;
    if (e.isRight === true && p(e.b)) {
      return some(e);
    } else {
      return none;
    }
  }
  toOption(): Option<B> {
    const {e} = this;
    return e.isRight === true ? some(e.b) : none;
  }
}

class Left<A, B> extends AbstractEither<A, B> {
  a: A;
  constructor(a: A) {
    super();
    this.a = a;
  }
  isLeft: true = true;
  isRight: false = false;
}

class Right<A, B> extends AbstractEither<A, B> {
  b: B;
  constructor(b: B) {
    super();
    this.b = b;
  }
  isLeft: false = false;
  isRight: true = true;
}

export const left = <A, B>(a: A): Left<A, B> => new Left(a);
export const right = <A, B>(b: B): Right<A, B> => new Right(b);

export type Either<A, B> = Left<A, B> | Right<A, B>;

export default {
  left,
  right,
};
