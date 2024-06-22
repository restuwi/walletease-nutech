export interface IService {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tarif: number;
}

export interface ITransaction {
  invoice_number: string;
  service_code: string;
  service_name: string;
  transation_type: string;
  total_amount: number;
  created_at: Date;
}
