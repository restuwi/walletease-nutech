import Joi from "joi";
import { IUserProfile } from "../../dtos/profile.dto";

export const profileUpdateValidation = Joi.object<IUserProfile>({
  email: Joi.string().email().messages({
    "string.email": "Parameter email tidak sesuai format",
  }),
  first_name: Joi.string(),
  last_name: Joi.string(),
  profile_image: Joi.string(),
});
