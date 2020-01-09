const capitalize = word => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;

const camelize = (text, separator) =>
  text
    .split(separator)
    .map(w => capitalize(w))
    .join('');

const camelizeResourceType = resourceType =>
  capitalize(camelize(camelize(resourceType, '-'), '/'));

const nodeType = resource => `Cms${camelizeResourceType(resource.type)}`;

const nodeId = resource => `${resource.type}-${resource.id}`;

const nodeFromResource = resource => {
  const relationships = {};
  Object.entries(resource.relationships || {})
    .filter(arr => 'data' in arr[1] && arr[1].data !== null)
    .forEach(([key, { data }]) => {
      const relKey = `${key}___NODE`;

      if (data instanceof Array) {
        relationships[relKey] = data.map(nodeId);
      } else {
        relationships[relKey] = nodeId(data);
      }
    });

  const node = {
    id: nodeId(resource),
    parent: null,
    children: [],
    ...resource.attributes,
    ...relationships,
  };

  const internal = {
    type: nodeType(resource),
  };

  return { ...node, internal };
};

export default nodeFromResource;
