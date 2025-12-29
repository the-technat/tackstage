import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  ApiRef,
  BackstageIdentityApi,
  configApiRef,
  createApiFactory,
  createApiRef,
  OpenIdConnectApi,
  oauthRequestApiRef,
  discoveryApiRef,
  ProfileInfoApi,
  SessionApi,
} from '@backstage/core-plugin-api';

import { OAuth2 } from '@backstage/core-app-api';

export const pocketidAuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'auth.pocketid',
});

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: pocketidAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      // delegate auth to the OAuth2 strategy
      OAuth2.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        provider: {
          // this value MUST be 'oidc'
          // it maps our Keycloak-branded sign-in provider onto Backstage's generic OIDC auth strategy
          id: 'pocketid',
          title: 'Pocket ID',
          icon: () => null,
        },
        environment: configApi.getOptionalString('auth.environment'),
        defaultScopes: ['openid', 'profile', 'email', 'groups'],
        popupOptions: {
          // optional, used to customize sign-in window size
          size: {
            fullscreen: true,
          },
          /**
           * or specify popup width and height
           * size: {
              width: 1000,
              height: 1000,
            }
           */
        },
      }),
  }),
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
];
