import { statusCodes } from "../constants/StatusCodes.constant.js";
import sendResponse from "../utils/Response.util.js";
import { logError } from "../utils/ErrorLog.util.js";
import Book from "../models/Book.model.js";
import Library from "../models/Library.model.js";

export async function getAllLibraries(req, res) {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    let skip = (page - 1) * limit;
    const libraries = await Library.find().populate("books").skip(skip).limit(limit);
    const totalLibrary = await Library.countDocuments();
    const totalPages = Math.ceil(totalLibrary / limit);

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("LIBRARY.FETCH_SUCCESS"),
      data: {
        libraries,
        totalLibrary,
        totalPages,
      },
    });
  } catch (error) {
    console.log("getAllLibraries controller error: ", error.message);
    logError(`getAllLibraries controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("LIBRARY.FETCH_ERROR"),
    });
  }
}

export async function getLibraryById(req, res) {
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

    const library = await Library.findById(id).populate({
      path: "books",
      populate: { path: "borrower", select: "name email" },
    });

    if (!library) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("LIBRARY.FETCH_ERROR"),
      });
    }

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("LIBRARY.FETCH_SUCCESS"),
      data: library,
    });
  } catch (error) {
    console.log("getLibraryById controller error: ", error.message);
    logError(`getLibraryById controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("LIBRARY.FETCH_ERROR"),
    });
  }
}

export async function createLibrary(req, res) {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.BAD_REQUEST,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("BODY.FEILDS"),
      });
    }
    const library = await Library.create({ name, address });

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.CREATED,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("LIBRARY.CREATE_SUCCESS"),
      data: library,
    });
  } catch (error) {
    console.log("createLibrary controller error: ", error.message);
    logError(`createLibrary controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("LIBRARY.FETCH_ERROR"),
    });
  }
}

export async function updateLibrary(req, res) {
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

    const { name, address } = req.body;

    const library = await Library.findById(id);

    if (!library) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("LIBRARY.NOT_FOUND"),
      });
    }

    if (name.trim()) {
      library.name = name;
    }

    if (address.trim()) {
      library.address = address;
    }

    await library.save();

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("LIBRARY.UPDATE_SUCCESS"),
      data: library,
    });
  } catch (error) {
    console.log("updateLibrary controller error: ", error.message);
    logError(`updateLibrary controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("LIBRARY.FETCH_ERROR"),
    });
  }
}

export async function deleteLibrary(req, res) {
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
    const library = await Library.findByIdAndDelete(id);
    if (!library) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("LIBRARY.NOT_FOUND"),
      });
    }
    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("LIBRARY.DELETE_SUCCESS"),
      data: library,
    });
  } catch (error) {
    console.log("deleteLibrary controller error: ", error.message);
    logError(`deleteLibrary controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("LIBRARY.FETCH_ERROR"),
    });
  }
}

export async function getInventory(req, res) {
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

    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const books = await Book.find({ library: id, borrower: null })
      .skip(skip)
      .limit(limit);

    const totalBooks = await Book.countDocuments({
      library: id,
      borrower: null,
    });

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("BOOK.FETCH_SUCCESS"),
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalBooks / limit),
          totalBooks,
        },
      },
    });
  } catch (error) {
    console.log("getInventory controller error: ", error.message);
    logError(`getInventory controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("BOOK.FETCH_ERROR"),
    });
  }
}

export async function addToInventory(req, res) {
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

    const bookId = req.params.bookId;
    if (!bookId) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("PARAMS.FEILDS"),
      });
    }

    const library = await Library.findById(id).populate("books");

    if(!library.books.includes(bookId)){
      library.books.push(bookId);
    }

    await library.save();

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("INVENTORY.ADD_SUCCESS"),
      data: library,
    });
  } catch (error) {
    console.log("addToInventory controller error: ", error.message);
    logError(`addToInventory controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("INVENTORY.ADD_FAIL"),
    });
  }
}

export async function removeFromInventory(req, res) {
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

    const bookId = req.params.bookId;
    if (!bookId) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("PARAMS.FEILDS"),
      });
    }

    const library = await Library.findById(id).populate("books");
    if (!library) {
      return sendResponse({
        res,
        statusCode: statusCodes.CLIENT_ERROR.NOT_FOUND,
        success: statusCodes.SUCCESS.FALSE,
        error: req.t("LIBRARY.NOT_FOUND"),
      });
    }

    library.books.pull(bookId);

    await library.save();

    return sendResponse({
      res,
      statusCode: statusCodes.SUCCESS.OK,
      success: statusCodes.SUCCESS.TRUE,
      message: req.t("INVENTORY.REMOVE_SUCCESS"),
      data: library,
    });
  } catch (error) {
    logError(`removeFromInventory controller error: ${error.message}`);
    return sendResponse({
      res,
      statusCode: statusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      success: statusCodes.SUCCESS.FALSE,
      error: req.t("LIBRARY.FETCH_ERROR"),
    });
  }
}
