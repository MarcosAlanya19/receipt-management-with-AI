import Joi from 'joi';

export const configuration = () => {
  return {
    setting: {
      env: process.env.NODE_ENV || 'dev',
      port: parseInt(process.env.PORT as string, 10) || 4000,
      version: process.env.VERSION || 'v1',
    },
  };
};

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
});
