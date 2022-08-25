# cloudflare-workers-mailerlite

Basic MailerLite integration with Cloudflare Workers

For an extensive guide, please read [my blog post](https://samjmck.com/en/blog/static-site-free-newsletter)

## Getting started

1. Clone this repository with `git clone https://github.com/samjmck/cloudflare-workers-mailerlite.git`
2. `cd` into the repository with `cd cloudflare-workers-mailerlite`
3. Deploy the Worker with `wrangler publish --name mailerlite`
4. In the [Cloudflare Workers dashboard](https://cloudflare.com/dashboard), select the `mailerlite` worker and a route to the worker, such as `/newsletter`
5. Add your MailerLite API token to the enviroment variables of your Cloudflare Worker under the name `MAILERLITE_API_TOKEN`

## Calling the worker to add a subscriber

This is some demo code for how a request should look like:

```js
const response = await fetch("/newsletter", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email,
        groups_ids: groupIds, // groupIds needs to be strings
    }),
});
```

The group IDs are the groups the subscriber will be added to. The ID of a group can be found by opening the [groups section in the subscribers tab in the MailerLite dashboard](https://dashboard.mailerlite.com/groups), clicking on "View group" and then looking at the `group` query parameter in the URL.

## HTML for newsletter subscription form

See [`/template`](/template) for some basic HTML, CSS and JS you can use to add a newsletter form to your website.
