import winston, { format } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger(
    {
        level: "info",
        format: combine(
            timestamp(),
            myFormat
        ),
        defaultMeta: { service: "user-service" },
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs.log' })
        ],

    }
);


export default logger;