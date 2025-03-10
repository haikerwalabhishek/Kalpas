import { connect } from "mongoose";
import { message } from "../constants/Messages.constant.js";
import { statusCodes } from "../constants/StatusCodes.constant.js";
import sendResponse from "../utils/Response.util.js"; 
import { config } from "dotenv";
config();

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function ConnectDB(retries = MAX_RETRIES, res = null) {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(message.DB.SUCCESS.CONNECTED);
  } catch (error) {
    console.error(`${message.DB.FAILURE.NOTCONNECTED} Retries left: ${retries - 1}`, error);
    if (retries <= 1) {
      if (res) {
        return sendResponse({
          response: res,
          statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
          success: statusCodes.SUCCESS.FALSE,
          error: error,
        });
      } else {
        console.error(message.RETRY.LEFT);
        process.exit(1);
      }
    }
    setTimeout(() => {
      ConnectDB(retries - 1, res);
    }, RETRY_DELAY);
  }
}

export default ConnectDB;
