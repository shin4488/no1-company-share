export interface BadParameterErrorHandler {
  addMessage(...messages: string[]): BadParameterErrorHandler;
  toDistinct(): BadParameterErrorHandler;
  throwIfHasError(): void;
}
