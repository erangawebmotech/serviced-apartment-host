/// <reference types="vite/client" />

const URL_REMOTE = import.meta.env.VITE_API_URL;

// console.log(import.meta.env.MODE, "MODE");
// console.log(import.meta.env.VITE_ENV_TYPE, "VITE_ENV_TYPE");


const conf = {
  serverUrl: URL_REMOTE,
  basePath: `public`,
  redirect: URL_REMOTE,
};

export default conf;
