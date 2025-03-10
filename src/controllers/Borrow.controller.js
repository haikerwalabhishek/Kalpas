import { statusCodes } from "../constants/StatusCodes.constant.js";
import sendResponse from "../utils/Response.util.js";
import { logError } from "../utils/ErrorLog.util.js";
import Book from "../models/Book.model.js";
import { config } from "dotenv";
config();

export async function borrowBook(req, res) {
  try {
    const brrorwer = req.user.id;
    const bookId = req.params.id;
    if (!bookId) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.BAD_REQUEST,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("PARAMS.FEILDS"),
      });
    }
    const book = await Book.findById(bookId);

    if (!book) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BOOK.NOT_FOUND"),
      });
    }

    if (book.borrower) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.CONFLICT,
        success: statusCodes.SUCCESS.FALSE,
        message: req.t("BOOK.ALREADY_BORROWED"),
        data: book,
      });
    }
    book.borrower = brrorwer;
    await book.save();

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("BORROWING.SUCCESS"),
      data: book,
    });
  } catch (error) {
    console.log("borrow book controller error: ", error.message);
    logError(`borrow book error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.CLIENT_ERROR.UNAUTHORIZED,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("BORROWING.FAIL"),
    });
  }
}

export async function returnBook(req, res) {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;
    if (!bookId) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.BAD_REQUEST,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("PARAMS.FEILDS"),
      });
    }
    const book = await Book.findById(bookId);

    if (!book) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BOOK.NOT_FOUND"),
      });
    }

    if (!book.borrower || book.borrower.toString() !== userId) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.FORBIDDEN,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BORROWING.NOT_AUTHORIZED_RETURN"),
      });
    }

    book.borrower = null;
    await book.save();

    return sendResponse({
        res,
        statusCode: statusCodes.SUCCESS.OK,
        success: statusCodes.SUCCESS.TRUE,
        error: req.t("BORROWING.RETURN_SUCCESS"),
      });
  } catch (error) {
    console.log("return book controller error: ", error.message);
    logError(`return book controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.CLIENT_ERROR.UNAUTHORIZED,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("BORROWING.RETURN_FAIL"),
    });
  }
}
