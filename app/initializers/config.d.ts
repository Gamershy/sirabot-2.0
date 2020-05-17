type ConfigObject = Promise<Config>;

interface BotConfig {
	readonly OWNER_ID: string;
	readonly DEVELOPER_ID: string;
	readonly YOUTUBE_KEY: string;
	readonly STABLE: boolean;
}

interface DatabaseConfig {
	readonly PROTOCOL: string;
	readonly SERVER: string;
	readonly USERNAME: string;
	readonly PASSWORD: string
	readonly DATABASE: string;
}

interface DiscordConfig {
	readonly TOKEN: string;
}

interface ServerConfig {
	readonly SERVER_ID: string;
	readonly OWNER_ID: string;
}

interface Config {
	readonly Bot: BotConfig;
	readonly Database: DatabaseConfig;
	readonly Discord: DiscordConfig;
	readonly Server: ServerConfig;
}

export = ConfigObject;
