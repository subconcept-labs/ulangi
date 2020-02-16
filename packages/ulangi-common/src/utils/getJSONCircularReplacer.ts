export function getJSONCircularReplacer(): (key: any, value: any) => any {
  const seen = new WeakSet();

  return (_, value): any => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}
