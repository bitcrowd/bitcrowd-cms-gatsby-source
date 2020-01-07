import fetch from 'node-fetch';

export const fetchSlugs = async ({ endpoint, locale }) => {
  const pagesIndexUrl = `${endpoint}/api/v1/pages/${locale}`;
  const response = await fetch(pagesIndexUrl);
  const { data } = await response.json();
  return data.map(({ attributes: { slug } }) => slug);
};

export const fetchPage = async ({ endpoint, locale }, slug) => {
  const pageUrl = `${endpoint}/api/v1/pages/${locale}/${slug}`;
  const response = await fetch(pageUrl);
  const data = await response.json();
  return data;
};
