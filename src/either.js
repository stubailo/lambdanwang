// @flow
/* eslint-disable no-use-before-define */
import type {Option} from './option.js';
import {some, none} from './option.js';

type EitherCommon<A, B> = {
  +left: LeftProjection<A, B>,
  +right: RightProjection<A, B>,
};
type Left<A, B> = EitherCommon<A, B> & {
  isLeft: true,
  isRight: false,
  +leftValue: A,
};

type Right<A, B> = EitherCommon<A, B> & {
  isLeft: false,
  isRight: true,
  +rightValue: B,
};

class AbstractEither<A, B> {
  isLeft: $Subtype<boolean>;
  isRight: $Subtype<boolean>;
  left: LeftProjection<A, B> = (new LeftProjection((this: any)));
  right: RightProjection<A, B> = (new RightProjection((this: any)));
}

class _LeftProjection<A, B> {
  e: Either<A, B>;
  map<X>(f: A => X): Either<X, B> {
    const {e} = this;
    return e.isLeft ? left(f(e.leftValue)) : right(e.rightValue);
  }
  flatMap<X>(f: A => Either<X, B>): Either<X, B> {
    const {e} = this;
    return e.isLeft ? f(e.leftValue) : right(e.rightValue);
  }
  getOrElse<X>(def: X): (A | X) {
    const {e} = this;
    return e.isLeft ? e.leftValue : def;
  }
  filter(p: A => boolean): Option<Either<A, B>> {
    const {e} = this;
    if (e.isLeft && p(e.leftValue)) {
      return some(e);
    } else {
      return none;
    }
  }
  toOption(): Option<A> {
    const {e} = this;
    return e.isLeft ? some(e.leftValue) : none;
  }
}

// $ExpectError
class LeftProjection<+A, +B> extends _LeftProjection<A, B> {
  +e: Either<A, B>;
  // $ExpectError
  constructor(e: Either<A, B>) {
    super();
    // $ExpectError
    this.e = e;
  }
  get() {
    const {e} = this;
    if (e.isLeft) {
      return e.leftValue;
    } else {
      throw new Error('Either.left.value on Right');
    }
  }
}

class _RightProjection<A, B> {
  e: Either<A, B>;
  map<X>(f: B => X): Either<A, X> {
    const {e} = this;
    return e.isRight ? right(f(e.rightValue)) : left(e.leftValue);
  }
  flatMap<X>(f: B => Either<A, X>): Either<A, X> {
    const {e} = this;
    return e.isRight ? f(e.rightValue) : left(e.leftValue);
  }
  getOrElse<X>(def: X): (B | X) {
    const {e} = this;
    return e.isRight ? e.rightValue : def;
  }
  filter(p: B => boolean): Option<Either<A, B>> {
    const {e} = this;
    if (e.isRight && p(e.rightValue)) {
      return some(e);
    } else {
      return none;
    }
  }
  toOption(): Option<B> {
    const {e} = this;
    return e.isRight ? some(e.rightValue) : none;
  }
}

// $ExpectError
class RightProjection<+A, +B> extends _RightProjection<A, B> {
  +e: Either<A, B>;
  // $ExpectError
  constructor(e: Either<A, B>) {
    super();
    // $ExpectError
    this.e = e;
  }
  get() {
    const {e} = this;
    if (e.isRight) {
      return e.rightValue;
    } else {
      throw new Error('Either.right.value on Left');
    }
  }
}

class _Left<A, B> extends AbstractEither<A, B> {
  leftValue: A;
  constructor(leftValue: A) {
    super();
    this.leftValue = leftValue;
  }
  isLeft: true = true;
  isRight: false = false;
}

class _Right<A, B> extends AbstractEither<A, B> {
  rightValue: B;
  constructor(rightValue: B) {
    super();
    this.rightValue = rightValue;
  }
  isLeft: false = false;
  isRight: true = true;
}

export const left = <A, B>(leftValue: A): Left<A, B> => new _Left(leftValue);
export const right = <A, B>(rightValue: B): Right<A, B> => new _Right(rightValue);

export type Either<+A, +B> = Left<A, B> | Right<A, B>;

export default {
  left,
  right,
};
