const isPassenger = typeof(PhusionPassenger) !== 'undefined';

if (isPassenger) {
  PhusionPassenger.configure({
    autoInstall: false
  });
}

export const PORT = isPassenger ? 'passenger' : 3000;

export const COOKIE_SECRET = 'COOKIE_SECRET';

export const DB_CONFIG = {
  host: isPassenger ? "localhost" : "DB_HOST",
  user: "DB_USER",
  password: "DB_PASSWORD",
  database: "DB_NAME"
}