/**
 * data/subtitles.ts
 * 全部字幕 cue — 基于 SCRIPT-v1.md 旁白
 * startFrame / endFrame 是 FullVideo 的绝对帧号（30fps）
 *
 * 帧号参考 (v5 — rate=+0%, 8f gaps):
 *   段 0  PainPoint          0–381
 *   段 1  IterativeDev     382–1516
 *   段 2  FeatureSpotlight 1517–2936
 *   段 3  PerfChart        2937–3611
 *   段 4  CompileTimeSafety 3612–4912
 *   段 5  HeterogeneousCompute 4913–5910
 *   段 6  AINative         5911–9670
 *   段 7  OutroCTA         9671–9885
 */

import type { SubtitleCue } from "../components/Subtitle";

export const SUBTITLES: SubtitleCue[] = [
  // ═══ 段 0: 痛点开场 (0–381) ═══
  // seg0-01: abs 4–143 (139f)
  {
    startFrame: 4,
    endFrame: 143,
    textCN: "写一个生产级 GPU 计算核，需要多长时间？",
    textEN: "How long does it take to write a production-grade GPU kernel?",
    highlights: ["GPU 计算核", "GPU kernel"],
  },
  // seg0-02: abs 151–378 (226f) — split into 2 subtitle chunks
  {
    startFrame: 151,
    endFrame: 250,
    textCN: "FlashAttention、Blockscale",
    textEN: "For operators like FlashAttention and Blockscale GEMM,",
    highlights: ["FlashAttention", "Blockscale GEMM"],
  },
  {
    startFrame: 254,
    endFrame: 378,
    textCN:
      "GEMM 这样的算子，顶尖专家花上几个星期实现与调优。",
    textEN:
      "even top experts spend weeks on implementation and tuning.",
    highlights: ["几个星期", "weeks", "实现与调优", "implementation and tuning"],
  },

  // ═══ 段 1: 迭代开发 + CroqTile 揭晓 (382–1516) ═══
  // seg1-01: abs 386–526 (144f) — split into 2 subtitle chunks
  {
    startFrame: 386,
    endFrame: 486,
    textCN: "这不仅仅是因为实现复杂、代码量大。",
    textEN:
      "It's not just because the implementation is complex",
    highlights: ["实现复杂", "complex"],
  },
  {
    startFrame: 490,
    endFrame: 526,
    textCN: "这不仅仅是因为实现复杂、代码行数多。",
    textEN: "or the code is long.",
    highlights: ["代码行数", "code is long"],
  },
  // seg1-02: abs 534–849 (314f) — split into 3 subtitle chunks
  {
    startFrame: 534,
    endFrame: 638,
    textCN:
      "而是因为一个生产级计算核，需要经过多轮编写、编译调试、",
    textEN:
      "A production-grade kernel requires multiple iterations of coding,",
    highlights: ["多轮", "multiple iterations", "编写", "编译调试"],
  },
  {
    startFrame: 642,
    endFrame: 744,
    textCN: "性能剖析、参数调优的完整迭代，才能逐步逼近",
    textEN:
      "compile-debugging, profiling, and parameter tuning — each cycle",
    highlights: ["性能剖析", "参数调优", "profiling", "parameter tuning"],
  },
  {
    startFrame: 748,
    endFrame: 849,
    textCN: "生产级性能。",
    textEN: "inching closer to production-level performance.",
    highlights: ["生产级性能", "production-level performance"],
  },
  // seg1-03: abs 857–1087 (230f) — split into 2 subtitle chunks
  {
    startFrame: 857,
    endFrame: 972,
    textCN: "这个过程不仅需要扎实的编程能力，还需要深厚的",
    textEN: "This process demands not only solid programming skills,",
    highlights: ["编程能力", "programming skills", "硬件知识", "hardware knowledge"],
  },
  {
    startFrame: 976,
    endFrame: 1087,
    textCN: "硬件知识与丰富的性能优化经验。",
    textEN:
      "but also deep hardware knowledge and optimization experience.",
    highlights: ["性能优化", "optimization experience"],
  },
  // seg1-04: abs 1095–1230 (134f)
  {
    startFrame: 1095,
    endFrame: 1230,
    textCN: "这些门槛，大大限制了计算核的开发效率。",
    textEN:
      "These barriers severely limit kernel development efficiency.",
    highlights: ["门槛", "barriers", "开发效率", "efficiency"],
  },
  // seg1-05: abs 1238–1513 (274f) — split into 2 subtitle chunks
  {
    startFrame: 1238,
    endFrame: 1376,
    textCN: "所以我们造了 CroqTile——新一代 GPU 和",
    textEN:
      "So we built CroqTile — the next-generation GPU and DSA kernel",
    highlights: ["CroqTile", "新一代", "next-generation"],
  },
  {
    startFrame: 1380,
    endFrame: 1513,
    textCN: "DSA 内核编程语言，5 倍生产力，为 AI 时代而生。",
    textEN:
      "programming language. 5× productivity, designed for the AI era.",
    highlights: ["5 倍生产力", "5×", "AI 时代", "AI era"],
  },

  // ═══ 段 2: 简单易用 (1517–2936) ═══
  // seg2-01: abs 1521–2105 (584f) — split into 6 subtitle chunks
  {
    startFrame: 1521,
    endFrame: 1632,
    textCN: "传统内核语言如 CUDA，从单个线程的视角编程。",
    textEN:
      "Traditional kernel languages like CUDA program from a single thread's",
    highlights: ["CUDA", "单个线程", "single thread"],
  },
  {
    startFrame: 1638,
    endFrame: 1764,
    textCN: "每个线程操作一个 buffer 指针加上 offset",
    textEN: "view. Each thread works with a buffer pointer plus an offset —",
    highlights: ["buffer", "offset", "指针"],
  },
  {
    startFrame: 1769,
    endFrame: 1825,
    textCN: "你为一个线程写逻辑容易，",
    textEN: "writing logic for one thread is easy,",
    highlights: ["一个线程", "one thread"],
  },
  {
    startFrame: 1830,
    endFrame: 1924,
    textCN: "但很难想象一组线程累积起来的数据全貌。",
    textEN:
      "but it's hard to picture the accumulated data across a group of",
    highlights: ["一组线程", "group of threads", "数据全貌"],
  },
  {
    startFrame: 1929,
    endFrame: 2037,
    textCN: "想实现数据块切分(data blocking)？",
    textEN: "threads. Want data blocking?",
    highlights: ["数据块切分", "data blocking"],
  },
  {
    startFrame: 2042,
    endFrame: 2105,
    textCN: "你必须手动拼出所有偏移量。",
    textEN: "You piece together all the offset math yourself.",
    highlights: ["偏移量", "offset math"],
  },
  // seg2-02: abs 2113–2622 (509f) — split into 5 subtitle chunks
  {
    startFrame: 2113,
    endFrame: 2229,
    textCN: "CroqTile 完全不同。它从宏观角度编程——",
    textEN:
      "CroqTile is fundamentally different. It programs from the macro view —",
    highlights: ["CroqTile", "宏观角度", "macro view"],
  },
  {
    startFrame: 2233,
    endFrame: 2302,
    textCN: "数据是张量，不是 buffer。",
    textEN: "data is a tensor, not a buffer.",
    highlights: ["张量", "tensor", "buffer"],
  },
  {
    startFrame: 2307,
    endFrame: 2443,
    textCN: "subspan 描述子区域，chunkat 按块切片，",
    textEN: "Subspan describes a sub-region, chunkat slices by block,",
    highlights: ["subspan", "chunkat"],
  },
  {
    startFrame: 2447,
    endFrame: 2517,
    textCN: ".at() 定位迭代位置。",
    textEN: ".at() locates the iteration.",
    highlights: [".at()"],
  },
  {
    startFrame: 2521,
    endFrame: 2622,
    textCN: "你描述取哪块，编译器生成所有地址计算。",
    textEN:
      "You describe what to take — the compiler generates all address math.",
    highlights: ["编译器", "compiler", "地址计算", "address math"],
  },
  // seg2-03: abs 2630–2933 (303f) — split into 2 subtitle chunks
  {
    startFrame: 2630,
    endFrame: 2782,
    textCN:
      "结果不仅是代码量减少 60%，而且代码变得极其直观——",
    textEN:
      "The result is not only 60% less code, but code that's super intuitive",
    highlights: ["60%", "直观", "intuitive"],
  },
  {
    startFrame: 2786,
    endFrame: 2933,
    textCN: "人类工程师和 AI agent 都能一眼读懂内核逻辑。",
    textEN:
      "— both human engineers and AI agents understand kernel logic.",
    highlights: ["AI agent", "内核逻辑", "kernel logic"],
  },

  // ═══ 段 3: 零成本抽象 (2937–3611) ═══
  // seg3-01: abs 2941–3160 (219f) — split into 2 subtitle chunks
  {
    startFrame: 2941,
    endFrame: 3050,
    textCN: "和其他内核 DSL 相比，CroqTile 在相同计算核",
    textEN:
      "Compared to other kernel DSLs, CroqTile shows minimal lines of code",
    highlights: ["DSL", "CroqTile", "最少的代码量", "minimal lines of code"],
  },
  {
    startFrame: 3054,
    endFrame: 3160,
    textCN: "实现中展现了最少的代码量。",
    textEN: "for the same kernel implementation.",
    highlights: ["计算核", "kernel implementation"],
  },
  // seg3-02: abs 3168–3390 (221f) — split into 2 subtitle chunks
  {
    startFrame: 3168,
    endFrame: 3277,
    textCN: "这种简洁性没有以性能为代价。",
    textEN:
      "This level of simplicity comes without performance compromise.",
    highlights: ["简洁性", "simplicity", "性能", "performance"],
  },
  {
    startFrame: 3282,
    endFrame: 3390,
    textCN: "零成本抽象是我们在语法设计中的第一原则。",
    textEN:
      "Zero-cost abstraction is our first design principle.",
    highlights: [
      "零成本抽象",
      "zero-cost abstraction",
      "第一原则",
      "first design principle",
    ],
  },
  // seg3-03: abs 3398–3608 (209f) — split into 2 subtitle chunks
  {
    startFrame: 3398,
    endFrame: 3501,
    textCN: "这使得 CroqTile 成为最简单、最直观，",
    textEN:
      "This makes CroqTile the most simple and intuitive kernel language —",
    highlights: ["CroqTile", "最简单", "most simple", "直观"],
  },
  {
    startFrame: 3506,
    endFrame: 3608,
    textCN: "同时拥有顶级性能的内核编程语言。",
    textEN: "with still top-level performance.",
    highlights: ["顶级性能", "top-level performance"],
  },

  // ═══ 段 4: 编译时安全 (3612–4912) ═══
  // seg4-01: abs 3616–3790 (173f) — split into 2 subtitle chunks
  {
    startFrame: 3616,
    endFrame: 3700,
    textCN: "除了易用性，调试体验也是",
    textEN: "Beyond usability, the debugging experience",
    highlights: ["调试体验", "debugging experience"],
  },
  {
    startFrame: 3703,
    endFrame: 3790,
    textCN: "影响计算核开发效率的重要因素。",
    textEN: "is a major factor in kernel development efficiency.",
    highlights: ["开发效率", "efficiency"],
  },
  // seg4-02: abs 3798–4198 (400f) — split into 3 subtitle chunks
  {
    startFrame: 3798,
    endFrame: 3910,
    textCN: "传统的调优过程经常出现运行时报错——",
    textEN: "Traditional tuning cycles are plagued by runtime errors —",
    highlights: ["运行时报错", "runtime errors"],
  },
  {
    startFrame: 3913,
    endFrame: 4070,
    textCN: "这类 bug 只在 GPU 上实际跑的时候才暴露，",
    textEN: "bugs that only surface when the GPU actually runs.",
    highlights: ["GPU", "bug"],
  },
  {
    startFrame: 4073,
    endFrame: 4198,
    textCN: "定位一个 DMA 越界或 shape 不匹配往往要花上数小时甚至数天。",
    textEN: "Tracking down a DMA overflow or shape mismatch can take hours, even days.",
    highlights: ["DMA", "shape", "数小时", "hours"],
  },
  // seg4-03: abs 4206–4539 (332f) — split into 2 subtitle chunks
  {
    startFrame: 4206,
    endFrame: 4373,
    textCN:
      "CroqTile 是市场上唯一设计了独立编译模块的新一代计算核语言。",
    textEN:
      "CroqTile is the only next-gen kernel language with a standalone compiler.",
    highlights: ["唯一", "only", "独立编译模块", "standalone compiler"],
  },
  {
    startFrame: 4373,
    endFrame: 4539,
    textCN:
      "这使得 CroqTile 具备了更为强劲的代码检查能力。",
    textEN:
      "This gives CroqTile superior code analysis capabilities.",
    highlights: ["代码检查", "code analysis"],
  },
  // seg4-04: abs 4547–4909 (361f) — split into 3 subtitle chunks
  {
    startFrame: 4547,
    endFrame: 4647,
    textCN: "DMA 越界、shape 不匹配、同步错误——",
    textEN: "DMA overflows, shape mismatches, sync errors —",
    highlights: ["DMA", "shape", "同步错误", "sync errors"],
  },
  {
    startFrame: 4650,
    endFrame: 4770,
    textCN: "这些传统内核开发中最难追踪的 runtime bug，",
    textEN: "the hardest runtime bugs in traditional kernel development,",
    highlights: ["runtime bug", "最难追踪", "hardest"],
  },
  {
    startFrame: 4773,
    endFrame: 4909,
    textCN:
      "CroqTile 编译器通常在编译期就能优雅地拦截。",
    textEN:
      "the CroqTile compiler typically catches them at compile time.",
    highlights: ["CroqTile", "编译器", "compiler", "通常", "typically", "编译期", "compile time"],
  },

  // ═══ 段 5: 异构计算 · One DSL, Multiple Devices (4764–5760) ═══
  // seg5-01: abs 4917–5352 (435f) — split into 3 subtitle chunks
  {
    startFrame: 4917,
    endFrame: 5062,
    textCN: "CroqTile 编译器支持多种后端执行设备。",
    textEN: "The CroqTile compiler supports multiple backend devices.",
    highlights: ["编译器", "compiler", "后端", "backend"],
  },
  {
    startFrame: 5067,
    endFrame: 5247,
    textCN: "通过简单的编译器配置，同一份源码就能运行在不同的后端设备上。",
    textEN: "With a simple compiler config, the same source runs on different backends.",
    highlights: ["同一份", "same", "编译器配置", "compiler config"],
  },
  {
    startFrame: 5252,
    endFrame: 5352,
    textCN: "甚至自定义加速器上，不需要复杂的迁移与适配。",
    textEN: "Even custom accelerators — no complex migration or adaptation.",
    highlights: ["自定义加速器", "custom accelerators", "迁移", "migration"],
  },
  // seg5-02: abs 5360–5907 (546f) — split into 3 subtitle chunks
  {
    startFrame: 5360,
    endFrame: 5495,
    textCN: "不仅如此，CroqTile 还能让多个设备协同工作。",
    textEN: "What's more, CroqTile enables multi-device collaboration.",
    highlights: ["多个设备", "multi-device", "协同", "collaboration"],
  },
  {
    startFrame: 5500,
    endFrame: 5651,
    textCN: "增加一层 parallel-by 结构，标注通过 mpi 分发，",
    textEN: "Add a parallel-by structure, specify mpi dispatch,",
    highlights: ["parallel-by", "mpi"],
  },
  {
    startFrame: 5656,
    endFrame: 5907,
    textCN: "编译器自动完成宿主机和设备端代码的生成和分发，与单设备一样简单。",
    textEN: "the compiler generates and distributes host and device code — as simple as single-device.",
    highlights: ["编译器", "compiler", "宿主机", "host", "设备端", "device", "单设备", "single-device"],
  },

  // ═══ 段 6: AI-Native (5911–9670) ═══
  // seg6-01: abs 5915–6161 (246f) → 2 chunks
  {
    startFrame: 5915,
    endFrame: 6038,
    textCN: "CroqTile 从设计之初就在思考一个问题：",
    textEN: "From the very beginning, CroqTile was designed around one question:",
    highlights: ["CroqTile"],
  },
  {
    startFrame: 6038,
    endFrame: 6161,
    textCN: "怎样让 AI Agent 成为更好的计算核调优工程师？",
    textEN: "how do we make AI Agent a better kernel tuning engineer?",
    highlights: ["AI Agent", "计算核调优工程师", "kernel tuning engineer"],
  },
  // seg6-02: abs 6169–6385 (216f) → 2 chunks
  {
    startFrame: 6169,
    endFrame: 6229,
    textCN: "答案是两件事——",
    textEN: "The answer comes down to two things —",
    highlights: [],
  },
  {
    startFrame: 6229,
    endFrame: 6385,
    textCN: "让 AI Agent 更容易读懂代码，也更快地得到编译器的反馈。",
    textEN:
      "making code easier for AI Agent to read, and making compiler feedback faster.",
    highlights: ["AI Agent", "编译器", "compiler feedback"],
  },
  // seg6-03: abs 6393–6657 (263f) → 2 chunks
  {
    startFrame: 6393,
    endFrame: 6524,
    textCN: "首先是上下文。CroqTile 的代码极其精简，",
    textEN: "First, context. CroqTile's code is extremely concise —",
    highlights: ["上下文", "context", "CroqTile"],
  },
  {
    startFrame: 6524,
    endFrame: 6657,
    textCN: "同样的计算核实现，所需的 token 数远低于其他语言。",
    textEN:
      "the same kernel implementation requires far fewer tokens than other languages.",
    highlights: ["token", "计算核", "kernel"],
  },
  // seg6-04: abs 6665–6907 (241f) → 2 chunks
  {
    startFrame: 6665,
    endFrame: 6785,
    textCN: "这意味着同样的预算下，AI Agent 可以跑更多轮优化，",
    textEN:
      "This means with the same budget, AI Agent can run more optimization rounds,",
    highlights: ["预算", "budget", "AI Agent", "优化", "optimization"],
  },
  {
    startFrame: 6785,
    endFrame: 6907,
    textCN: "或者用更小的模型达到同样效果。",
    textEN: "or achieve the same results with a smaller model.",
    highlights: ["模型", "model"],
  },
  // seg6-05: abs 6915–7167 (252f) → 2 chunks
  {
    startFrame: 6915,
    endFrame: 7041,
    textCN: "而且每个逻辑变更只对应很少的代码修改，",
    textEN: "And every logical change requires only minimal code modifications —",
    highlights: ["逻辑变更", "logical change", "minimal"],
  },
  {
    startFrame: 7041,
    endFrame: 7167,
    textCN: "AI Agent 不会因为要同时改多个位置而出错。",
    textEN:
      "AI Agent won't make mistakes from having to modify multiple locations at once.",
    highlights: ["AI Agent"],
  },
  // seg6-06: abs 7175–7434 (259f) → 2 chunks
  {
    startFrame: 7175,
    endFrame: 7304,
    textCN: "然后是反馈速度。传统语言的错误要等到 GPU 运行时才暴露，",
    textEN:
      "Then there's feedback speed. In traditional languages, errors only surface at GPU runtime —",
    highlights: ["反馈速度", "feedback speed", "GPU runtime"],
  },
  {
    startFrame: 7304,
    endFrame: 7434,
    textCN: "定位一个 bug 可能需要几十分钟。",
    textEN: "tracking down a single bug can take tens of minutes.",
    highlights: ["bug", "几十分钟", "tens of minutes"],
  },
  // seg6-07: abs 7442–7678 (235f) → 2 chunks
  {
    startFrame: 7442,
    endFrame: 7559,
    textCN: "而 CroqTile 在编译期就能拦截绝大部分错误，",
    textEN: "CroqTile catches most errors at compile time,",
    highlights: ["CroqTile", "编译期", "compile time"],
  },
  {
    startFrame: 7559,
    endFrame: 7678,
    textCN: "AI Agent 不需要等待漫长的运行和调试。",
    textEN: "so AI Agent doesn't need to wait through lengthy runs and debugging.",
    highlights: ["AI Agent"],
  },
  // seg6-08: abs 7686–8037 (351f) → 2 chunks
  {
    startFrame: 7686,
    endFrame: 7861,
    textCN: "配合大量的编译期检查和运行时断言，每一轮 AI Agent 迭代只需几秒。",
    textEN:
      "Combined with extensive compile-time checks and runtime assertions, each AI Agent iteration takes just seconds —",
    highlights: ["编译期检查", "compile-time checks", "runtime assertions", "AI Agent"],
  },
  {
    startFrame: 7861,
    endFrame: 8037,
    textCN: "这让 AI Agent 的试错效率提升了一个数量级。",
    textEN:
      "an order-of-magnitude improvement in trial-and-error efficiency.",
    highlights: ["数量级", "order-of-magnitude", "试错", "trial-and-error", "AI Agent"],
  },
  // seg6-09: abs 8045–8263 (217f) → 2 chunks
  {
    startFrame: 8045,
    endFrame: 8100,
    textCN: "在编译器之上，",
    textEN: "On top of the compiler,",
    highlights: ["编译器", "compiler"],
  },
  {
    startFrame: 8100,
    endFrame: 8263,
    textCN: "CroqTile 还提供了两层专门为 AI Agent 设计的增强工具。",
    textEN:
      "CroqTile provides two additional AI Agent-specific enhancement layers.",
    highlights: ["CroqTile", "AI Agent", "enhancement layers"],
  },
  // seg6-10: abs 8271–8572 (301f) → 2 chunks
  {
    startFrame: 8271,
    endFrame: 8421,
    textCN: "统一的性能分析接口，让 AI Agent 直接获取结构化的性能数据，",
    textEN:
      "A unified profiling interface gives AI Agent structured performance data directly,",
    highlights: ["性能分析", "profiling interface", "结构化", "structured", "AI Agent"],
  },
  {
    startFrame: 8421,
    endFrame: 8572,
    textCN: "不需要适配不同硬件平台各自的 profiler 格式。",
    textEN:
      "without adapting to each hardware platform's profiler format.",
    highlights: ["profiler", "硬件平台", "hardware platform"],
  },
  // seg6-11: abs 8580–8823 (243f) → 2 chunks
  {
    startFrame: 8580,
    endFrame: 8680,
    textCN: "以及预封装的编程知识库，",
    textEN: "And a pre-packaged programming knowledge base,",
    highlights: ["知识库", "knowledge base"],
  },
  {
    startFrame: 8680,
    endFrame: 8823,
    textCN: "让 AI Agent 从第一次尝试就能写出接近最优的代码。",
    textEN:
      "so AI Agent writes near-optimal code from the very first attempt.",
    highlights: ["AI Agent", "near-optimal", "第一次尝试", "first attempt"],
  },
  // seg6-12: abs 8831–9524 (692f) → 5 chunks
  {
    startFrame: 8831,
    endFrame: 8931,
    textCN: "这些设计带来的结果是什么？",
    textEN: "What do these design choices deliver?",
    highlights: ["设计", "design choices"],
  },
  {
    startFrame: 8931,
    endFrame: 9081,
    textCN: "同样的 Agent 模型、同样的硬件、同样的调优系统，",
    textEN: "Same agent model, same hardware, same tuning system —",
    highlights: ["Agent 模型", "agent model", "调优系统", "tuning system"],
  },
  {
    startFrame: 9081,
    endFrame: 9282,
    textCN: "在我们的实验中，用 CroqTile 进行调优效果显著好于其他计算核编程语言，",
    textEN:
      "in our experiments, tuning with CroqTile significantly outperforms other kernel languages,",
    highlights: ["CroqTile", "计算核编程语言", "kernel languages"],
  },
  {
    startFrame: 9282,
    endFrame: 9402,
    textCN: "甚至在很多算子的调优上，能超过当前厂商的算子库性能。",
    textEN:
      "and even surpasses vendor library performance on many operators.",
    highlights: ["算子", "operators", "厂商", "vendor library"],
  },
  {
    startFrame: 9402,
    endFrame: 9524,
    textCN: "CroqTile 让生产级别的 AI Agent 调优应用成为可能。",
    textEN: "CroqTile makes production-grade AI Agent tuning a reality.",
    highlights: ["CroqTile", "生产级别", "production-grade", "AI Agent 调优", "AI Agent tuning"],
  },
  // seg6-13: abs 9532–9667 (135f)
  {
    startFrame: 9532,
    endFrame: 9667,
    textCN: "用 CroqTile，让你的计算核调优更加写意。",
    textEN: "With CroqTile, make your kernel tuning truly effortless.",
    highlights: ["CroqTile", "计算核", "kernel tuning", "写意", "effortless"],
  },

  // ═══ 段 7: 结语 CTA (9671–9885) ═══
  // seg7-01: abs 9675–9882 (207f) → 2 chunks
  {
    startFrame: 9675,
    endFrame: 9778,
    textCN: "欢迎来到计算编程的新时代。",
    textEN: "Welcome to the new era of compute programming.",
    highlights: ["新时代", "new era"],
  },
  {
    startFrame: 9781,
    endFrame: 9882,
    textCN: "你的性能开发效率，值得被重新定义。",
    textEN:
      "Your kernel development productivity deserves to be redefined.",
    highlights: ["重新定义", "redefined"],
  },
];
