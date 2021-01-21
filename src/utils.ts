export const isNotFalsy = <T>(
  obj: T | null | undefined | false | "" | 0,
): obj is T => !!obj;
