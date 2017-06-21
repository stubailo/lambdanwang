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
  describe('Unpacking options', () => {
    test('It does inference with nonEmpty checks', () => {
      const opt: Option<number> = (null: any);
      if (opt.nonEmpty === true) {
        (opt.value: number);
      } else {
        // $ExpectError
        (opt.value: number);
      }
    });
  });

  test('Options are covariant', () => {
    const opt: Option<'a'> = (null: any);
    (opt: Option<string>);
    // $ExpectError
    (opt: Option<{}>);
  });

  test('None is a member of any option type', () => {
    type A = {a: 1};
    (none: Option<A>);
  });

  test('getOrElse', () => {
    const opt: Option<string> = (null: any);
    (opt.getOrElse(2): string | number);
  });

  test('getOrElseL', () => {
    const opt: Option<string> = (null: any);
    (opt.getOrElseL(() => 2): string | number);
  });
}
