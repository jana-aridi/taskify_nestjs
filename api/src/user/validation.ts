import * as Joi from 'joi';
 
const loginSchema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password")
});
 
export const validateLogin = (data: { email: string; password: string }) => {
    return loginSchema.validate(data);
};


