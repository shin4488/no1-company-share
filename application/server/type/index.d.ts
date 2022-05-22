import 'express';

declare module 'express' {
  export interface Response {
    locals: {
      firebaseUserId?: string;
    };
  }
}
