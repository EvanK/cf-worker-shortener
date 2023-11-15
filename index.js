addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // eg, from "https://evanskaufman.com/apps/prod/example?tracking=foo",
  // this gets set to "/apps/prod/example"
  const { pathname, searchParams } = new URL(request.url);

  // this gets a destination for "/apps/prod/example"
  let destination = await FRAMER.get(
    pathname.replace(
      new RegExp("^/apps/"),
      ''
    )
  );

  // handle missing destinations gracefully
  if (destination === null) {
    return new Response(
      `No destination found for ${pathname}`,
      {
        headers: { 'content-type': 'text/plain' }
      }
    );
  }

  // ensure destination is a valid url
  let destUrl;
  try {
    destUrl = new URL(destination);
  } catch (err) {
    return new Response(
      `Destination could not be parsed for ${pathname}: ${err.message}`,
      {
        headers: { 'content-type': 'text/plain' }
      }
    );
  }

  // pass on any provided query params
  if (!!searchParams.toString()) {
    for (const [key, value] of searchParams) {
      destUrl.searchParams.set(key, value);
    }

    destination = destUrl.toString();
  }

  // temporary redirect, to prevent browser caching
  return Response.redirect(destination, 302);
}
