import { sourceNodes } from './gatsby-node';

describe('sourceNodes', () => {
  test('creates a HelloWorld node', () => {
    const createNode = jest.fn();
    const actions = { createNode };

    sourceNodes({ actions });

    expect(createNode).toHaveBeenCalledWith({
      id: '12345',
      parent: null,
      children: [],
      internal: { type: 'HelloWorld' },
    });
  });
});
