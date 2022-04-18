import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

import { ConfigInjectionToken, AuthModuleConfig } from '../../config/auth';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig,
							@InjectQueue('person') private readonly personQueue: Queue) {

    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init({
					/** 
					override: {
						apis: (originalImplementation) => {
								return {
										...originalImplementation,
										signUpPOST: async function (input) {

												if (originalImplementation.signUpPOST === undefined) {
														throw Error("Should never come here");
												}

												// First we call the original implementation of signUpPOST.
												let response = await originalImplementation.signUpPOST(input);

												// Post sign up response, we check if it was successful
												if (response.status === "OK") {
														let { id, email } = response.user;

														// These are the input form fields values that the user used while signing up
														// let formFields = input.formFields;
														
														let properties = {
																userId: id,
																name: "",
																email: email,
																defaultLanguage: "en"
														};

														this.personQueue.add('signup', {
															formFields: {
																properties,
															}
														});
														

												}
												return response;
										}
								}
						}
					}, */

				}),
        Session.init({
          jwt: {
            enable: true,
          },
					
          /** override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createNewSession: async function (input) {
                  const userId = input.userId;
                  const organization = await this.personService.organization(userId);

                  // This goes in the access token, and is availble to read on the frontend.
                  input.accessTokenPayload = {
                    ...input.accessTokenPayload,
                    organization: organization,
                  };

                  return originalImplementation.createNewSession(input);
                },
              };
            },
						 */
        }),
      ],
    });
  }

}
