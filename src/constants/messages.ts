export const minLengthMsg = (fieldName: string, minLength: number) =>
  `${fieldName} must be atleast ${minLength} long`;
export const maxLengthMsg = (fieldName: string, maxLength: number) =>
  `${fieldName} can't excced length ${maxLength}`;
export const notSelectedMsg = (fieldName: string) => `Select ${fieldName}`;
export const invalidMsg = (fieldName: string) => `Enter a valid ${fieldName}`;
export const emptyMsg = (fieldName: string) => `Please enter ${fieldName}`;
export const ExccedFileSizeLimit = (fieldName: string, size: number) =>
  `${fieldName} should be less than ${size}Mb`;
export const InvalidType = (validTypes: string[]) =>
  `Only the following types are allowed: ${validTypes}`;
