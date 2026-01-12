import { GrammarConfig } from "@/core/types";
import { compile } from "@/core/compiler/compile";

export function compileOption(config: GrammarConfig) {
  return compile(config);
}
