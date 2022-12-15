import {Configuration, V0alpha2Api} from '@ory/kratos-client';
import Config from 'react-native-config';
import axiosFactory from 'axios';
import {resilience} from './axios';

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string) => url.replace(/\/+$/, '');

const axios = axiosFactory.create();
resilience(axios); // Adds retry mechanism to axios

export const newKratosSdk = () => {
  const basePath = canonicalize(Config.ORY_SDK_URL || '');
  const cfg = new Configuration({
    basePath,
    baseOptions: {
      // Setting this is very important as axios will send the CSRF cookie otherwise
      // which causes problems with ORY Kratos' security detection.
      withCredentials: false,

      // Timeout after 5 seconds.
      timeout: 10000,
    },
  });
  return new V0alpha2Api(
    cfg,
    basePath,
    // Ensure that we are using the axios client with retry.
    axios,
  );
};
