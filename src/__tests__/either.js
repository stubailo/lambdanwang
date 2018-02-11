// @flow
/* eslint-disable no-unused-expressions */
import {failure, success, type Either} from '../either';
import {none, some} from '../option';

describe('either', () => {
  test('map', () => {
    const strlen = (s: string): number => s.length;
    expect(failure('foo').failure.map(strlen)).toEqual(failure(3));
    expect(failure('foo').map(strlen)).toEqual(failure('foo'));
    expect(success('foobar').failure.map(strlen)).toEqual(success('foobar'));
    expect(success('foobar').map(strlen)).toEqual(success(6));

    () => {
      // ---------- Flow tests ----------
      // $ExpectError 23 is not compatible with strlen
      success(23).map(strlen);

      // $ExpectError should be Either<mixed, number>
      (success('foo').map(strlen): Either<mixed, string>);

      (success('foo').map(strlen): Either<mixed, number>);

      // $ExpectError 23 is not compatible with strlen
      failure(23).failure.map(strlen);

      // $ExpectError should be Either<number, mixed>
      (failure('foo').failure.map(strlen): Either<string, mixed>);

      (failure('foo').failure.map(strlen): Either<number, mixed>);
    };
  });

  test('flatMap', () => {
    const mapLeft = () => failure('failure mapped');
    const mapRight = () => success('success mapped');

    expect(failure(1).failure.flatMap(mapLeft)).toEqual(
      failure('failure mapped'),
    );
    expect(failure(1).failure.flatMap(mapRight)).toEqual(
      success('success mapped'),
    );
    expect(failure(1).flatMap(mapLeft)).toEqual(failure(1));
    expect(failure(1).flatMap(mapRight)).toEqual(failure(1));

    expect(success(1).failure.flatMap(mapLeft)).toEqual(success(1));
    expect(success(1).failure.flatMap(mapRight)).toEqual(success(1));
    expect(success(1).flatMap(mapLeft)).toEqual(failure('failure mapped'));
    expect(success(1).flatMap(mapRight)).toEqual(success('success mapped'));
  });

  test('getOrElse', () => {
    const def = 'hello';
    expect(failure(1).failure.getOrElse(def)).toEqual(1);
    expect(failure(1).getOrElse(def)).toEqual('hello');
    expect(success(1).failure.getOrElse(def)).toEqual('hello');
    expect(success(1).getOrElse(def)).toEqual(1);

    () => {
      // ---------- Flow tests ----------
      const either: Either<string, number> = success(23);

      // $ExpectError should be string | number
      (either.getOrElse('foo'): string);

      (either.getOrElse('foo'): string | number);

      // $ExpectError should be string | number
      (either.failure.getOrElse(23): number);

      (either.failure.getOrElse(23): string | number);
    };
  });

  test('filter', () => {
    const even = (n: number) => n % 2 === 0;
    expect(failure(1).failure.filter(even)).toEqual(none);
    expect(failure(1).filter(even)).toEqual(none);
    expect(failure(2).failure.filter(even)).toEqual(some(failure(2)));
    expect(failure(2).filter(even)).toEqual(none);

    expect(success(1).failure.filter(even)).toEqual(none);
    expect(success(1).filter(even)).toEqual(none);
    expect(success(2).failure.filter(even)).toEqual(none);
    expect(success(2).filter(even)).toEqual(some(success(2)));

    () => {
      // ---------- Flow tests ----------
      // $ExpectError predicate must return a boolean
      success(23).filter(() => 'not a boolean');

      // $ExpectError predicate argument must match
      success('foo').filter(even);

      success(23).filter(even);

      // $ExpectError predicate must return a boolean
      failure(23).failure.filter(() => 'not a boolean');

      // $ExpectError predicate argument must match
      failure('foo').failure.filter(even);

      failure(23).failure.filter(even);
    };
  });

  test('toOption', () => {
    expect(failure(1).failure.toOption()).toEqual(some(1));
    expect(failure(1).toOption()).toEqual(none);
    expect(success(1).failure.toOption()).toEqual(none);
    expect(success(1).toOption()).toEqual(some(1));

    () => {
      // ---------- Flow tests ----------
      const either: Either<string, number> = success(23);

      // $ExpectError should be Option<number>
      (either.toOption(): Option<string>);

      (either.toOption(): Option<number>);

      (either.toOption(): Option<mixed>);

      // !!! This should fail, but Flow doesn't catch it !!!
      (either.failure.toOption(): Option<number>);
      // $ExpectError But this works
      (either.failure.toOption().get(): number);

      (either.failure.toOption(): Option<string>);
    };
  });

  test('inspect', () => {
    expect(success(undefined).inspect()).toBe('success(undefined)');
    expect(success(null).inspect()).toBe('success(null)');
    expect(success(1).inspect()).toBe('success(1)');
    expect(success('foobar').inspect()).toBe('success("foobar")');
    expect(success([1, 2, 3]).inspect()).toBe('success([1,2,3])');
    expect(success({}).inspect()).toBe('success({})');
    expect(success(failure(3)).inspect()).toBe('success(failure(3))');
  });

  () => {
    // ---------- Flow tests ----------
    const either: Either<'a', 'b'> = success('b');
    (either: Either<string, 'b'>);
    (either: Either<string, string>);
    (either: Either<'a', string>);
    // $ExpectError
    (either: Either<string, number>);
  };
});
