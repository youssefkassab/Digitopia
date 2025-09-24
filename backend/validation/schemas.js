const Joi = require('joi');

// Common primitives
const idSchema = Joi.number().integer().positive().required();
const emailSchema = Joi.string().email().max(254).required();
const passwordSchema = Joi.string().min(8).max(200).required();

// Users
const userLoginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

const userSignupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: emailSchema,
  password: passwordSchema,
  national_number: Joi.string().min(3).max(30).required(),
  role: Joi.string().valid('user','teacher').required(),
  Grade: Joi.alternatives().try(
    Joi.number().integer().min(1).max(12),
    Joi.string().max(5)
  ).optional(),
});

const userUpgradeRoleSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  role: Joi.string().valid('user','teacher','admin').required(),
});

// Courses
const courseCreateSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(2).required(),
  price: Joi.number().precision(2).min(0).required(),
  teacher_id: Joi.number().integer().positive().optional(), // only for admin
  tags: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.number().integer().positive(),
        Joi.string().pattern(/^\d+$/),
        Joi.object({ id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().pattern(/^\d+$/)).required() })
      )
    )
    .optional(),
});

const courseUpdateSchema = Joi.object({
  id: idSchema,
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().min(2).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  teacher_id: Joi.number().integer().positive().optional(),
  date: Joi.string().optional(),
  time: Joi.string().optional(),
  tags: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.number().integer().positive(),
        Joi.string().pattern(/^\d+$/),
        Joi.object({ id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().pattern(/^\d+$/)).required() })
      )
    )
    .optional(),
}).or('name','description','price','teacher_id','date','time','tags');

const courseDeleteSchema = Joi.object({ id: idSchema });
const courseFindSchema = Joi.object({ id: idSchema });

const createTagSchema = Joi.object({ name: Joi.string().min(1).max(100).required() });

// Messages
const messageCreateSchema = Joi.object({
  senderEmail: emailSchema,
  content: Joi.string().min(1).max(5000).required(),
});

const messageUpdateSchema = Joi.object({
  id: idSchema,
  content: Joi.string().min(1).max(5000).required(),
});

const messageSeenSchema = Joi.object({
  id: idSchema,
});

const messageDeleteSchema = Joi.object({
  id: idSchema,
});

module.exports = {
  userLoginSchema,
  userSignupSchema,
  userUpgradeRoleSchema,
  courseCreateSchema,
  courseUpdateSchema,
  courseDeleteSchema,
  courseFindSchema,
  createTagSchema,
  messageCreateSchema,
  messageUpdateSchema,
  messageSeenSchema,
  messageDeleteSchema,
};
