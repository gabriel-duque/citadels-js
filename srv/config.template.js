const isPassenger = typeof(PhusionPassenger) !== 'undefined';

if (isPassenger) {
  PhusionPassenger.configure({
    autoInstall: false
  });
}

export const port = isPassenger ? 'passenger' : 3000;

export const cookieSecret = 'COOKIE_SECRET';

export const db = {
  host: isPassenger ? "localhost" : "DISTANT_HOST",
  user: "DB_USER",
  password: "DB_PASSWORD",
  database: "DB_NAME"
}