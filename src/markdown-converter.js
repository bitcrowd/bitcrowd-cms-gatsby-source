import Markdown from 'markdown-it';

const converter = new Markdown('zero', {
  breaks: true,
  typographer: true,
});

converter
  .enable('backticks')
  .enable('emphasis')
  .enable('link')
  .enable('list')
  .enable('smartquotes');

export default converter;
