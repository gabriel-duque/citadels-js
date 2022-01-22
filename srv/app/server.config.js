const isPassenger = typeof(PhusionPassenger) !== 'undefined';

if (isPassenger) {
  PhusionPassenger.configure({ autoInstall: false });
}

export const port = isPassenger ? 'passenger' : 3000;

export const cookieSecret = 'terceseikooc';

export const db = {
  host: isPassenger ? "localhost" : "109.234.162.228",
  user: "wmmk5272",
  password: "Lucastom2!",
  database: "wmmk5272_citadels"
}