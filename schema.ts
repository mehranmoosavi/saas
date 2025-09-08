import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type Schema = z.infer<typeof schema>;


const signInSchema = z.object({
email:z.string().email(),
  password: z.string().min(1),
  role:z.enum(['user','admin','owner']),
  name:z.string()

})
type SignInSchema = z.infer<typeof signInSchema>;


export { schema,signInSchema, type Schema,type SignInSchema };

