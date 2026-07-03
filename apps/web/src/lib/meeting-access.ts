/**
 * DEPRECATED / MOVED.
 *
 * LiveKit access-token generation is a SERVER-side concern and now lives in
 * the API app (`apps/api`). It must never run in the browser bundle, because
 * it requires the LiveKit API secret.
 *
 * The previous version of this file hardcoded LiveKit credentials in client
 * source — those have been removed. The frontend obtains a short-lived join
 * token from the backend join endpoint instead
 * (e.g. `GET /onetoone/sessions/:id/join`).
 *
 * This stub is intentionally empty and unused.
 */

export {};
