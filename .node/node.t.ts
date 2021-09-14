// https://github.com/microsoft/TypeScript/issues/3926
interface ErrorConstructor {
  captureStackTrace(thisArg: any, func: any): void;
}
