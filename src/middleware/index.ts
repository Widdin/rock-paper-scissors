import { Request, Response, NextFunction } from 'express';

/**
 * Checks if all the required parameters are present in the request's body and params.
 *
 * @param {Array.<string>} params - An array of parameter names to check.
 * @throws {Error} - If any required parameter is missing, throws an error with a 400 status code.
 */
const checkParams =
  (params: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const missingParams = params.filter(
      (param) => !(param in req.params || param in req.body)
    );
    if (missingParams.length > 0) {
      const missingParamsStr = missingParams.join(', ');
      return res
        .status(400)
        .json({ error: `Missing parameters: ${missingParamsStr}` });
    }
    next();
  };

export { checkParams };
