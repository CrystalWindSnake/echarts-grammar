项目结构

- echarts-simplified/
  - core/
    - id-generator.ts
    - collector-base.ts
    - types.ts
  - collectors/
    - dataset-collector.ts
    - axis-collector.ts
    - grid-collector.ts
    - series-collector.ts
  - builders/
    - transforms.ts
  - index.ts

说明:

- core/ : 核心模块, 包含一些工具函数和类型定义.
- collectors/ : 收集器模块, 负责管理和创建配置项.
- builders/ : 构建器模块, 负责创建配置项.
