# cloudflare-workers-mailerlite

Basic MailerLite integration with Cloudflare Workers

## Getting started

1. Clone this repository with `git clone https://github.com/samjmck/cloudflare-workers-mailerlite.git`
2. `cd` into the repository with `cd cloudflare-workers-mailerlite`
3. Deploy the Worker with `wrangler publish --name mailerlite`
4. In the [Cloudflare Workers dashboard](https://cloudflare.com/dashboard), select the `mailerlite` worker and a route to the worker, such as `/newsletter`  

## HTML for newsletter subscription form

See [`/template`](/template) for some basic HTML, CSS and JS you can use to add a newsletter form to your website.
