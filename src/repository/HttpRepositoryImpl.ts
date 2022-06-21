import {request, RequestOptions} from 'https';
// import {IHttpRepository} from './interface/IHttpRepository';
/**
 * Consumo de servicios https
 */
export class HttpRepositoryImpl {
  /**
   *
   * @param {string} options
   * @param {string} bodyQueryString
   * @return {any}
   */
  async callService(options: RequestOptions, bodyQueryString: string|null): Promise<Record<string, unknown>> {
    let content = '';
    return new Promise((resolve, reject) => {
      const requestB2b = request(options, function(response) {
        response.on('error', reject);
        response.on('data', (data) => {
          content += data;
        });
        response.on('end', () => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            resolve(JSON.parse(content));
          } else {
            const httpResponse = {statusCode: response.statusCode};
            try {
              reject(Object.assign(httpResponse, JSON.parse(content)));
            } catch (e) {
              reject(Object.assign(httpResponse, {message: content}));
            }
          }
        });
      });
      if (options.method !== 'GET') {
        requestB2b.write(bodyQueryString);
      }
      requestB2b.end();
    });
  }
}
