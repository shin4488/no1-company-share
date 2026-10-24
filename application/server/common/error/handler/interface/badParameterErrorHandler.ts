export interface BadParameterErrorHandler {
  addMessage(...messages: string[]): BadParameterErrorHandler;
  throwIfHasError(): void;
}
