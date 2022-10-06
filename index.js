require("dotenv").config();
const axios = require("axios");

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
	intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b),
});

async function setValue(discordID, channelID, status) {
	const response = await axios.post(
		process.env.URL,
		{
			discordID: discordID,
			channelID: channelID,
			status: status,
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	console.log(response);
}

client.on("ready", () => {
	console.log(`${client.user.tag}でログイン中`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
	if (newState && oldState) {
		//newState関係
		console.log(`NEW:userid   : ${newState.id}`); //ユーザID
		console.log(`NEW:channelId: ${newState.channelId}`); //チャンネルID、nullならdisconnect
		console.log(`NEW:guildid  : ${newState.guild.id}`); //ギルドID

		//oldState関係
		console.log(`OLD:userid   : ${oldState.id}`); //ユーザID
		console.log(`OLD:channelId: ${oldState.channelId}`); //チャンネルID、nullならconnect
		console.log(`OLD:guildid  : ${oldState.guild.id}`); //ギルドID

		if (oldState.channelId === newState.channelId) {
			//ここはミュートなどの動作を行ったときに発火する場所
			console.log("hello");
		} else if (oldState.channelId === null && newState.channelId != null) {
			//ここはconnectしたときに発火する場所
			console.log("connect");
			setValue(newState.id, newState.channelId, "connect");
		} else if (oldState.channelId != null && newState.channelId === null) {
			//ここはdisconnectしたときに発火する場所
			console.log("disconnect");
			setValue(newState.id, oldState.channelId, "disconnect");
		}
	}
});

client.login(process.env.TOKEN);
