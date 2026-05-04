export const extractData = (response) => response?.data?.data ?? response?.data ?? null;

export const isMockPayload = (payload) =>
  Boolean(
    payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      typeof payload.message === 'string' &&
      Object.keys(payload).every((key) => ['message', 'success'].includes(key)),
  );

export const withFallback = async (requestFn, fallbackFn) => {
  try {
    const response = await requestFn();
    const data = extractData(response);

    if (data == null || isMockPayload(data)) {
      return fallbackFn();
    }

    return data;
  } catch (error) {
    return fallbackFn(error);
  }
};

export const buildQueryParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
