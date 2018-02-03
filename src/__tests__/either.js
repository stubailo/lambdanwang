// @flow
/* eslint-disable no-unused-expressions */
import {failure, success, type Either} from '../either';
import {none, some} from '../option';

describe('either', () => {
  test('map', () => {
    const strlen = (s: string): number => s.length;
    expect(failure('foo').failure.map(strlen)).toEqual(failure(3));
    expect(failure('foo').success.map(strlen)).toEqual(failure('foo'));
    expect(success('foobar').failure.map(strlen)).toEqual(success('foobar'));
    expect(success('foobar').success.map(strlen)).toEqual(success(6));
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
    expect(failure(1).success.flatMap(mapLeft)).toEqual(failure(1));
    expect(failure(1).success.flatMap(mapRight)).toEqual(failure(1));

    expect(success(1).failure.flatMap(mapLeft)).toEqual(success(1));
    expect(success(1).failure.flatMap(mapRight)).toEqual(success(1));
    expect(success(1).success.flatMap(mapLeft)).toEqual(
      failure('failure mapped'),
    );
    expect(success(1).success.flatMap(mapRight)).toEqual(
      success('success mapped'),
    );
  });

  test('getOrElse', () => {
    const def = 'hello';
    expect(failure(1).failure.getOrElse(def)).toEqual(1);
    expect(failure(1).success.getOrElse(def)).toEqual('hello');
    expect(success(1).failure.getOrElse(def)).toEqual('hello');
    expect(success(1).success.getOrElse(def)).toEqual(1);
  });

  test('filter', () => {
    const even = (n: number) => n % 2 === 0;
    expect(failure(1).failure.filter(even)).toEqual(none);
    expect(failure(1).success.filter(even)).toEqual(none);
    expect(failure(2).failure.filter(even)).toEqual(some(failure(2)));
    expect(failure(2).success.filter(even)).toEqual(none);

    expect(success(1).failure.filter(even)).toEqual(none);
    expect(success(1).success.filter(even)).toEqual(none);
    expect(success(2).failure.filter(even)).toEqual(none);
    expect(success(2).success.filter(even)).toEqual(some(success(2)));
  });

  test('toOption', () => {
    expect(failure(1).failure.toOption()).toEqual(some(1));
    expect(failure(1).success.toOption()).toEqual(none);
    expect(success(1).failure.toOption()).toEqual(none);
    expect(success(1).success.toOption()).toEqual(some(1));
  });
});

if (false) {
  describe('Eithers are covariant', () => {
    test('Either', () => {
      const either: Either<'a', 'b'> = (null: any);
      (either: Either<string, 'b'>);
      (either: Either<string, string>);
      (either: Either<'a', string>);
      // $ExpectError
      (either: Either<string, number>);
    });

    test('failure', () => {
      (failure(1): Either<number, number>);
    });
  });
}
