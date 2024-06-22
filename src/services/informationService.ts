import db from "../db";
export const getBanners = async () => {
  return await db.$queryRaw`SELECT banner_name, banner_image, 'description' FROM banners`;
};

export const getServices = async () => {
  return await db.$queryRaw`SELECT service_code, service_name, service_icon, service_tarif FROM services`;
};
