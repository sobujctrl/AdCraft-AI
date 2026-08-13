declare module 'serverless-http' {
  import { RequestHandler } from 'express';
  const serverless: (app: RequestHandler) => any;
  export default serverless;
}
