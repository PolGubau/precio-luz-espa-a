export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!configuredUrl) {
    return undefined;
  }

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return undefined;
  }
}