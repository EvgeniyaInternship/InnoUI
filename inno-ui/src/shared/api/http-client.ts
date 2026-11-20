export type EmptySuccess = {
  success: true;
};

export type HttpResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  message: string;
};

export type JsonParser<T> = (value: unknown) => T | null;

type HttpOptions<T> = {
  fallbackMessage?: string;
  networkMessage?: string;
  credentials?: RequestCredentials;
  parse?: JsonParser<T>;
};

type ProblemBody = {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

const defaultFallbackMessage = 'Request failed.';
const defaultNetworkMessage = 'Could not reach the service.';

export const httpClient = {
  get<TResponse>(
    url: string,
    options: HttpOptions<TResponse> & { parse: JsonParser<TResponse> },
  ): Promise<HttpResult<TResponse>> {
    return send('GET', url, undefined, options);
  },
  post<TResponse = EmptySuccess, TRequest extends object = object>(
    url: string,
    body: TRequest,
    options?: HttpOptions<TResponse>,
  ): Promise<HttpResult<TResponse>> {
    return send('POST', url, body, options);
  },
  put<TResponse = EmptySuccess, TRequest extends object = object>(
    url: string,
    body: TRequest,
    options?: HttpOptions<TResponse>,
  ): Promise<HttpResult<TResponse>> {
    return send('PUT', url, body, options);
  },
  delete(
    url: string,
    options?: HttpOptions<EmptySuccess>,
  ): Promise<HttpResult<EmptySuccess>> {
    return send<EmptySuccess>('DELETE', url, undefined, options);
  },
};

async function send<T>(
  method: string,
  url: string,
  body: object | undefined,
  options?: HttpOptions<T>,
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
      options?.parse,
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
  parse?: JsonParser<T>,
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
    if (parse !== undefined) {
      return {
        ok: false,
        status: response.status,
        data: null,
        message: fallbackMessage,
      };
    }
    return {
      ok: true,
      status: response.status,
      data: { success: true } as T,
      message: '',
    };
  }
  try {
    const body: unknown = JSON.parse(text);
    if (parse === undefined) {
      return {
        ok: false,
        status: response.status,
        data: null,
        message: fallbackMessage,
      };
    }
    const data = parse(body);
    if (data === null) {
      return {
        ok: false,
        status: response.status,
        data: null,
        message: fallbackMessage,
      };
    }
    return {
      ok: true,
      status: response.status,
      data,
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
