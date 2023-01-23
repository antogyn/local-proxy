# Local-proxy

A proxy from localhost to any remote http address, made with deno.

## Flags

### --port (required)

### --target (required)

### --path (optional)

## Example
```
deno run --allow-net https://deno.land/x/localproxy/proxy.ts --port=3000 --target=https://github.com/antogyn/local-proxy --path=/github

open localhost:3000/github
```
