console.log(this.cookie);

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

class elementHandler {
  element(element) {
    if (element.tagName === 'h1' && element.getAttribute('id') === 'title') {
      element.prepend("Greg Zubatov's ");
    }
    else if (element.tagName === 'title') {
      element.prepend("Greg's Cloudfare ");
    }
    else if (element.tagName === 'p' && element.getAttribute('id') === 'description') {
      element.after(`<p class="text-sm leading-5 text-gray-500">Created by Greg Zubatov<p>`, {html: true});
    }
    else if (element.tagName === 'a' && element.getAttribute('id') === 'url') {
      element.setInnerContent("Visit Greg's Github Profile");
      element.setAttribute('href', 'https://github.com/gzubatov');
    }
  }
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {  
  try {
    // request the URLs from the API
    const response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
    const data = await response.json();
    const {variants} = data;

    // Request a random variant
    const randomURL = variants[Math.floor(Math.random() * variants.length)];
    const variant_response = await fetch(randomURL);

    // HTMLRewriter extra credit
    const rewriter = new HTMLRewriter();
    const elHandler = new elementHandler();
    rewriter.on('*', elHandler);
    const newResponse = rewriter.transform(variant_response);    

    return newResponse;
  } catch (err) {
    console.error(err);
    return new Response(err);
  }
}
