const capitalize = word => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;

const camelize = (text, separator) =>
  text
    .split(separator)
    .map(w => capitalize(w))
    .join('');

const camelizeResourceType = resourceType =>
  capitalize(camelize(camelize(resourceType, '-'), '/'));

const nodeType = resourceType => `Cms${camelizeResourceType(resourceType)}`;

export default nodeType;
