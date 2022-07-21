interface Env {
    MAILERLITE_API_TOKEN: string;
    [groupName: string]: string;
}

export default {
    async fetch(request: Request, environment: Env, context: ExecutionContext) {
        if(request.method === "POST") {
            try {
                const json = await request.json<{ email: string, group_ids: number[] }>();
                if(json.email === undefined || json.email === "") {
                    return new Response("email is not defined", { status: 400 });
                }
                if(json.group_ids === undefined) {
                    return new Response("group_ids is not defined", { status: 400 });
                }
                const createSubscriberResponse = await fetch("https://api.mailerlite.com/api/v2/subscribers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-MailerLite-Apikey": environment.MAILERLITE_API_TOKEN,
                    },
                    body: JSON.stringify({
                        email: json.email,
                        signup_ip: request.headers.get("CF-Connecting-IP"),
                    }),
                });
                if(createSubscriberResponse.status !== 200 && createSubscriberResponse.status !== 201) {
                    console.error("createSubscriberResponse", await createSubscriberResponse.text());
                    return new Response("could not create subscriber", { status: createSubscriberResponse.status });
                }

                const addGroupRequests = [];
                for(const groupId of json.group_ids) {
                    addGroupRequests.push(fetch(`https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers/import`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-MailerLite-Apikey": environment.MAILERLITE_API_TOKEN,
                        },
                        body: JSON.stringify({
                            subscribers: [{ email: json.email }],
                        }),
                    }));
                }
                const addGroupResponses = await Promise.all(addGroupRequests);
                for(const addGroupResponse of addGroupResponses) {
                    if(addGroupResponse.status !== 200 && addGroupResponse.status !== 201) {
                        console.error("addGroupResponse", await createSubscriberResponse.text());
                        return new Response("could not assign group", { status: addGroupResponse.status });
                    }
                }
                return new Response("confirmation mail", { status: 200 });
            } catch(error) {
                console.error(error);
                return new Response("could not decode json", { status: 500 });
            }
        }
        return new Response(null, { status: 404 });
    }
}
