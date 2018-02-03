// @flow

const mapObject = <T, U>(
  iterable: Iterable<T>,
  f: (T) => [string, U],
): {[string]: U} => {
  const result = {};
  for (const item: T of iterable) {
    const [key, value] = f(item);
    result[key] = value;
  }
  return result;
};

export default mapObject;
