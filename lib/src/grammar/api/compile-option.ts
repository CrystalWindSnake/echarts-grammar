import { GrammarConfig } from "@/grammar/core/types";
import { compile } from "@/grammar/core/compiler/compile";

export function compileOption(config: GrammarConfig) {
  return compile(config);
}

export type { GrammarConfig };
