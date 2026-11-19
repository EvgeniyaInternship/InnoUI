export type EmptySuccess = {
  success: true;
};

export type HttpResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  message: string;
};

type HttpOptions = {
  fallbackMessage?: string;
  networkMessage?: string;
  credentials?: RequestCredentials;
};

type ProblemBody = {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

const defaultFallbackMessage = 'Request failed.';
const defaultNetworkMessage = 'Could not reach the service.';

export const httpClient = {
  get<T>(url: string, options?: HttpOptions): Promise<HttpResult<T>> {
    return send<T>('GET', url, undefined, options);
  },
  post<T>(
    url: string,
    body?: unknown,
    options?: HttpOptions,
  ): Promise<HttpResult<T>> {
    return send<T>('POST', url, body, options);
  },
  put<T>(
    url: string,
    body?: unknown,
    options?: HttpOptions,
  ): Promise<HttpResult<T>> {
    return send<T>('PUT', url, body, options);
  },
  delete(
    url: string,
    options?: HttpOptions,
  ): Promise<HttpResult<EmptySuccess>> {
    return send<EmptySuccess>('DELETE', url, undefined, options);
  },
};

async function send<T>(
  method: string,
  url: string,
  body: unknown,
  options?: HttpOptions,
): Promise<HttpResult<T>> {
  const headers = new Headers({ Accept: 'application/json' });
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  try {
    const response = await fetch(url, {
      method,
      credentials: options?.credentials ?? 'include',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return await readResponse<T>(
      response,
      options?.fallbackMessage ?? defaultFallbackMessage,
    );
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      message: options?.networkMessage ?? defaultNetworkMessage,
    };
  }
}

async function readResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<HttpResult<T>> {
  const text = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data: null,
      message: readProblemMessage(text, fallbackMessage),
    };
  }
  if (response.status === 204 || text.trim().length === 0) {
    return {
      ok: true,
      status: response.status,
      data: { success: true } as T,
      message: '',
    };
  }
  try {
    return {
      ok: true,
      status: response.status,
      data: JSON.parse(text) as T,
      message: '',
    };
  } catch {
    return {
      ok: false,
      status: response.status,
      data: null,
      message: fallbackMessage,
    };
  }
}

function readProblemMessage(text: string, fallbackMessage: string): string {
  try {
    const body = JSON.parse(text) as ProblemBody;
    if (typeof body.detail === 'string' && body.detail.length > 0) {
      return body.detail;
    }
    const firstError = body.errors
      ? Object.values(body.errors)
          .flat()
          .find((message) => message.length > 0)
      : undefined;
    if (firstError !== undefined) {
      return firstError;
    }
    if (typeof body.title === 'string' && body.title.length > 0) {
      return body.title;
    }
  } catch {
    return fallbackMessage;
  }
  return fallbackMessage;
}
