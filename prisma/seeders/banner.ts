import db from "../../src/db";
export const seedBanners = async () => {
  const banners = [
    {
      banner_name: "Banner 1",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet",
    },
    {
      banner_name: "Banner 2",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet",
    },
    {
      banner_name: "Banner 3",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet",
    },
    {
      banner_name: "Banner 4",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet",
    },
    {
      banner_name: "Banner 5",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet",
    },
    {
      banner_name: "Banner 6",
      banner_image: "https://nutech-integrasi.app/dummy.jpg",
      description: "Lerem Ipsum Dolor sit amet",
    },
  ];

  for (const banner of banners) {
    await db.banner.create({
      data: banner,
    });
  }
};
