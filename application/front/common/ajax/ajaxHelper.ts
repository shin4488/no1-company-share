import { AxiosInstance } from 'axios';
import { ApiResponse } from '@f/definition/common/apiSpec/apiResponse';

export class AjaxHelper {
  static async get<TResponse = {}, TRequest = {}>(
    axios: AxiosInstance,
    uri: string,
    request?: TRequest,
  ): Promise<TResponse | null> {
    const response = await axios.get<ApiResponse<TResponse>>(uri, {
      params: request,
    });
    const responseBody = response.data;
    const responseBodyData = responseBody.data;
    return responseBodyData;
  }
}
