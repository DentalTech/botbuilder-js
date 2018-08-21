/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "ms-rest-js";


/**
 * @interface
 * An interface representing TokenResponse.
 */
export interface TokenResponse {
  /**
   * @member {string} [connectionName]
   */
  connectionName?: string;
  /**
   * @member {string} [token]
   */
  token?: string;
  /**
   * @member {string} [expiration]
   */
  expiration?: string;
}

/**
 * @interface
 * An interface representing InnerHttpError.
 */
export interface InnerHttpError {
  /**
   * @member {number} [statusCode]
   */
  statusCode?: number;
  /**
   * @member {any} [body]
   */
  body?: any;
}

/**
 * @interface
 * An interface representing ErrorModel.
 */
export interface ErrorModel {
  /**
   * @member {string} [code]
   */
  code?: string;
  /**
   * @member {string} [message]
   */
  message?: string;
  /**
   * @member {InnerHttpError} [innerHttpError]
   */
  innerHttpError?: InnerHttpError;
}

/**
 * @interface
 * An interface representing ErrorResponse.
 */
export interface ErrorResponse {
  /**
   * @member {ErrorModel} [error]
   */
  error?: ErrorModel;
}

/**
 * @interface
 * An interface representing BotSignInGetSignInUrlOptionalParams.
 * Optional Parameters.
 *
 * @extends RequestOptionsBase
 */
export interface BotSignInGetSignInUrlOptionalParams extends msRest.RequestOptionsBase {
  /**
   * @member {string} [codeChallenge]
   */
  codeChallenge?: string;
  /**
   * @member {string} [emulatorUrl]
   */
  emulatorUrl?: string;
}

/**
 * @interface
 * An interface representing UserTokenGetTokenOptionalParams.
 * Optional Parameters.
 *
 * @extends RequestOptionsBase
 */
export interface UserTokenGetTokenOptionalParams extends msRest.RequestOptionsBase {
  /**
   * @member {string} [code]
   */
  code?: string;
}
