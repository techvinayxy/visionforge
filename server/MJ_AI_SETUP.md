# MJ Gemini AI setup

MJ's chat interface calls the backend endpoint `POST /api/assistant/chat`. The Gemini API key is only read by the server; never add it to the React app or commit it to Git.

## Configure Render

1. Open the Render dashboard and select the existing VISIONFORGE API web service (`visionforge-api`).
2. Open **Environment**.
3. Add `GEMINI_API_KEY` with an API key created in [Google AI Studio](https://aistudio.google.com/apikey).
4. Optionally add `GEMINI_MODEL` with value `gemini-3.8-flash`. This is also the code default.
5. Save the environment changes and let Render redeploy/restart the service.

Do not paste the key into chat, source code, a `VITE_*` variable, or a committed `.env` file. Keep it in the server's private environment settings only.

## Behaviour and safeguards

- MJ receives a capped recent conversation history and the catalogue's IDs, names, categories and listed prices.
- The server validates the response and only returns recommended IDs that were included in that request's catalogue.
- The route has a basic in-memory limit of 12 chat requests per IP per minute. It resets when the service restarts and is not a substitute for a distributed limiter if the service scales to multiple instances.
- If `GEMINI_API_KEY` is missing, the endpoint returns a configuration message and the chat UI keeps its local catalogue fallback.

## Privacy and billing

Gemini API free-tier availability, quotas, pricing and data-use terms can change. Google's current pricing page distinguishes free and paid tiers; it states that free-tier content may be used to improve Google products, while paid-tier content is not used for that purpose. Review the current [Gemini API pricing and data-use notes](https://ai.google.dev/gemini-api/docs/pricing) before production use. Don't invite customers to submit passwords, payment card details or other sensitive information in MJ chat.
