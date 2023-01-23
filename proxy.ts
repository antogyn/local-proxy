import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";
import { Application } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { proxy } from "https://deno.land/x/oak_http_proxy@2.1.0/mod.ts";

async function start() {
  const flags = parse(Deno.args, {
    string: ["port", "target", "path"],
  });

  if (!flags.port || !flags.target) {
    console.log("Missing --port and/or --target options");
    console.log(
      `Example: deno run --allow-net https://deno.land/x/localproxy/proxy.ts --port=3000 --target=https://github.com/antogyn/local-proxy`
    );
    return;
  }

  const app = new Application();

  app.use((ctx, next) => {
    const pathname: string = ctx.request.url.pathname;
    if (flags.path) {
      if (pathname.startsWith(flags.path)) {
        return proxy(() => {
          return new URL(flags.target! + pathname.slice(flags.path!.length));
        })(ctx, next);
      } else {
        ctx.response.status = 404;
        next();
      }
    } else {
      return proxy(() => {
        return new URL(flags.target! + pathname);
      })(ctx, next);
    }
  });

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
