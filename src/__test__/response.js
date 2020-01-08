const response = (payload, status) => ({
  ok: status >= 200 && status < 300,
  status: status || 200,
  json: () => payload,
});

export default response;
