import bcrypt from "bcrypt";
import httpStatus from "http-status";

import { AppError } from "../../../error/appError";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const register = async (data: IUser) => {
  const result = await User.findOne({ email: data.email });

  console.log("result", result);

  if (result) {
    throw new AppError("Email already exists", httpStatus.BAD_REQUEST);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const userData = { ...data, password: hashedPassword };

  const newUser = await User.create(userData);
  if (!newUser) {
    throw new AppError("Failed to create user", httpStatus.BAD_REQUEST);
  }
  return newUser;
};

const login = async (data: IUser) => {
  console.log("data from api-server service", data);
  const result = await User.findOne({ email: data.email }).select("+password");

  if (!result) {
    throw new AppError("User not found", httpStatus.BAD_REQUEST);
  }

  if (!result.password) {
    throw new AppError("Password not set for this account.", httpStatus.BAD_REQUEST);
  }

  const isPasswordMatch = await bcrypt.compare(data.password, result.password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid password", httpStatus.BAD_REQUEST);
  }

  const userObject = result.toObject();
  delete userObject.password;

  return userObject;
};

const getUserById = async (id: string) => {
  const userData = User.findById(id).select("-password");

  if (!userData) {
    throw new AppError("User not found", httpStatus.BAD_REQUEST);
  }

  return userData;
};

const updateUserById = async (id: string, data: IUser) => {
  const user = User.findByIdAndUpdate(id, data);

  if (!user) {
    throw new AppError("User not found", httpStatus.BAD_REQUEST);
  }
};

export const UserService = {
  register,
  login,
  getUserById,
  updateUserById,
};
