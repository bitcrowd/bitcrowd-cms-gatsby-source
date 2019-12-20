exports.sourceNodes = ({ actions }) => {
  const { createNode } = actions;

  createNode({
    id: '12345',
    parent: null,
    children: [],
    internal: { type: 'HelloWorld' },
  });
};
