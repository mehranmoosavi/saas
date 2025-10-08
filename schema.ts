import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type Schema = z.infer<typeof schema>;


const signUpSchema = z.object({
email:z.string().email(),
  password: z.string().min(1),
  Role:z.enum(['OWNER','ADMIN','USER']),
  name:z.string()

})
type SignInSchema = z.infer<typeof signUpSchema>;


export { schema,signUpSchema, type Schema,type SignInSchema };

