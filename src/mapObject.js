// @flow

const mapObject = <T, U>(array: Array<T>, f: (T) => [string, U]): {[string]: U} => {
  const result = {};
  array.forEach((item: T) => {
    const [key, value] = f(item);
    result[key] = value;
  });
  return result;
};

export default mapObject;
