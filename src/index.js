import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import fetch from "node-fetch";

const cacheSsmGetParameter = (params, cacheTime) => {
	let lastRefreshed = undefined;
	let lastResult = undefined;
	let queue = Promise.resolve();
	return () => {
		const res = queue.then(async () => {
			const currentTime = new Date().getTime();
			if (lastResult === undefined || lastRefreshed + cacheTime < currentTime) {
				lastResult = await new SSMClient().send(new GetParameterCommand(params));
				lastRefreshed = currentTime;
			}
			return lastResult;
		});
		queue = res.catch(() => {});
		return res;
	};
};

const getParam = cacheSsmGetParameter({Name: process.env.token_parameter, WithDecryption: true}, 15 * 1000);

const sendTelegramCommand = async (url, params) => {
	const token = (await getParam()).Parameter.Value;

	const res = await fetch(`https://api.telegram.org/bot${token}/${url}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(params),
	});
	if (!res.ok) {
		throw new Error(res);
	}
	const result = await res.json();
	if (!result.ok) {
		throw new Error(result.description);
	}
	return result;
};

export const handler = async (event) => {
	if (event.setWebhook) {
		const {domain, path_key} = process.env;
		await sendTelegramCommand("setWebhook", {
			url: `${domain}/${path_key}/`
		});

	}else {
		const update = JSON.parse(event.body);
		console.log(update);
		const {message: {chat: {id: chat_id}, text, from: {is_bot}}} = update;
		if (!is_bot) {
			await sendTelegramCommand("sendMessage", {
				chat_id,
				text,
			});
		}
	}
};

