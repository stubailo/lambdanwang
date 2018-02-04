# Option

An Option represents a value that may or may not be there. All options are either

* the value `none`, representing the absence of a value, or
* a wrapped value created with the `some` constructor

Options are meant to replace the use of `null` and `undefined` values.

**API Reference**

* [`some` and `none`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#some-and-none)
* [`of`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#of-t--optionnonmaybetypet)
* [`map`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#map-optiona--a--b--optionb)
* [`flatMap`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#flatmap-optiona--a--optionb--optionb)
* [`filter`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#filter-optiona--a--boolean--optiona)
* [`forEach`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#foreach-optiona--a--void--void)
* [`getOrElse`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#getorelse-optiona--a--a)
* [`getOrElseL`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#getorelsel-optiona----a--a)
* [`get`](https://github.com/danwang/lambdanwang/blob/master/docs/option.md#get-optiona--a)

## Entering the Option world

In this category, Options are created from non-Option values.

### `some` and `none`

The `some` constructor creates an Option with the provided value. `none` is the
singleton value representing an absence of a value.

**Example:** Parse an possible email from a string

```jsx
import {some, none, type Option} from 'lambdanwang/option';

type Email = {user: string, domain: string};
const parseEmail = (email: string): Option<Email> => {
  // This is not really a good way to match emails; just for illustration
  const match = email.match(/^(.*)@(.*)$/));
  if (match) {
    return some({user: match[0], domain: match[1]});
  } else {
    return none;
  }
};
```

### `of: (T) => Option<$NonMaybeType<T>>`

Creates an Option from a nullable type, mapping `null` and `undefined` to `none`.

**Example:** Converting a nullable value to Option

```jsx
import option, {type Option} from 'lambdanwang/option';

const maybeString: ?string = fromOtherLibrary();
const option: Option<string> = option.of(maybeString);
```

## Manipulating Options

The main benefit of using Options comes from different ways to transform values.

### `map: (Option<A>) => (A => B) => Option<B>`

Transforms the interior value of a `some`, re-wrapping it in `some`. Acts as
the identity function on `none`.

* `some(t).map(f)` is equivalent to `some(f(t))`
* `none.map(f)` is `none`

**Example**

```jsx
const parseDomain = (input: string): Option<string> => {
  const maybeEmail: Option<Email> = parseEmail(input);
  return maybeEmail.map((email: Email) => email.domain);
};
```

### `flatMap: (Option<A>) => (A => Option<B>) => Option<B>`

Applies a function returning an Option to the interior value of a `some`. Acts
as the identity on `none`.

* `some(t).flatMap(f)` is equivalent to `f(t)`
* `none.flatMap(f)` is equivalent to `none`

### `filter: (Option<A>) => (A => boolean) => Option<A>`

Returns the option if it is a `some` and the predicate returns true on the
interior value, otherwise `none`.

* `some(t).filter(predicate)` is equivalent to `predicate(t) ? some(t) : none`
* `none.filter(predicate)` is `none`

### `forEach: (Option<A>) => (A => void) => void`

Runs a procedure with the interior value if the Option is a `some`, doing
nothing otherwise.

## Leaving the Option world

Obtain a non-Optional value from an Option; e.g., for use with a non-Option
API.

### `getOrElse: (Option<A>) => (A) => A`

Returns the interior value if the option is a `some` or the provided default
value otherwise.

**Example:** Using Options with React

```jsx
<div>
  {parseEmail(input)
    .map((email) => <div>Email address is {email}</div>)
    .getOrElse(<div>No email provided</div>)}
</div>
```

### `getOrElseL: (Option<A>) => (() => A) => A`

Like `getOrElse`, but with a lazily evaluated default, which is executed only
if the option is empty.

### `get: (Option<A>) => A`

Returns the interior value of a `some`. If the Option is `none`, an exception
is thrown. This should be only be used in cases when the Option is known to not
be empty.

## Manually inspecting

Options can be manually unpacked, but it's unlikely that this is necessary
given the other Option methods.

```jsx
if (option.isEmpty) {
  // The option is none
} else {
  // Flow knows that the option is a some. Access the interior value with
  // option.value
}
```

## Transitioning from using `null`

All common operations can be translated from nullable types to their Option
equivalents.

| Using `foo: A | null`   | Using `foo: Option<A>`          |
| ----------------------- | ------------------------------- |
| `foo || f(foo)`         | `foo.map(f)` , `foo.flatMap(f)` |
| `foo || defaultValue`   | `foo.getOrElse(defaultValue)`   |
| `foo || getDefault()`   | `foo.getOrElseL(getDefault)`    |
| `foo && procedure(foo)` | `foo.forEach(procedure)`        |
