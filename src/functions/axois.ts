import axios, { AxiosError, AxiosRequestConfig } from "axios";

export class ApiRequestHandler {
  private apikey: string;
  constructor(apikey: string) {
    this.apikey = apikey;
  }

  async axiosRequest(
    config: AxiosRequestConfig,
    errorSet?: Array<{ code: number; message: string }>,
    ignoredErrors?: Array<string>,
  ): Promise<any> {
    config.headers = config.headers ? config.headers : {};
    config.headers["Authorization"] = this.apikey;
    return await axios
      .request(config)
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        const error = e as AxiosError;
        const msg = errorSet?.find((e) => e.code === error.response?.status);
        if (msg) {
          throw new Error(msg.message);
        } else {
          if (error.response?.data) {
            const msg = error.response?.data as {
              errors: Array<{ code: string; status: string; detail: string }>;
            };
            if (ignoredErrors) {
              for (const ignoredError of ignoredErrors) {
                if (msg.errors.some((e) => e.code === ignoredError)) {
                  return null;
                }
              }
            }
            msg.errors.forEach((err, i) => {
              if (msg.errors.length - 1 == i) {
                throw new Error(err.code + ": " + err.detail);
              } else {
                console.error(err.code + ": " + err.detail);
              }
            });
          } else {
            throw new Error(
              error.response?.status + " - " + error.response?.statusText ||
                "An error occurred while communicating with the API",
            );
          }
          console.error(error.response?.data);
        }
      });
  }
}
