import { statusCodes } from "../constants/StatusCodes.constant.js";
import sendResponse from "../utils/Response.util.js";
import { logError } from "../utils/ErrorLog.util.js";
import User from "../models/User.model.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !email || !role) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.BAD_REQUEST,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BODY.FEILDS"),
      });
    }

    const user = new User(req.body);
    await user.save();
    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("USER.REGISTER_SUCCESS"),
      data: user,
    });
  } catch (error) {
    console.log("register controller error: ", error.message);
    logError(`register controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.CLIENT_ERROR.UNAUTHORIZED,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("USER.REGISTER_FAIL"),
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.BAD_REQUEST,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BODY.FEILDS"),
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.UNAUTHORIZED,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("AUTH.INVALID_CREDENTIALS"),
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP }
    );
    const refresh = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_RE_SECRET,
      { expiresIn: process.env.JWT_RE_EXP }
    );

    res.cookie("token", token, {
      htppOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refresh, {
      htppOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("USER.LOGIN_SUCCESS"),
      data: { token, refreshToken: refresh },
    });
  } catch (error) {
    console.log("login controller error: ", error.message);
    logError(`login controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.CLIENT_ERROR.UNAUTHORIZED,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("USER.REGISTER_FAIL"),
    });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: true,
      message: req.t("USER.LOGOUT_SUCCESS"),
      data: { clearLocalStorage: true },
    });

  } catch (error) {
    console.log("logout controller error: ", error.message);
    logError(`logout controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: false,
      error: req.t("USER.LOGOUT_FAIL"),
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken =
      req?.cookies?.refreshToken ||
      (req?.header?.authorization &&
        req?.headers["authorization"]?.split(" ")[1]);

    if (!refreshToken) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.BAD_REQUEST,
        success: false,
        error:
          req.t("AUTH.MISSING_REFRESH_TOKEN")
      });
    }

    jwt.verify(refreshToken, process.env.JWT_RE_SECRET, (err, decoded) => {
      if (err) {
        return sendResponse({
          res,
          statusCode: statusCodes.CLIENT_ERROR.UNAUTHORIZED,
          success: statusCodes.SUCCESS.FALSE,
          error:
            req.t("AUTH.INVALID_REFRESH_TOKEN")
        });
      }

      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXP }
      );

      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: (Number(process.env.JWT_EXP_COOKIE) * 24 * 60 * 60 * 1000), // e.g., 24 hours
      });

      return sendResponse({
        res,
        statusCode: statusCodes.SUCCESS.OK,
        success: statusCodes.SUCCESS>TRUE,
        message:
          req.t("AUTH.REFRESH_SUCCESS"),
        data: newAccessToken,
      });
    });
    
  } catch (error) {
    console.log("refreshToken controller error: ", error.message);
    logError(`refreshToken controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: false,
      error: req.t("AUTH.REFRESH_FAIL"),
    });
  }
}
