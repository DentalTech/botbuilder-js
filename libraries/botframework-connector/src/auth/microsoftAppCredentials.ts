/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as msrest from 'ms-rest-js';
// import * as request from 'request';
import * as url from 'url';
import { Constants } from './constants';

const fetch = (new Function('const env = (global || window); return "fetch" in env ? env.fetch : require("node-fetch");'))();
const FormData = (new Function('const env = (global || window); return "FormData" in env ? env.FormData : require("form-data");'))();

/**
 * MicrosoftAppCredentials auth implementation and cache
 */
export class MicrosoftAppCredentials implements msrest.ServiceClientCredentials {

    private static readonly trustedHostNames: Map<string, Date> = new Map<string, Date>([
        ['state.botframework.com', new Date(8640000000000000)],              // Date.MAX_VALUE,
        ['api.botframework.com', new Date(8640000000000000)],                // Date.MAX_VALUE,
        ['token.botframework.com', new Date(8640000000000000)],              // Date.MAX_VALUE,
        ['state.botframework.azure.us', new Date(8640000000000000)],         // Date.MAX_VALUE,
        ['api.botframework.azure.us', new Date(8640000000000000)],           // Date.MAX_VALUE,
        ['token.botframework.azure.us', new Date(8640000000000000)],         // Date.MAX_VALUE,
    ]);

    private static readonly cache: Map<string, OAuthResponse> = new Map<string, OAuthResponse>();

    public appPassword: string;
    public appId: string;

    public oAuthEndpoint: string = Constants.ToChannelFromBotLoginUrl;
    public oAuthScope: string = Constants.ToChannelFromBotOAuthScope;
    public readonly tokenCacheKey: string;
    private refreshingToken: Promise<Response> | null = null;

    constructor(appId: string, appPassword: string) {
        this.appId = appId;
        this.appPassword = appPassword;
        this.tokenCacheKey = `${appId}-cache`;
    }

    /**
     * Adds the host of service url to trusted hosts.
     * If expiration time is not provided, the expiration date will be current (utc) date + 1 day.
     * @param  {string} serviceUrl The service url
     * @param  {Date} expiration? The expiration date after which this service url is not trusted anymore
     */
    public static trustServiceUrl(serviceUrl: string, expiration?: Date): void {
        if (!expiration) {
            expiration = new Date(Date.now() + 86400000);  // 1 day
        }

        const uri: url.Url = url.parse(serviceUrl);
        if (uri.host) {
            MicrosoftAppCredentials.trustedHostNames.set(uri.host, expiration);
        }
    }

    /**
     * Checks if the service url is for a trusted host or not.
     * @param  {string} serviceUrl The service url
     * @returns {boolean} True if the host of the service url is trusted; False otherwise.
     */
    public static isTrustedServiceUrl(serviceUrl: string): boolean {
        try {
            const uri: url.Url = url.parse(serviceUrl);
            if (uri.host) {
                return MicrosoftAppCredentials.isTrustedUrl(uri.host);
            }
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error('Error in isTrustedServiceUrl', e);
        }

        return false;
    }

    private static isTrustedUrl(uri: string): boolean {
        const expiration: Date = MicrosoftAppCredentials.trustedHostNames.get(uri);
        if (expiration) {
            // check if the trusted service url is still valid
            return expiration.getTime() > (Date.now() - 300000); // 5 Minutes
        }

        return false;
    }

    public async signRequest(webResource: msrest.WebResource): Promise<msrest.WebResource> {
        if (this.shouldSetToken(webResource)) {
            const token: string = await this.getToken();

            return new msrest.TokenCredentials(token).signRequest(webResource);
        }

        return webResource;
    }

    public async getToken(forceRefresh: boolean = false): Promise<string> {
        if (!forceRefresh) {
            // check the global cache for the token. If we have it, and it's valid, we're done.
            const oAuthToken: OAuthResponse = MicrosoftAppCredentials.cache.get(this.tokenCacheKey);
            if (oAuthToken) {
                // we have the token. Is it valid?
                if (oAuthToken.expiration_time > new Date(Date.now())) {
                    return oAuthToken.access_token;
                }
            }
        }

        // We need to refresh the token, because:
        // 1. The user requested it via the forceRefresh parameter
        // 2. We have it, but it's expired
        // 3. We don't have it in the cache.
        const res: Response = await this.refreshToken();

        let oauthResponse: OAuthResponse;
        if (res.ok) {
            oauthResponse = await res.json();
            // Subtract 5 minutes from expires_in so they'll we'll get a
            // new token before it expires.
            oauthResponse.expiration_time = new Date(Date.now() + (oauthResponse.expires_in * 1000) - 300000);
        } else {
            this.refreshingToken = null;
            throw new Error(res.statusText);
        }

        MicrosoftAppCredentials.cache.set(this.tokenCacheKey, oauthResponse);
        this.refreshingToken = null;
        return oauthResponse.access_token;
    }

    private async refreshToken(): Promise<Response> {
        if (!this.refreshingToken) {
            const params = new FormData();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', this.appId);
            params.append('client_secret', this.appPassword);
            params.append('scope', this.oAuthScope);

            this.refreshingToken = fetch(this.oAuthEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded",
                },
                body: params
            });
        }
        return this.refreshingToken;
    }

    private shouldSetToken(webResource: msrest.WebResource): boolean {
        return MicrosoftAppCredentials.isTrustedServiceUrl(webResource.url);
    }
}

/**
 * Member variables to this class follow the RFC Naming conventions, rather than C# naming conventions.
 */
interface OAuthResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
    expiration_time: Date;
}
