import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/index";



function getDbStatusText(status: number): string {
  switch (status) {
    case 0: return 'disconnected';
    case 1: return 'connected';
    case 2: return 'connecting';
    case 3: return 'disconnecting';
    default: return 'unknown';
  }
}


const createAccessToken = (payload: object): string => {
  const accessSecret = config.jwt?.accessSecret;
  const accessExpiresIn = config.jwt?.accessExpiresIn;

  if (!accessSecret || !accessExpiresIn) {
    throw new Error("JWT Access secret or expiry is not defined in the configuration");
  }

  const token = jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiresIn as any
  });

  return token;
};

const createRefreshToken = (payload: object): string => {
  const refreshSecret = config.jwt?.refreshSecret;
  const refreshExpiresIn = config.jwt?.refreshExpiresIn;

  if (!refreshSecret || !refreshExpiresIn) {
    throw new Error("JWT Refresh secret or expiry is not defined in the configuration");
  }

  return jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiresIn as any
  });
};


const verifyAccessToken = (token: string): JwtPayload | string => {
  const accessSecret = config.jwt?.accessSecret;
  if (!accessSecret) {
    throw new Error("JWT Access secret is not defined in the configuration");
  }
  try {
    return jwt.verify(token, accessSecret);
  } catch (error) {
    console.error("Access token verification failed:", error);
    throw new Error("Invalid Access Token");
  }
};


const verifyRefreshToken = (token: string): JwtPayload | string => {
  const refreshSecret = config.jwt?.refreshSecret;
  if (!refreshSecret) {
    throw new Error("JWT Refresh secret is not defined in the configuration");
  }
  try {

    return jwt.verify(token, refreshSecret) as JwtPayload;
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    throw new Error("Invalid Refresh Token");
  }
};

export {
  createAccessToken,
  createRefreshToken, getDbStatusText, verifyAccessToken,
  verifyRefreshToken
};

