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
  DATABASE_URL: Joi.string().uri().required(),
  PORT: Joi.number().default(4000),
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
  VERSION: Joi.string().default('v1'),
  OPENAI_API_KEY: Joi.string().required(),
});
