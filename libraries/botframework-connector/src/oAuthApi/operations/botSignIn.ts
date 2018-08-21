/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "ms-rest-js";
import * as Models from "../models";
import * as Mappers from "../models/botSignInMappers";
import * as Parameters from "../models/parameters";
import { OAuthApiClientContext } from "../oAuthApiClientContext";

/** Class representing a BotSignIn. */
export class BotSignIn {
  private readonly client: OAuthApiClientContext;

  /**
   * Create a BotSignIn.
   * @param {OAuthApiClientContext} client Reference to the service client.
   */
  constructor(client: OAuthApiClientContext) {
    this.client = client;
  }

  /**
   * @param {string} state
   *
   * @param {BotSignInGetSignInUrlOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  getSignInUrlWithHttpOperationResponse(state: string, options?: Models.BotSignInGetSignInUrlOptionalParams): Promise<msRest.HttpOperationResponse<string>> {
    return this.client.sendOperationRequest(
      {
        state,
        options
      },
      getSignInUrlOperationSpec);
  }

  /**
   * @param {string} state
   *
   * @param {BotSignInGetSignInUrlOptionalParams} [options] Optional Parameters.
   *
   * @param {ServiceCallback} callback The callback.
   *
   * @returns {ServiceCallback} callback(err, result, request, operationRes)
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *                      {string} [result]   - The deserialized result object if an error did not occur.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *                      {HttpOperationResponse} [response] - The HTTP Response stream if an error did not occur.
   */
  getSignInUrl(state: string): Promise<string>;
  getSignInUrl(state: string, options: Models.BotSignInGetSignInUrlOptionalParams): Promise<string>;
  getSignInUrl(state: string, callback: msRest.ServiceCallback<string>): void;
  getSignInUrl(state: string, options: Models.BotSignInGetSignInUrlOptionalParams, callback: msRest.ServiceCallback<string>): void;
  getSignInUrl(state: string, options?: Models.BotSignInGetSignInUrlOptionalParams, callback?: msRest.ServiceCallback<string>): any {
    return msRest.responseToBody(this.getSignInUrlWithHttpOperationResponse.bind(this), state, options, callback);
  }

}

// Operation Specifications
const serializer = new msRest.Serializer(Mappers);
const getSignInUrlOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "api/botsignin/GetSignInUrl",
  queryParameters: [
    Parameters.state,
    Parameters.codeChallenge,
    Parameters.emulatorUrl
  ],
  responses: {
    200: {
      bodyMapper: {
        serializedName: "parsedResponse",
        type: {
          name: "String"
        }
      }
    },
    default: {}
  },
  serializer
};
