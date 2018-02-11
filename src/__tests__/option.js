// @flow
/* eslint-disable no-unused-expressions */
import {some, none, of, type Some, type None, type Option} from '../option';

describe('option', () => {
  test('map', () => {
    const strlen = (s: string): number => s.length;
    expect(none.map(strlen).equals(none)).toBe(true);
    expect(
      some('foo')
        .map(strlen)
        .equals(some(3)),
    ).toBe(true);

    () => {
      // ---------- Flow tests ----------
      // $ExpectError 23 is not compatible with strlen
      some(23).map(strlen);

      // $ExpectError should be Option<number>
      (some('foo').map(strlen): Option<string>);

      (some('foo').map(strlen): Option<number>);
    };
  });

  test('flatMap', () => {
    const maybeDiv2 = (n: number): Option<number> =>
      n % 2 === 0 ? some(n / 2) : none;
    const div2 = (n: number) => n / 2;
    expect(none.flatMap(maybeDiv2).equals(none)).toBe(true);
    expect(
      some(5)
        .flatMap(maybeDiv2)
        .equals(none),
    ).toBe(true);
    expect(
      some(6)
        .flatMap(maybeDiv2)
        .equals(some(3)),
    ).toBe(true);

    () => {
      // ---------- Flow tests ----------
      // $ExpectError div2 cannot be used with flatMap
      some(5).flatMap(div2);

      // $ExpectError 'bar' is not compatible with maybeDiv2
      some('bar').flatMap(maybeDiv2);

      (some(5).flatMap(maybeDiv2): Option<number>);
    };
  });

  test('forEach', () => {
    const fn1 = jest.fn();
    none.forEach(fn1);
    expect(fn1.mock.calls.length).toBe(0);

    const fn2 = jest.fn();
    some('foobar').forEach(fn2);
    expect(fn2).toHaveBeenCalledWith('foobar');

    () => {
      // ---------- Flow tests ----------
      const emptyFn: (empty) => empty = (e: empty) => e;

      // none.forEach with invalid parameters is okay
      (none.forEach(emptyFn): void);

      // $ExpectError emptyFn is not compatible with 1
      some(1).forEach(emptyFn);

      const opt: Option<number> = none;
      // $ExpectError emptyFn is not compatible with number
      opt.forEach(emptyFn);
    };
  });

  test('getOrElse', () => {
    const def = 'hello';

    expect(none.getOrElse(def)).toBe(def);
    expect(some('foo').getOrElse(def)).toBe('foo');

    () => {
      // ---------- Flow tests ----------
      const opt: Option<string> = none;
      // $ExpectError should be string | number
      (opt.getOrElse(23): string);

      (opt.getOrElse(23): string | number);
    };
  });

  test('getOrElseL', () => {
    const def1 = jest.fn().mockReturnValue('hello');
    expect(none.getOrElseL(def1)).toBe('hello');
    expect(def1.mock.calls.length).toBe(1);

    const def2 = jest.fn().mockReturnValue('hello');
    expect(some('world').getOrElseL(def2)).toBe('world');
    expect(def2.mock.calls.length).toBe(0);

    () => {
      // ---------- Flow tests ----------
      const opt: Option<string> = none;
      // $ExpectError function type required
      opt.getOrElseL(2);

      // $ExpectError should be string | number
      (opt.getOrElseL(() => 2): string);

      (opt.getOrElseL(() => 2): string | number);
    };
  });

  test('filter', () => {
    const matches = (s: string) => !!s.match(/^sudo /);
    expect(none.filter(matches).equals(none)).toBe(true);

    expect(
      some('ls')
        .filter(matches)
        .equals(none),
    ).toBe(true);
    expect(
      some('sudo ls')
        .filter(matches)
        .equals(some('sudo ls')),
    ).toBe(true);

    () => {
      // ---------- Flow tests ----------
      // $ExpectError predicate must return a boolean
      none.filter(() => 'not a boolean');

      // $ExpectError predicate argument must match
      some(23).filter(matches);

      some(1).filter((i: number) => i % 2 === 0);
    };
  });

  test('inspect', () => {
    expect(none.inspect()).toBe('none');
    expect(some(undefined).inspect()).toBe('some(undefined)');
    expect(some(null).inspect()).toBe('some(null)');
    expect(some(1).inspect()).toBe('some(1)');
    expect(some('foobar').inspect()).toBe('some("foobar")');
    expect(some([1, 2, 3]).inspect()).toBe('some([1,2,3])');
    expect(some({}).inspect()).toBe('some({})'); // haha
    expect(some(some(3)).inspect()).toBe('some(some(3))');
  });

  describe('constructors', () => {
    test('none', () => {
      expect(none.isEmpty).toBe(true);
      expect(none.nonEmpty).toBe(false);

      () => {
        // ---------- Flow tests ----------
        // Covariance
        (none: Option<number>);
        (none: Option<mixed>);
        (none: Option<empty>);
      };
    });

    test('some', () => {
      expect(some(1).isEmpty).toBe(false);
      expect(some(1).nonEmpty).toBe(true);

      () => {
        // ---------- Flow tests ----------
        // Covariance
        (some(1): Option<number>);
        (some(1): Option<mixed>);
        // $ExpectError 1 is not compatible with string
        (some(1): Option<string>);
      };
    });

    test('of', () => {
      expect(of(null).equals(none)).toBe(true);
      expect(of(undefined).equals(none)).toBe(true);
      expect(of(0).equals(some(0))).toBe(true);
      expect(of('').equals(some(''))).toBe(true);

      () => {
        // ---------- Flow tests ----------
        // Covariance
        const a: ?number = 3;
        // $ExpectError should be Option<number>
        (of(a): Option<string>);

        (of(a): Option<number>);

        const b: null | string = 'b';
        (of(b): Option<string>);
      };
    });
  });

  () => {
    // ---------- Flow tests ----------
    // Covariance
    const opt: Option<'a'> = none;
    (opt: Option<string>);
    // $ExpectError
    (opt: Option<{}>);

    // Inference with nonEmpty
    if (opt.nonEmpty === true) {
      (opt: Some<'a'>);
    } else {
      (opt: None);
    }

    // Inference with isEmpty
    if (opt.isEmpty === true) {
      (opt: None);
    } else {
      (opt: Some<'a'>);
    }
  };
});
