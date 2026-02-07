/**
 * Déclaration locale du namespace JSX pour que le projet compile
 * même sans node_modules (@types/react). Une fois npm install fait,
 * les types complets de @types/react seront utilisés.
 */
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: Record<string, unknown>;
  }
}
