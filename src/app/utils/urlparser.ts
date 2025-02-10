export const parseCodeValue = (paramString: string): string | null => {
  // implement custom parse as useSearchParams is trimming on &
  // code must be the last param
  const codeStart = paramString?.indexOf("code=");
  if (!codeStart || codeStart == -1) {
    return null;
  }
  const codeParam = paramString.slice(codeStart + 5);
  if (!codeParam) {
    return null;
  }
  return decodeURI(codeParam);
};
