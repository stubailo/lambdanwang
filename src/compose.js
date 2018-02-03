// @flow

const compose: $Compose = ((...fns) => {
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
