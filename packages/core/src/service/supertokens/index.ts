import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

import { ConfigInjectionToken, AuthModuleConfig } from '../../config/auth';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init(),
        Session.init({
          jwt: {
            enable: true,
          },
          /**          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createNewSession: async function (input) {
                  const userId = input.userId;
                  const organizations =
                    await this.usersService.userOrganizations(userId);

                  // This goes in the access token, and is availble to read on the frontend.
                  input.accessTokenPayload = {
                    ...input.accessTokenPayload,
                    Organizations: organizations,
                  };

                  return originalImplementation.createNewSession(input);
                },
              };
            },
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                signUpPOST: async function (input) {
                  if (originalImplementation.signUpPOST === undefined) {
                    throw Error('Should never come here');
                  }

                  // First we call the original implementation of signUpPOST.
                  const response = await originalImplementation.signUpPOST(
                    input,
                  );

                  // Post sign up response, we check if it was successful
                  if (response.status === 'OK') {
                    const { id, email } = response.user;

                    // // These are the input form fields values that the user used while signing up
                    const formFields = input.formFields;
                    // TODO: post sign up logic - create a User Node in Neo4j
                  }
                  return response;
                },
              };
            },
          }, */
        }),
      ],
    });
  }
}
