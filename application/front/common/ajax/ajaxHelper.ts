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
}
