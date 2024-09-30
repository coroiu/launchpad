import { Environment } from "./src/environment";
import { PartialDeep } from "type-fest";

// Add your custom environment variables here
export const customEnvironment = {} satisfies PartialDeep<Environment>;
