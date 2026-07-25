/* Minimal ambient declarations for the bindings used by this starter. */

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

// The full runtime shape is supplied by Cloudflare in production.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D1Database = any;

declare module "cloudflare:workers" {
  const env: {
    DB?: D1Database;
  };

  export { env };
}
