import Joi from "joi";
import { IUserLogin, IUserRegistration } from "../../dtos/auth.dto";

export const registerValidation = Joi.object<IUserRegistration>({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Parameter email tidak sesuai format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password minimal 8 karakter",
  }),
});

export const loginValidation = Joi.object<IUserLogin>({
  email: Joi.string().email().required().messages({
    "string.email": "Parameter email tidak sesuai format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password minimal 8 karakter",
  }),
});
