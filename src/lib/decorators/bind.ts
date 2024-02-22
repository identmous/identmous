export default function bind(
  _target: object,
  _key: string,
  descriptor: PropertyDescriptor,
) {
  const f = descriptor.value;

  return {
    configurable: true,

    get() {
      const bound = f.bind(this);
      return bound;
    },
  };
}
