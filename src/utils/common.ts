import config from "../config/index";

import jwt from "jsonwebtoken";


function getDbStatusText(status: number): string {
    switch (status) {
      case 0: return 'disconnected';
      case 1: return 'connected';
      case 2: return 'connecting';
      case 3: return 'disconnecting';
      default: return 'unknown';
    }
  }

  export { getDbStatusText };



const createToken = (id: any) => {
  if (!config.jwtSecret) {
    throw new Error("JWT secret is not defined in the configuration");
  }
  const token = jwt.sign({ id }, config.jwtSecret, {
    expiresIn: "7d",
  });

  return token;
};

const verifyToken = (token: string) => {
  if (!config.jwtSecret) {
    throw new Error("JWT secret is not defined in the configuration");
  }
  return jwt.verify(token, config.jwtSecret);
};

export { createToken, verifyToken };
