import { z } from "zod";

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const userRegistrationSchema = z.object({
  userName: z
    .string()
    .min(1, "Name is required")
    .min(5, "Name should be more than 5 characters"),

  userEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  userPassword: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password should be more than 6 characters"),

  userBirthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine(
      (date) => {
        const age = calculateAge(date);
        return age >= 18;
      },
      {
        message: "Age must be 18 or older",
      }
    ),
});

export const userLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password should be more than 6 characters"),

});

export const useZodValidation = (schema) => {
  const validate = (data, setErrorMessage) => {
    setErrorMessage("");

    try {
      schema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        setErrorMessage(firstError.message);
      } else {
        setErrorMessage("Validation failed");
      }
      return false;
    }
  };

  const validateWithAllErrors = (data, setErrorMessage) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message);
      setErrorMessage(errors.join(", "));
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const validateField = (fieldName, value) => {
    try {
      const fieldSchema = schema.shape[fieldName];
      fieldSchema.parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return "Validation error";
    }
  };

  return { validate, validateWithAllErrors, validateField };
};
