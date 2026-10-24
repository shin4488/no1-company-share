import { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@f/definition/common/apiSpec/apiResponse';

export class AjaxHelper {
  // Writes without response data return `data: null` on success.
  // `post()` and `put()` also return null on failure, so this method checks for an empty `messages` array instead.
  static async submit<TRequest = unknown>(
    axios: AxiosInstance,
    method: 'post' | 'put' | 'delete',
    uri: string,
    request?: TRequest,
  ): Promise<boolean> {
    try {
      const response = await axios.request<ApiResponse<unknown>>({
        method,
        url: uri,
        data: request,
      });
      return (
        Array.isArray(response.data?.messages) &&
        response.data.messages.length === 0
      );
    } catch {
      return false;
    }
  }

  static async get<TResponse = {}, TRequest = {}>(
    axios: AxiosInstance,
    uri: string,
    request?: TRequest,
  ): Promise<TResponse | null> {
    const response: AxiosResponse<ApiResponse<TResponse> | undefined> | Error =
      await axios
        .get<ApiResponse<TResponse>>(uri, {
          params: request,
        })
        .catch((error: Error) => error);

    if (response instanceof Error) {
      return null;
    }

    const responseBody = response.data;
    if (responseBody === undefined) {
      return null;
    }

    const responseBodyData = responseBody.data;
    return responseBodyData;
  }

  static async post<TResponse = {}, TRequest = {}>(
    axios: AxiosInstance,
    uri: string,
    request?: TRequest,
  ): Promise<TResponse | null> {
    const response: AxiosResponse<ApiResponse<TResponse>> | Error = await axios
      .post(uri, request)
      .catch((error: Error) => error);

    if (response instanceof Error) {
      return null;
    }

    const responseBody = response.data;
    if (responseBody === undefined) {
      return null;
    }

    const responseBodyData = responseBody.data;
    return responseBodyData;
  }

  static async put<TResponse = {}, TRequestBody = {}, TRequestQuery = {}>(
    axios: AxiosInstance,
    uri: string,
    requestBody?: TRequestBody,
    requestQuery?: TRequestQuery,
  ): Promise<TResponse | null> {
    const response: AxiosResponse<ApiResponse<TResponse>> | Error = await axios
      .put(uri, requestBody, {
        params: requestQuery,
      })
      .catch((error: Error) => error);

    if (response instanceof Error) {
      return null;
    }

    const responseBody = response.data;
    if (responseBody === undefined) {
      return null;
    }

    const responseBodyData = responseBody.data;
    return responseBodyData;
  }
}
