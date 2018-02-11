# Either

An Either represents a value that is either correct (success) or an error
(failure). A value of type `Either<A, B>` is either

* A Failure of type `A` wrapped with the `failure` constructor, or
* A Success of type `B` wrapped with the `success` constructor

An Either is like an
[option](https://github.com/danwang/lambdanwang/blob/master/docs/option.md)
where the empty case can hold a value.

The Either API is Success-biased; methods available on Eithers transform
Success values and leave Failure values unchanged. The corresponding Failure
methods are available on the `.failure` property.

**API Reference**

* [`failure`](https://github.com/danwang/lambdanwang/blob/master/docs/either.md#failure-aa--eithera-empty)
* [`success`](https://github.com/danwang/lambdanwang/blob/master/docs/either.md#success-bb--eitherempty-b)
* [`map`](https://github.com/danwang/lambdanwang/blob/master/docs/either.md#map-eithera-b--yb--y--eithera-y)
* [`flatMap`](https://github.com/danwang/lambdanwang/blob/master/docs/either.md#flatmap-eithera-b--aa-yb--eitheraa-y--eitheraa--a-y)
* [`getOrElse`](https://github.com/danwang/lambdanwang/blob/master/docs/either.md#getorelse-eithera-b--def-y--b--y)
* [`filter`](https://github.com/danwang/lambdanwang/blob/master/docs/either.md#filter-eithera-b--b--boolean--optioneithera-b)
* [`toOption`](https://github.com/danwang/lambdanwang/blob/master/docs/either.md#tooption-eithera-b----optionb)

## Obtaining Eithers

### `failure: <A>(A) => Either<A, empty>`

Creates an instance of a `Failure`.

### `success: <B>(B) => Either<empty, B>`
Creates an instance of a `Success`.

## Manipulating Eithers

The following methods transform Success values. Analogous Failure-transforming
values are available on the `.failure` property.

### `map: (Either<A, B>) => <Y>(B => Y) => Either<A, Y>`

Transforms the value of a Success. Acts as the identity function on a Failure.

* `success(t).map(f)` is `success(f(t))`
* `failure(t).map(f)` is `failure(t)`
* `success(t).failure.map(f)` is `success(t)`
* `failure(t).failure.map(f)` is `failure(f(t))`

### `flatMap: (Either<A, B>) => <AA, Y>(B => Either<AA, Y>) => Either<AA | A, Y>`

Applies a function returning an Either to the interior value of a Success. Acts
as the identity on a Failure.

* `success(t).flatMap(f)` is `f(t)`
* `failure(t).flatMap(f)` is `failure(t)`
* `success(t).failure.flatMap(f)` is `success(t)`
* `failure(t).failure.flatMap(f)` is `f(t)`

## Leaving Eithers

### `getOrElse: (Either<A, B>) => (def: Y) => B | Y`

Returns the interior value of a Success or the provided default value otherwise.

* `success(t).default(def)` is `success(t)`
* `failure(t).default(def)` is `def`
* `success(t).failure.default(def)` is `def`
* `failure(t).failure.default(def)` is `failure(t)`

### `filter: (Either<A, B>) => (B => boolean) => Option<Either<A, B>>`

Returns a `some` containing the Either if it is a Success or a `none`
otherwise.

* `success(t).filter(predicate)` is `predicate(t) ? some(success(t)) : none`
* `failure(t).filter(predicate)` is `none`
* `success(t).failure.filter(predicate)` is `none`
* `failure(t).failure.filter(predicate)` is `predicate(t) ? some(failure(t)) : none`

### `toOption: (Either<A, B>) => () => Option<B>`

Returns a `some` of the interior value if this is a Success or `none`
otherwise.

* `success(t).toOption()` is `some(t)`
* `failure(t).toOption()` is `none`
* `success(t).failure.toOption()` is `none`
* `failure(t).failure.toOption()` is `some(t)`

## Manually inspecting

Eithers can be manually unpacked.
```jsx
if (either.isSuccess) {
  // Flow knows that the either is a Success. Access the interior value with
  // either.successValue
} else {
  // Flow knows that the either is a Failure. Access the interior value with
  // either.failureValue
}
```
