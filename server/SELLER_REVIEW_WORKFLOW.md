# Seller application review workflow

This repository intentionally has no public admin panel. Seller applications are stored with `status: "pending"`; seller login and the seller session endpoint allow access only when the stored status is `"approved"`.

## One-time Render setup

1. Open the Render service environment settings for `visionforge-api`.
2. Add `SELLER_REVIEW_SECRET` with a long, randomly generated secret (at least 32 characters).
3. Save the environment change and wait for the service to restart.
4. Keep the secret only in Render and the trusted operator's password manager or secure terminal environment. Never put it in React/Vite variables, browser code, a public issue, or this repository.

If the secret is missing or shorter than 32 characters, the review endpoints fail closed with HTTP 503.

## Trusted operator API

Set the following in a trusted shell, replacing the placeholder with the actual secret. Do not run these commands from a public browser or frontend.

```bash
export API_BASE_URL="https://visionforge-api-wu2u.onrender.com"
read -s -p "Seller review secret: " SELLER_REVIEW_SECRET
echo
export SELLER_REVIEW_SECRET
```

List pending applications:

```bash
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer ${SELLER_REVIEW_SECRET}" \
  "${API_BASE_URL}/api/sellers/review/pending"
```

Approve an application by its `_id` returned in the pending list:

```bash
curl --fail-with-body --silent --show-error -X PATCH \
  -H "Authorization: Bearer ${SELLER_REVIEW_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}' \
  "${API_BASE_URL}/api/sellers/review/REPLACE_WITH_APPLICATION_ID"
```

Reject an application by using `{"status":"rejected"}` instead.

Only pending applications can be reviewed. A completed decision records `reviewedAt`; a later request cannot overwrite that decision through this endpoint. The API does not return password hashes. Approved sellers can sign in at `/seller/login`; pending or rejected sellers cannot access the seller dashboard.

## Responses and safety

- Missing authorization: HTTP 401.
- Wrong secret: HTTP 403.
- Review secret not configured: HTTP 503.
- Invalid ID or status: HTTP 400.
- Application already reviewed: HTTP 409.
- No application found: HTTP 404.

The shared review secret is a small operational control for a private operator workflow, not a substitute for an audited multi-user admin system. If the marketplace later needs multiple staff reviewers, roles, or an admin UI, replace this mechanism with proper admin authentication and audit logging.
