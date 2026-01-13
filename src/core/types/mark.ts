import { DataSource } from "./data";

export interface BaseMarkConfig {
  id?: string;
  data?: DataSource;
  options?: Record<string, any>;
}

export interface BarMarkConfig extends BaseMarkConfig {
  type: "bar";
  x: string;
  y: string;
  tooltip?: string | string[];
  label?: string | string[];
}

export interface LineMarkConfig extends BaseMarkConfig {
  type: "line";
  x: string;
  y: string;
  tooltip?: string | string[];
  label?: string | string[];
}

export type XYMarkConfig = BarMarkConfig | LineMarkConfig;

/* 饼图 */
export interface PieMarkConfig extends BaseMarkConfig {
  type: "pie";
  angle: string;
  category?: string;
}

/* 雷达 */
export interface RadarMarkConfig extends BaseMarkConfig {
  type: "radar";
  value: string;
  indicator: string;
}

/* 注册联合类型 */
export type MarkConfig =
  | BarMarkConfig
  | LineMarkConfig
  | PieMarkConfig
  | RadarMarkConfig;
