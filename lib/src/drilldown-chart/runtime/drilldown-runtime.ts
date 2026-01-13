import type * as echarts from "echarts";
import { DrilldownLevel } from "@/drilldown-chart/models/drilldown-level";
import { RuntimeState } from "@/drilldown-chart/models/runtime-state";
import { buildOption } from "@/drilldown-chart/pipelines/option-pipeline";
import {
  bindNextTrigger,
  unbindDefault,
} from "@/drilldown-chart/pipelines/event-pipeline";
import { getLevel } from "@/drilldown-chart/pipelines/level-pipeline";

export class DrilldownRuntime {
  private chart: echarts.ECharts;
  private levels: DrilldownLevel[];
  private state: RuntimeState;

  constructor(chart: echarts.ECharts, levels: DrilldownLevel[]) {
    this.chart = chart;
    this.levels = levels;

    this.state = {
      currentLevel: 0,
      ctxStack: [],
    };

    this.renderLevel(0);
  }

  private renderLevel(levelIndex: number, ctx?: any) {
    const level = getLevel(this.levels, levelIndex);

    unbindDefault(this.chart);

    const option = buildOption(level, ctx);
    this.chart.setOption(option, true);

    if (level.mapEvent && level.bindTrigger) {
      bindNextTrigger(this.chart, level, (params) => {
        const nextCtx = level.mapEvent!(params);
        this.enterNext(nextCtx);
      });
    }
  }

  private enterNext(ctx: any) {
    if (this.state.currentLevel >= this.levels.length - 1) return;

    this.state.ctxStack.push(ctx);
    this.state.currentLevel++;

    this.renderLevel(this.state.currentLevel, ctx);
  }

  public drillDown() {
    const lastCtx = this.state.ctxStack[this.state.ctxStack.length - 1];
    this.enterNext(lastCtx);
  }

  public rollUp() {
    if (this.state.currentLevel === 0) return;

    this.state.currentLevel--;
    this.state.ctxStack.pop();

    const prevCtx =
      this.state.ctxStack.length > 0
        ? this.state.ctxStack[this.state.ctxStack.length - 1]
        : undefined;

    this.renderLevel(this.state.currentLevel, prevCtx);
  }

  public goTo(levelIndex: number) {
    if (levelIndex < 0 || levelIndex >= this.levels.length) {
      throw new Error("Invalid level index");
    }

    this.state.currentLevel = levelIndex;
    this.state.ctxStack = this.state.ctxStack.slice(0, levelIndex);

    const ctx =
      levelIndex > 0 ? this.state.ctxStack[levelIndex - 1] : undefined;

    this.renderLevel(levelIndex, ctx);
  }

  public getCurrentLevel() {
    return this.state.currentLevel;
  }
}
