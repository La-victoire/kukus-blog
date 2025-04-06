import { z } from "zod";

const nameField = z.string().min(3, "Must be more than 3 letters").max(30, "Must be less than 30 letters")
const emailField = z.string().email("Invalid email address")
const passwordField = z.string().min(6, "Must be more than 6 letters")
export const userSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: emailField ,
  password: passwordField,
})

// const postSchema