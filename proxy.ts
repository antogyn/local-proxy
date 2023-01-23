import { proxy } from "https://deno.land/x/oak_http_proxy@2.1.0/mod.ts";
import { Application } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";

async function start() {
  const flags = parse(Deno.args, {
    string: ["port", "target"],
  });

  if (!flags.port || !flags.target) {
    console.log("Missing --port and/or --target options");
    console.log(
      `Example: deno run --allow-net https://deno.land/x/localproxy/proxy.ts --port=3000 --target=https://github.com/antogyn/local-proxy`
    );
    return;
  }

  const app = new Application();

  app.use(proxy(flags.target));

  app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
      `Listening on: ${secure ? "https://" : "http://"}${
        hostname ?? "localhost"
      }:${port}`
    );
  });

  await app.listen({ port: Number(flags.port) });
}

start();
