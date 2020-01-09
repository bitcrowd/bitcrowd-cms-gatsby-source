import nodeFromResource from './node-helpers';

describe('nodeFromResource', () => {
  function subject(resourceProps = {}) {
    const resource = {
      id: '123456',
      type: 'Page',
      attributes: {},
      relationships: {},
      ...resourceProps,
    };

    return nodeFromResource(resource);
  }

  test('builds Cms-prefixed Node types from resource types', () => {
    const node = subject({ type: 'Page' });
    expect(node.internal.type).toEqual('CmsPage');
  });

  test('camelizes/capitalizes the node type correctly', () => {
    const node = subject({ type: 'component/some-block' });
    expect(node.internal.type).toEqual('CmsComponentSomeBlock');
  });

  test('sets the node ID to the ID of the resource prefixed with its type', () => {
    const node = subject({ id: '123', type: 'Page' });
    expect(node.id).toEqual('Page-123');
  });

  test('expands the resource attributes as node attributes', () => {
    const node = subject({ attributes: { foo: 'bar' } });
    expect(node.foo).toEqual('bar');
  });

  test('builds node links from singular relationships', () => {
    const relationships = {
      foo: { data: { id: '123', type: 'Page' } },
    };

    const node = subject({ relationships });

    expect(node.foo___NODE).toEqual('Page-123');
  });

  test('ignores node links from empty relationships', () => {
    const relationships = {
      foo: { data: null },
    };

    const node = subject({ relationships });

    expect(node).not.toHaveProperty('foo___NODE');
  });

  test('ignores node links that are not included in the response', () => {
    const relationships = {
      foo: { meta: { included: false } },
    };

    const node = subject({ relationships });

    expect(node).not.toHaveProperty('foo___NODE');
  });

  test('builds node links from plural relationships (and keeps order)', () => {
    const relationships = {
      foo: {
        data: [
          { id: '123', type: 'Page' },
          { id: '456', type: 'Page' },
        ],
      },
    };

    const node = subject({ relationships });

    expect(node.foo___NODE).toEqual(['Page-123', 'Page-456']);
  });

  test('can deal with resources that where relationships is null/undefined', () => {
    expect(() => subject({ relationships: null })).not.toThrow();
  });
});
