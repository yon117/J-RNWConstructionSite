export function isGoogleReconnectRequiredError(err) {
  const message = String(err?.message || '');
  const data = err?.response?.data;
  // data.error can be a string ("invalid_grant") or an object ({code,message,status})
  const apiError = typeof data?.error === 'string'
    ? data.error
    : String(data?.error?.message || '');
  const apiDescription = String(data?.error_description || '');

  return (
    /invalid_grant/i.test(message) ||
    /invalid_grant/i.test(apiError) ||
    /expired or revoked/i.test(apiDescription) ||
    /expired or revoked/i.test(message)
  );
}
