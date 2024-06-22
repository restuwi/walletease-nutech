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
exports.seedServices = void 0;
const db_1 = __importDefault(require("../../src/db"));
const seedServices = () => __awaiter(void 0, void 0, void 0, function* () {
    const services = [
        {
            service_code: "PAJAK",
            service_name: "Pajak PBB",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 40000,
        },
        {
            service_code: "PLN",
            service_name: "Listrik",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 10000,
        },
        {
            service_code: "PDAM",
            service_name: "PDAM Berlangganan",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 40000,
        },
        {
            service_code: "PULSA",
            service_name: "Pulsa",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 40000,
        },
        {
            service_code: "PGN",
            service_name: "PGN Berlangganan",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 50000,
        },
        {
            service_code: "MUSIK",
            service_name: "Musik Berlangganan",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 50000,
        },
        {
            service_code: "TV",
            service_name: "TV Berlangganan",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 50000,
        },
        {
            service_code: "PAKET_DATA",
            service_name: "Paket data",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 50000,
        },
        {
            service_code: "VOUCHER_GAME",
            service_name: "Voucher Game",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 100000,
        },
        {
            service_code: "VOUCHER_MAKANAN",
            service_name: "Voucher Makanan",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 100000,
        },
        {
            service_code: "QURBAN",
            service_name: "Qurban",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 200000,
        },
        {
            service_code: "ZAKAT",
            service_name: "Zakat",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 300000,
        },
        {
            service_code: "TOPUP",
            service_name: "Top Up Balance",
            service_icon: "https://nutech-integrasi.app/dummy.jpg",
            service_tarif: 0,
        },
    ];
    for (const service of services) {
        yield db_1.default.service.create({
            data: service,
        });
    }
});
exports.seedServices = seedServices;
