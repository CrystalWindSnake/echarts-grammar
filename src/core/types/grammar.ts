import { DataSource } from "./data";
import { FacetConfig } from "./facet";
import { MarkConfig } from "./mark";

export interface GrammarConfig {
  data?: DataSource;
  facet?: FacetConfig;
  marks: MarkConfig[];
  echarts?: Record<string, any>;
}
