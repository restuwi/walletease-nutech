import { Response } from "express";

interface IResponse {
  status: number;
  message: string;
  data: any;
}

const handleResponse = (
  res: Response,
  status: number,
  code: number,
  message: string,
  data: any
) => {
  const response: IResponse = {
    status,
    message,
    data,
  };

  res.status(code).json(response);
};

export default handleResponse;
