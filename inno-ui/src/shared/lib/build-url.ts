type BuildUrlOptions = {
  path?: string;
  query?: URLSearchParams;
};

export function buildUrl(base: string, options?: BuildUrlOptions): string {
  const trimmedBase = base.replace(/\/+$/, '');
  const path = options?.path
    ?.split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  const withPath =
    path === undefined || path.length === 0
      ? trimmedBase
      : `${trimmedBase}/${path}`;
  const query = options?.query?.toString() ?? '';
  return query.length === 0 ? withPath : `${withPath}?${query}`;
}
