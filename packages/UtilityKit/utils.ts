export const isEven = (x: number): boolean => {
  if (x % 2 === 0) {
    return true;
  } else {
    return false;
  }
}

export const isOdd = (x: number): boolean => {
  if (x % 2 !== 0) {
    return true;
  } else {
    return false;
  }
}
