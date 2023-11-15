# What is it?

This is a proof of concept for shorter, more friendly environment-specific URLs to internal apps with neccessarily long and complex urls (possibly with query string information).

The short URLs themselves use a [Cloudflare Worker](https://developers.cloudflare.com/workers/) to look up a given URL path (eg `/apps/prod/example`) and then redirect to the underlying app itself.

> NOTE: Currently using a hard-coded path prefix of `/apps/` for both routes and KV keys, so the key name requires _only_ the env and app name (eg `prod/example`)

The translation here is done by way of [Cloudflare's KV store](https://developers.cloudflare.com/workers/learning/how-kv-works/), where the short URL paths are stored as keys and the longer app urls as values.

## Wrangler CLI

For ease of setup, maintenance and deployment, we are using [Cloudflare's Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).

> Note: Direct use of this CLI requires an active Cloudflare account and either a member login or an API token.

We will maintain as much of this configuration as possible within the `wrangler.toml` file, with any secrets or sensitive values stored in Github Secrets.

## Deploying changes

Using [Github Actions](https://docs.github.com/en/actions), any changes to the worker or url mappings will be deployed automatically upon push to the `main` branch...

### Updating the worker

Changes to the worker script (`index.js`), the configuration (`wrangler.toml`), or the action itself (`.github/workflows/deploy.yml`) will trigger a deployment via the [`wrangler publish`](https://developers.cloudflare.com/workers/wrangler/commands/#publish) command.

### Updating the url mappings

Changes to the url mapping (`urls.json`) or the action itself (`.github/workflows/urls.yml`) will trigger a batch update of all provided mappings via the [`wrangler kv:key put`](https://developers.cloudflare.com/workers/wrangler/commands/#put) command.

## Managing KV entries manually with Wrangler

To get _all existing keys_ from the KV store:

```bash
wrangler kv:key list --binding=FRAMER

[
  {
    "name": "prod/example"
  },
  {
    "name": "stag/example"
  }
]
```

To get a specific value _by key_ from the KV store:
```bash
wrangler kv:key get --binding=FRAMER "prod/example"

existing value here
```

To update a specific key's _value_:

```bash
wrangler kv:key put --binding=FRAMER "prod/example" 'new value here'


Writing the value "new value here" to key "prod/example" on namespace $NAMESPACEID.
```
