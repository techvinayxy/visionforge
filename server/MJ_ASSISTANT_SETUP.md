# MJ Gemini API setup

This backend endpoint is the first step toward connecting the VISIONFORGE MJ chat UI to Gemini. It does not change the existing frontend yet.

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

This endpoint is not yet connected to the MJ frontend. That is a separate follow-up change. Before launch, add rate limiting and test the endpoint with the Render environment variables configured. The model is instructed not to invent live catalogue stock, prices, or specifications because catalogue data is not yet provided to it.
