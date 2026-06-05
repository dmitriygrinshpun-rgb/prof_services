export const getOfficeToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    Office.auth.getAccessTokenAsync(
      { allowSignInPrompt: true, forMSGraphAccess: true },
      (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve(result.value);
        } else {
          reject(new Error(result.error?.message || 'SSO failed'));
        }
      }
    );
  });
};
