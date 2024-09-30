import { defaultEnvironment } from "./default-environment";
import { customEnvironment } from "../.custom-env";
import { merge } from "ts-deepmerge";

export type Environment = typeof defaultEnvironment;

export const environment: Environment = merge(defaultEnvironment, customEnvironment);
