import moment from "moment-timezone";

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
	private log(level: LogLevel, message: string, meta?: any) {
		const timestamp = moment().tz("UTC").format("YYYY-MM-DD HH:mm:ss");
		const logMessage = {
			timestamp,
			level: level.toUpperCase(),
			message,
			...(meta && { meta }),
		};

		console.log(JSON.stringify(logMessage));
	}

	info(message: string, meta?: any) {
		this.log("info", message, meta);
	}

	warn(message: string, meta?: any) {
		this.log("warn", message, meta);
	}

	error(message: string | object, meta?: any) {
		if (typeof message === "object") {
			this.log("error", JSON.stringify(message), meta);
		} else {
			this.log("error", message, meta);
		}
	}

	debug(message: string, meta?: any) {
		this.log("debug", message, meta);
	}
}

export default new Logger();
