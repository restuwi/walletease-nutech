import Joi from "joi";

export const balanceValidation = Joi.object<{ top_up_amount: number }>({
  top_up_amount: Joi.number().min(1).required().messages({
    "number.min":
      "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    "number.base":
      "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
  }),
});
