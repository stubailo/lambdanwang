// @flow
/* eslint-disable no-unused-expressions */
import type {Option} from '../option.js';
import {some, none, of} from '../option.js';

describe('option', () => {
  test('map', () => {
    const strlen = (s: string): number => s.length;
    expect(none.map(strlen)).toEqual(none);
    expect(some('foo').map(strlen)).toEqual(some(3));

    if (false) {
      // $ExpectError
      some(23).map(strlen);
      // $ExpectError
      (some('foo').map(strlen): Option<string>);
    }
  });

  test('flatMap', () => {
    const div2 = (i: number) => (i % 2 === 0 ? some(i / 2) : none);
    expect(none.flatMap(div2)).toEqual(none);
    expect(some(5).flatMap(div2)).toEqual(none);
    expect(some(6).flatMap(div2)).toEqual(some(3));

    if (false) {
      // $ExpectError
      some('bar').flatMap(div2);
      // $ExpectError
      some(5).flatMap((i: number) => i / 2);
    }
  });

  test('getOrElse', () => {
    const def = 'hello';
    expect(none.getOrElse(def)).toEqual(def);
    expect(some('foo').getOrElse(def)).toEqual('foo');

    if (false) {
      (some('foo').getOrElse(23): (string | number));
    }
  });

  test('filter', () => {
    const matches = (s: string) => !!s.match(/^sudo /);
    expect(none.filter(matches)).toEqual(none);
    expect(some('ls').filter(matches)).toEqual(none);
    expect(some('sudo ls').filter(matches)).toEqual(some('sudo ls'));

    if (false) {
      // $ExpectError
      none.filter(() => 'not a boolean');
      // $ExpectError
      some(23).filter(matches);
    }
  });

  test('constructors', () => {
    expect(none.isEmpty).toBe(true);
    expect(none.nonEmpty).toBe(false);
    expect(some(1).isEmpty).toBe(false);
    expect(some(1).nonEmpty).toBe(true);

    expect(of(null)).toEqual(none);
    expect(of(undefined)).toEqual(none);
    expect(of(0)).toEqual(some(0));
    expect(of('')).toEqual(some(''));
  });
});

if (false) {
  const opt1: Option<number> = (null: any);
  if (opt1.nonEmpty === true) {
    (opt1.value: number);
  } else {
    // $ExpectError
    (opt1.value: number);
  }

  const opt2: Option<{a: number}> = (null: any);
  // $ExpectError
  (opt2: Option<{}>);
}
