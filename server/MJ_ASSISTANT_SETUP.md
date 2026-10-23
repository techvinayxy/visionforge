# MJ Gemini API setup

The MJ chat UI now sends recent conversation history to this backend endpoint. Gemini generates the reply; product cards remain matched from the frontend's existing local catalogue and are not live inventory data.

## Render environment variables

Configure these in the Render dashboard for the VISIONFORGE API service. Do not commit secrets to GitHub or add them to frontend `VITE_*` variables.

- `GEMINI_API_KEY`: a Gemini API key created and managed in Google AI Studio.
- `GEMINI_MODEL`: the exact model ID available to your Gemini API project (for example, choose a currently supported Flash model from the official model list).

After setting the variables, redeploy/restart the Render service.

## Endpoint

`POST /api/assistant`

Request JSON:

```json
{
  "messages": [
    { "role": "user", "text": "Help me choose a gaming PC for 1440p." },
    { "role": "assistant", "text": "What's your budget?" },
    { "role": "user", "text": "Around ₹100,000." }
  ]
}
```

The endpoint accepts up to 12 recent messages, validates roles and message lengths, and returns:

```json
{ "text": "MJ's response..." }
```

The endpoint has a basic in-memory rate limit of 10 requests per IP per minute. This is a lightweight single-process safeguard, not a shared/distributed limiter; replace it with a shared store before scaling to multiple API instances. Test the endpoint with Render environment variables configured before treating live Gemini as verified. The model is instructed not to invent live catalogue stock, prices, or specifications because catalogue data is not yet provided to it.
