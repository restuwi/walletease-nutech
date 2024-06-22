import { Request, Response } from "express";
import * as informationService from "../services/informationService";
import handleResponse from "../helpers/handleResponse";
export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await informationService.getBanners();
    return handleResponse(res, 0, 200, "Sukses", banners);
  } catch (error) {
    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const response = await informationService.getServices();
    return handleResponse(res, 0, 200, "Sukses", response);
  } catch (error) {
    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};
