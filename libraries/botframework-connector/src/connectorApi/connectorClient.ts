/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as Models from "botframework-schema";
import * as msRest from "ms-rest-js";
import { ConnectorClientContext } from "./connectorClientContext";
import * as Mappers from "./models/mappers";
import * as operations from "./operations";

class ConnectorClient extends ConnectorClientContext {
  // Operation groups
  attachments: operations.Attachments;
  conversations: operations.Conversations;

  /**
   * @class
   * Initializes a new instance of the ConnectorClient class.
   * @constructor
   *
   * @param {string} [baseUri] - The base URI of the service.
   *
   * @param {object} [options] - The parameter options
   *
   * @param {Array} [options.filters] - Filters to be added to the request pipeline
   *
   * @param {object} [options.requestOptions] - The request options. Detailed info can be found at
   * {@link https://github.github.io/fetch/#Request Options doc}
   *
   * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
   *
   */
  constructor(credentials: msRest.ServiceClientCredentials, baseUri?: string, options?: msRest.ServiceClientOptions) {
    super(credentials, baseUri, options);
    this.attachments = new operations.Attachments(this);
    this.conversations = new operations.Conversations(this);
  }
}

// Operation Specifications

export { ConnectorClient, Models as ConnectorModels, Mappers as ConnectorMappers };
