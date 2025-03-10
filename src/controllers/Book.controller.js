import { statusCodes } from "../constants/StatusCodes.constant.js";
import sendResponse from "../utils/Response.util.js";
import { logError } from "../utils/ErrorLog.util.js";
import Book from "../models/Book.model.js";
// import { getImg } from "../utils/ConvertImg.util.js";

export async function getAllBooks(req, res) {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    let skip = (page - 1) * limit;
    const books = await Book.find().skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("BOOK.FETCH_SUCCESS"),
      data: {
        books,
        totalBooks,
        totalPages,
      },
    });
  } catch (error) {
    console.log("getAllBooks controller error: ", error.message);
    logError(`getAllBooks controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("BOOK.FETCH_ERROR"),
    });
  }
}

export async function getBookById(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("PARAMS.FEILDS"),
      });
    }
    const book = await Book.findById(id);

    if (!book) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BOOK.NOT_FOUND"),
      });
    }

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("BOOK.FETCH_SUCCESS"),
      data: book,
    });
  } catch (error) {
    console.log("getBookById controller error: ", error.message);
    logError(`getBookById controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("BOOK.FETCH_ERROR"),
    });
  }
}

export async function createBook(req, res) {
  try {
    const { title, publishedIn, image, author, library } = req.body;
    if (!title || !publishedIn || !image || !author) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.BAD_REQUEST,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BODY.FEILDS"),
      });
    }

    const book = await Book.create(req.body);

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.CREATED,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("BOOK.CREATE_SUCCESS"),
      data: book,
    });

  } catch (error) {
    console.log("createBook controller error: ", error.message);
    logError(`createBook controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("BOOK.CREATE_FAIL"),
    });
  }
}

export async function updateBook(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("PARAMS.FEILDS"),
      });
    }
    const book = await Book.findByIdAndUpdate(id, req.body);
    if (!book) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BOOK.NOT_FOUND"),
      });
    }

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      error: req.t("BOOK.UPDATE_SUCCESS"),
    });
  } catch (error) {
    console.log("updateBook controller error: ", error.message);
    logError(`updateBook controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("BOOK.UPDATE_FAIL"),
    });
  }
}

export async function deleteBook(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("PARAMS.FEILDS"),
      });
    }
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BOOK.NOT_FOUND"),
      });
    }

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      error: req.t("BOOK.DELETE_SUCCESS"),
    });
  } catch (error) {
    console.log("deleteBook controller error: ", error.message);
    logError(`deleteBook controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("BOOK.DELETE_FAIL"),
    });
  }
}
