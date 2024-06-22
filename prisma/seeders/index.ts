import { seedBanners } from "./banner";
import { seedServices } from "./service";

export const seedDatabase = async () => {
  await seedBanners();
  await seedServices();
};
