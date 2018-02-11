# Functions

## `compose`

Performs function composition.
- `compose(f, g)` is equivalent to `(x) => f(g(x))`
- `compose(f, g, h)` is equivalent to `(x) => f(g(h(x)))`

## `mapObject`
`<T, U>(Iterable<T>, (T) => [string, U]) => {[string]: U}`

Given an Iterable and a mapper that returns a tuple, returns an object with the
tuples as key-value pairs.

**Example:**
```jsx
// Returns {_foo_: 3, _barbaz_: 6}
λ.mapObject(
  ['foo', 'barbaz'],
  (s: string) => [`_${s}_`, s.length],
);
```
