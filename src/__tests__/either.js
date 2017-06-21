// @flow
/* eslint-disable no-unused-expressions */
import type {Either} from '../either.js';
import {left, right} from '../either.js';
import {none, some} from '../option.js';

describe('either', () => {
  test('map', () => {
    const strlen = (s: string): number => s.length;
    expect(left('left').left.map(strlen)).toEqual(left(4));
    expect(left('left').right.map(strlen)).toEqual(left('left'));
    expect(right('right').left.map(strlen)).toEqual(right('right'));
    expect(right('right').right.map(strlen)).toEqual(right(5));
  });

  test('flatMap', () => {
    const mapLeft = (n: number) => left('left mapped');
    const mapRight = (n: number) => right('right mapped');

    expect(left(1).left.flatMap(mapLeft)).toEqual(left('left mapped'));
    expect(left(1).left.flatMap(mapRight)).toEqual(right('right mapped'));
    expect(left(1).right.flatMap(mapLeft)).toEqual(left(1));
    expect(left(1).right.flatMap(mapRight)).toEqual(left(1));

    expect(right(1).left.flatMap(mapLeft)).toEqual(right(1));
    expect(right(1).left.flatMap(mapRight)).toEqual(right(1));
    expect(right(1).right.flatMap(mapLeft)).toEqual(left('left mapped'));
    expect(right(1).right.flatMap(mapRight)).toEqual(right('right mapped'));
  });

  test('getOrElse', () => {
    const def = 'hello';
    expect(left(1).left.getOrElse(def)).toEqual(1);
    expect(left(1).right.getOrElse(def)).toEqual('hello');
    expect(right(1).left.getOrElse(def)).toEqual('hello');
    expect(right(1).right.getOrElse(def)).toEqual(1);
  });

  test('filter', () => {
    const even = (n: number) => n % 2 === 0;
    expect(left(1).left.filter(even)).toEqual(none);
    expect(left(1).right.filter(even)).toEqual(none);
    expect(left(2).left.filter(even)).toEqual(some(left(2)));
    expect(left(2).right.filter(even)).toEqual(none);

    expect(right(1).left.filter(even)).toEqual(none);
    expect(right(1).right.filter(even)).toEqual(none);
    expect(right(2).left.filter(even)).toEqual(none);
    expect(right(2).right.filter(even)).toEqual(some(right(2)));
  });

  test('toOption', () => {
    expect(left(1).left.toOption()).toEqual(some(1));
    expect(left(1).right.toOption()).toEqual(none);
    expect(right(1).left.toOption()).toEqual(none);
    expect(right(1).right.toOption()).toEqual(some(1));
  });
});

if (false) {
  test('Eithers are covariant', () => {
    const either: Either<'a', 'b'> = (null: any);
    (either: Either<string, 'b'>);
    (either: Either<string, string>);
    (either: Either<'a', string>);
    // $ExpectError
    (either: Either<string, number>);
  });
}
