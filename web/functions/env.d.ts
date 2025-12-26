/// <reference types="@cloudflare/workers-types" />

interface Env {
  // Service binding to backend Worker
  API: Fetcher;
}

type PagesFunction<E = Env> = import('@cloudflare/workers-types').PagesFunction<E>;
