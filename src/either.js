// @flow
/* eslint-disable no-use-before-define */
import type {Option} from './option.js';
import {some, none} from './option.js';

type EitherCommon<+A, +B> = {
  +failure: FailureProjection<A, B>,
  +success: SuccessProjection<A, B>,
};
export type Failure<+A, +B> = EitherCommon<A, B> & {
  isFailure: true,
  isSuccess: false,
  +failureValue: A,
};

export type Success<+A, +B> = EitherCommon<A, B> & {
  isFailure: false,
  isSuccess: true,
  +successValue: B,
};

class AbstractEither<A, B> {
  isFailure: $Subtype<boolean>;
  isSuccess: $Subtype<boolean>;
  failure: FailureProjection<A, B> = (new FailureProjection((this: any)));
  success: SuccessProjection<A, B> = (new SuccessProjection((this: any)));
}

class _FailureProjection<A, B> {
  e: Either<A, B>;
  map<X>(f: A => X): Either<X, B> {
    const {e} = this;
    return e.isFailure ? failure(f(e.failureValue)) : success(e.successValue);
  }
  flatMap<X>(f: A => Either<X, B>): Either<X, B> {
    const {e} = this;
    return e.isFailure ? f(e.failureValue) : success(e.successValue);
  }
  getOrElse<X>(def: X): (A | X) {
    const {e} = this;
    return e.isFailure ? e.failureValue : def;
  }
  filter(p: A => boolean): Option<Either<A, B>> {
    const {e} = this;
    if (e.isFailure && p(e.failureValue)) {
      return some(e);
    } else {
      return none;
    }
  }
  toOption(): Option<A> {
    const {e} = this;
    return e.isFailure ? some(e.failureValue) : none;
  }
}

// $ExpectError
class FailureProjection<+A, +B> extends _FailureProjection<A, B> {
  +e: Either<A, B>;
  // $ExpectError
  constructor(e: Either<A, B>) {
    super();
    // $ExpectError
    this.e = e;
  }
  get() {
    const {e} = this;
    if (e.isFailure) {
      return e.failureValue;
    } else {
      throw new Error('Either.failure.value on Success');
    }
  }
}

class _SuccessProjection<A, B> {
  e: Either<A, B>;
  map<X>(f: B => X): Either<A, X> {
    const {e} = this;
    return e.isSuccess ? success(f(e.successValue)) : failure(e.failureValue);
  }
  flatMap<X>(f: B => Either<A, X>): Either<A, X> {
    const {e} = this;
    return e.isSuccess ? f(e.successValue) : failure(e.failureValue);
  }
  getOrElse<X>(def: X): (B | X) {
    const {e} = this;
    return e.isSuccess ? e.successValue : def;
  }
  filter(p: B => boolean): Option<Either<A, B>> {
    const {e} = this;
    if (e.isSuccess && p(e.successValue)) {
      return some(e);
    } else {
      return none;
    }
  }
  toOption(): Option<B> {
    const {e} = this;
    return e.isSuccess ? some(e.successValue) : none;
  }
}

// $ExpectError
class SuccessProjection<+A, +B> extends _SuccessProjection<A, B> {
  +e: Either<A, B>;
  // $ExpectError
  constructor(e: Either<A, B>) {
    super();
    // $ExpectError
    this.e = e;
  }
  get() {
    const {e} = this;
    if (e.isSuccess) {
      return e.successValue;
    } else {
      throw new Error('Either.success.value on Failure');
    }
  }
}

class _Failure<A, B> extends AbstractEither<A, B> {
  failureValue: A;
  constructor(failureValue: A) {
    super();
    this.failureValue = failureValue;
  }
  isFailure: true = true;
  isSuccess: false = false;
}

class _Success<A, B> extends AbstractEither<A, B> {
  successValue: B;
  constructor(successValue: B) {
    super();
    this.successValue = successValue;
  }
  isFailure: false = false;
  isSuccess: true = true;
}

export const failure = <A, B>(failureValue: A): Failure<A, B> => new _Failure(failureValue);
export const success = <A, B>(successValue: B): Success<A, B> => new _Success(successValue);

export type Either<+A, +B> = Failure<A, B> | Success<A, B>;

export default {
  failure,
  success,
};
