export const isTestEnvironment = (): boolean => {
  if (typeof window !== 'undefined' && typeof window === 'object') {
      return false;
  }
  else {
      return true;
  }
};