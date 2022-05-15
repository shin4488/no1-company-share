import { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@f/definition/common/apiSpec/apiResponse';

export class AjaxHelper {
  static async get<TResponse = {}, TRequest = {}>(
    axios: AxiosInstance,
    uri: string,
    request?: TRequest,
  ): Promise<TResponse | null> {
    const response: AxiosResponse<ApiResponse<TResponse> | undefined> =
      await axios
        .get<ApiResponse<TResponse>>(uri, {
          params: request,
        })
        .catch((error) => error);

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
    const response: AxiosResponse<ApiResponse<TResponse>> = await axios
      .post(uri, request)
      .catch((error) => error);

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
    const response: AxiosResponse<ApiResponse<TResponse>> = await axios
      .put(uri, requestBody, {
        params: requestQuery,
      })
      .catch((error) => error);

    const responseBody = response.data;
    if (responseBody === undefined) {
      return null;
    }

    const responseBodyData = responseBody.data;
    return responseBodyData;
  }

  static async delete<TResponse = {}, TRequest = {}>(
    axios: AxiosInstance,
    uri: string,
    request?: TRequest,
  ): Promise<TResponse | null> {
    const response: AxiosResponse<ApiResponse<TResponse>> = await axios
      .delete(uri, {
        data: request,
      })
      .catch((error) => error);

    const responseBody = response.data;
    if (responseBody === undefined) {
      return null;
    }

    const responseBodyData = responseBody.data;
    return responseBodyData;
  }
}
