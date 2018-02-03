// @flow
type FN<A, B> = (A) => B;
type Compose0 = (void) => <T>(T) => T;
type Compose1 = <A, B>(FN<A, B>, void) => FN<A, B>;
type Compose2 = <A, B, C>(FN<B, C>, FN<A, B>, void) => FN<A, C>;
type Compose3 = <A, B, C, D>(FN<C, D>, FN<B, C>, FN<A, B>, void) => FN<A, D>;
type Compose4 = <A, B, C, D, E>(
  FN<D, E>,
  FN<C, D>,
  FN<B, C>,
  FN<A, B>,
  void,
) => FN<A, E>;
type Compose5 = <A, B, C, D, E, F>(
  FN<E, F>,
  FN<D, E>,
  FN<C, D>,
  FN<B, C>,
  FN<A, B>,
  void,
) => FN<A, F>;
type Compose6 = <A, B, C, D, E, F, G>(
  FN<F, G>,
  FN<E, F>,
  FN<D, E>,
  FN<C, D>,
  FN<B, C>,
  FN<A, B>,
  void,
) => FN<A, G>;
type ComposeN = <T>(...fns: Array<FN<T, T>>) => FN<T, T>;

type Compose = Compose0 &
  Compose1 &
  Compose2 &
  Compose3 &
  Compose4 &
  Compose5 &
  Compose6 &
  ComposeN;

const compose: Compose = ((...fns) => {
  if (fns.length === 0) {
    return (arg) => arg;
  } else {
    const last = fns[fns.length - 1];
    const rest = fns.slice(0, -1);
    return (...args) =>
      rest.reduceRight((composed, f) => f(composed), last(...args));
  }
}: any);

export default compose;
