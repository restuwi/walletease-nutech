"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBanners = void 0;
const db_1 = __importDefault(require("../../src/db"));
const seedBanners = () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield db_1.default.banner.create({
            data: banner,
        });
    }
});
exports.seedBanners = seedBanners;
