/*
 * Extend node typings
 *
 * Resources:
 * https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html
 * https://dev.to/isthatcentered/typing-process-env-and-dealing-with-nodeenv-3ilm
*/
declare namespace NodeJS
{
    export interface ProcessEnv
    {
        MONGODB_URI: string;
        MONGODB_URI_PROD: string;
    }
}