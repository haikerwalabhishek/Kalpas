import { statusCodes } from "../constants/StatusCodes.constant.js";
import { message } from "../constants/Messages.constant.js";
import sendResponse from "../utils/Response.util.js";
import { logError } from "../utils/ErrorLog.util.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const authenticate = async (req, res, next) => {
  const token =
    (req?.header?.authorization &&
      req?.headers["authorization"]?.split(" ")[1]) ||
    req?.cookies?.token;
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.log("authenticate middleware: ",error);
      logError(`authenticate middleware: ${error.message}`)
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.UNAUTHORIZED,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("AUTH.INVALID_TOKEN"),
      });
    }
    req.user = decoded;
    next();
  });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse({
        response: res,
        statusCode: statusCodes.CLIENT_ERROR.FORBIDDEN,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("AUTH.NOT_AUTHORIZED"),
      });
    }
    next();
  };
};
