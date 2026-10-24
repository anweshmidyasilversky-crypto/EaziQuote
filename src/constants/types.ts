export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
];

export const ALLOWED_ATTACHMENT_TYPES = ["application/pdf"].concat(
  ALLOWED_IMAGE_TYPES,
);
