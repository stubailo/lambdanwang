// @flow
/* eslint-disable no-use-before-define */
import {some, none, type Option} from './option';

type EitherCommon<+A, +B> = {
  +failure: FailureProjection<A, B>,

  +map: <Y>(f: (B) => Y) => Either<A, Y>,
  +flatMap: <AA, Y>((B) => Either<AA, Y>) => Either<AA | A, Y>,
  +getOrElse: <Y>(def: Y) => B | Y,
  +filter: (p: (B) => boolean) => Option<Either<A, B>>,
  +toOption: () => Option<B>,
  +inspect: () => string,
};

type FailureProjection<+A, +B> = {
  +map: <X>(f: (A) => X) => Either<X, B>,
  +flatMap: <BB, X>((A) => Either<X, BB>) => Either<X, BB | B>,
  +getOrElse: <X>(def: X) => A | X,
  +filter: (p: (A) => boolean) => Option<Either<A, B>>,
  +toOption: () => Option<A>,
};

export type Failure<+A, +B> = {
  isFailure: true,
  isSuccess: false,
  +failureValue: A,
} & EitherCommon<A, B>;

export type Success<+A, +B> = {
  isFailure: false,
  isSuccess: true,
  +successValue: B,
} & EitherCommon<A, B>;

export type Either<+A, +B> = Failure<A, B> | Success<A, B>;

const formatValue = (val: mixed): string => {
  if (val instanceof AbstractEither) {
    return val.inspect();
  } else {
    return JSON.stringify(val);
  }
};

class AbstractEither<+A, +B> {
  // Abstract
  +isSuccess: boolean;
  +isFailure: boolean;

  get failure(): FailureProjection<A, B> {
    return failureProjection(this);
  }
  get failureValue(): A {
    throw new Error('Unimplemented AbstractEither#failureValue');
  }
  get successValue(): B {
    throw new Error('Unimplemented AbstractEither#successValue');
  }

  // Concrete
  map<X>(f: (B) => X): Either<A, X> {
    return this.isSuccess
      ? success(f(this.successValue))
      : failure(this.failureValue);
  }
  flatMap<AA, X>(f: (B) => Either<AA, X>): Either<AA | A, X> {
    return this.isSuccess ? f(this.successValue) : failure(this.failureValue);
  }
  getOrElse<X>(def: X): B | X {
    return this.isSuccess ? this.successValue : def;
  }
  filter(p: (B) => boolean): Option<Either<A, B>> {
    return this.isSuccess && p(this.successValue)
      ? some(success(this.successValue))
      : none;
  }
  toOption(): Option<B> {
    return this.isSuccess ? some(this.successValue) : none;
  }
  equals(anything: mixed) {
    if (anything instanceof AbstractEither) {
      if (this.isSuccess && anything.isSuccess) {
        return this.successValue === anything.successValue;
      } else if (this.isFailure && anything.isFailure) {
        return this.failureValue === anything.failureValue;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  inspect() {
    if (this.isSuccess) {
      return `success(${formatValue(this.successValue)})`;
    } else {
      return `failure(${formatValue(this.failureValue)})`;
    }
  }
}

const failureProjection = <A, B>(
  e: AbstractEither<A, B>,
): FailureProjection<A, B> => ({
  map: <X>(f: (A) => X): Either<X, B> =>
    e.isFailure ? failure(f(e.failureValue)) : success(e.successValue),
  flatMap: <BB, X>(f: (A) => Either<X, BB>): Either<X, BB | B> =>
    e.isFailure ? f(e.failureValue) : success(e.successValue),
  getOrElse: <X>(def: X): A | X => (e.isFailure ? e.failureValue : def),
  filter: (p: (A) => boolean): Option<Either<A, B>> =>
    e.isFailure && p(e.failureValue) ? some(failure(e.failureValue)) : none,
  toOption: (): Option<A> => (e.isFailure ? some(e.failureValue) : none),
});

class _Failure<+A, +B> extends AbstractEither<A, B> {
  +value: A;
  isSuccess: false = false;
  isFailure: true = true;

  constructor(value: A) {
    super();
    this.value = value;
  }

  get failureValue(): A {
    return this.value;
  }

  get successValue(): B {
    throw new Error('Called Failure.success');
  }
}

class _Success<+A, +B> extends AbstractEither<A, B> {
  +value: B;
  isSuccess: true = true;
  isFailure: false = false;

  constructor(value: B) {
    super();
    this.value = value;
  }

  get failureValue(): A {
    throw new Error('Called Success.failure');
  }

  get successValue(): B {
    return this.value;
  }
}

export const failure = <A, B>(value: A): Failure<A, B> => new _Failure(value);
export const success = <A, B>(value: B): Success<A, B> => new _Success(value);

export default {
  failure,
  success,
};
