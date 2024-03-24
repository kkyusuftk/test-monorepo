export const isWindowDefined = (): boolean => {
  if (typeof window !== 'undefined' && typeof window === 'object') {
      return true;
  }
  else {
      return false;
  }
};
