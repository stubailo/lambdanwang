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
      return e.leftValue;
    } else {
      throw new Error('Either.left.value on Right');
    }
  }
  map<X>(f: A => X): Either<X, B> {
    const {e} = this;
    return e.isLeft === true ? left(f(e.leftValue)) : right(e.rightValue);
  }
  flatMap<X>(f: A => Either<X, B>): Either<X, B> {
    const {e} = this;
    return e.isLeft === true ? f(e.leftValue) : right(e.rightValue);
  }
  getOrElse<X>(def: X): (A | X) {
    const {e} = this;
    return e.isLeft === true ? e.leftValue : def;
  }
  filter(p: A => boolean): Option<Either<A, B>> {
    const {e} = this;
    if (e.isLeft === true && p(e.leftValue)) {
      return some(e);
    } else {
      return none;
    }
  }
  toOption(): Option<A> {
    const {e} = this;
    return e.isLeft === true ? some(e.leftValue) : none;
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
      return e.rightValue;
    } else {
      throw new Error('Either.right.value on Left');
    }
  }
  map<X>(f: B => X): Either<A, X> {
    const {e} = this;
    return e.isRight === true ? right(f(e.rightValue)) : left(e.leftValue);
  }
  flatMap<X>(f: B => Either<A, X>): Either<A, X> {
    const {e} = this;
    return e.isRight === true ? f(e.rightValue) : left(e.leftValue);
  }
  getOrElse<X>(def: X): (B | X) {
    const {e} = this;
    return e.isRight === true ? e.rightValue : def;
  }
  filter(p: B => boolean): Option<Either<A, B>> {
    const {e} = this;
    if (e.isRight === true && p(e.rightValue)) {
      return some(e);
    } else {
      return none;
    }
  }
  toOption(): Option<B> {
    const {e} = this;
    return e.isRight === true ? some(e.rightValue) : none;
  }
}

class Left<A, B> extends AbstractEither<A, B> {
  leftValue: A;
  constructor(leftValue: A) {
    super();
    this.leftValue = leftValue;
  }
  isLeft: true = true;
  isRight: false = false;
}

class Right<A, B> extends AbstractEither<A, B> {
  rightValue: B;
  constructor(rightValue: B) {
    super();
    this.rightValue = rightValue;
  }
  isLeft: false = false;
  isRight: true = true;
}

export const left = <A, B>(leftValue: A): Left<A, B> => new Left(leftValue);
export const right = <A, B>(rightValue: B): Right<A, B> => new Right(rightValue);

export type Either<A, B> = Left<A, B> | Right<A, B>;

export default {
  left,
  right,
};
