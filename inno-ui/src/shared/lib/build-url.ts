type BuildUrlOptions = {
  path?: string;
  query?: URLSearchParams;
};

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment).replaceAll('.', '%2E');
}

export function buildUrl(base: string, options?: BuildUrlOptions): string {
  const trimmedBase = base.replace(/\/+$/, '');
  const path = options?.path;
  const withPath =
    path === undefined || path.length === 0
      ? trimmedBase
      : `${trimmedBase}/${encodePathSegment(path)}`;
  const query = options?.query?.toString() ?? '';
  return query.length === 0 ? withPath : `${withPath}?${query}`;
}
