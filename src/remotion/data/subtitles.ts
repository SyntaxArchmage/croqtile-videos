/**
 * data/subtitles.ts
 * 全部字幕 cue — 基于 SCRIPT-v1.md 旁白
 * startFrame / endFrame 是 FullVideo 的绝对帧号（30fps）
 *
 * 帧号参考 (v2):
 *   段 0  PainPoint        0–438
 *   段 1  IterativeDev     439–1831
 *   段 2  FeatureSpotlight 1832–3221
 *   段 3  PerfChart        3222–3971
 *   段 4  CompileTimeSafety 3972–4871
 *   段 5  HeterogeneousCompute  5600–6719
 *   段 6  AINative (AI-Native)  6720–11369
 *   段 7  OutroCTA         11370–11669
 */

import type { SubtitleCue } from "../components/Subtitle";

export const SUBTITLES: SubtitleCue[] = [
  // ═══ 段 0: 痛点开场 (0–459) ═══
  {
    startFrame: 0,
    endFrame: 162,
    textCN: "写一个生产级 GPU 计算核，需要多长时间？",
    textEN: "How long does it take to write a production-grade GPU kernel?",
    highlights: ["GPU 计算核", "GPU kernel"],
  },
  {
    startFrame: 170,
    endFrame: 409,
    textCN:
      "FlashAttention、Blockscale GEMM 这样的算子，顶尖专家也要花上几个星期来实现与调优。",
    textEN:
      "For operators like FlashAttention and Blockscale GEMM, even top experts spend weeks on implementation and tuning.",
    highlights: ["FlashAttention", "几个星期", "weeks"],
  },

  // ═══ 段 1: 迭代开发 + CroqTile 揭晓 (460–1929) ═══
  {
    startFrame: 480,
    endFrame: 649,
    textCN: "这不仅仅是因为实现复杂、代码行数多。",
    textEN:
      "It's not just because the implementation is complex or the code is long.",
    highlights: ["实现复杂", "complex"],
  },
  {
    startFrame: 657,
    endFrame: 1046,
    textCN:
      "而是因为一个生产级计算核，需要经过多轮编写、编译调试、性能剖析、参数调优的完整迭代，才能逐步逼近生产级性能。",
    textEN:
      "A production-grade kernel requires multiple iterations of coding, compile-debugging, profiling, and parameter tuning — each cycle inching closer to production-level performance.",
    highlights: [
      "多轮",
      "multiple iterations",
      "编写",
      "编译调试",
      "性能剖析",
      "参数调优",
    ],
  },
  {
    startFrame: 1054,
    endFrame: 1343,
    textCN:
      "这个过程不仅需要扎实的编程能力，还需要深厚的硬件知识与丰富的性能优化经验。",
    textEN:
      "This process demands not only solid programming skills, but also deep hardware knowledge and extensive optimization experience.",
    highlights: [
      "编程能力",
      "硬件知识",
      "性能优化",
      "hardware knowledge",
    ],
  },
  {
    startFrame: 1351,
    endFrame: 1508,
    textCN: "这些门槛，大大限制了计算核的开发效率。",
    textEN:
      "These barriers severely limit kernel development efficiency.",
    highlights: ["门槛", "barriers", "开发效率", "efficiency"],
  },
  {
    startFrame: 1516,
    endFrame: 1896,
    textCN:
      "所以我们造了 CroqTile——新一代 GPU 和 DSA 内核编程语言，5 倍生产力，为 AI 时代而生。",
    textEN:
      "So we built CroqTile — the next-generation GPU and DSA kernel programming language. 5× productivity, designed for the AI era.",
    highlights: ["CroqTile", "5 倍生产力", "5×", "AI 时代", "AI era"],
  },

  // ═══ 段 2: 简单易用 (1930–3399) ═══
  {
    startFrame: 1950,
    endFrame: 2453,
    textCN:
      "传统内核语言如 CUDA，从单个线程的视角编程。每个线程操作一个 buffer 指针加上 offset——你为一个线程写逻辑容易，但很难想象一组线程累积起来的数据全貌。想实现 data blocking？你必须手动拼出所有偏移量。",
    textEN:
      "Traditional kernel languages like CUDA program from a single thread's view. Each thread works with a buffer pointer plus an offset — writing logic for one thread is easy, but it's hard to picture the accumulated data across a group of threads. Want data blocking? You piece together all the offset math yourself.",
    highlights: ["CUDA", "buffer", "offset", "data blocking", "偏移量"],
  },
  {
    startFrame: 2461,
    endFrame: 3041,
    textCN:
      "CroqTile 完全不同。它从宏观角度编程——数据是张量，不是 buffer。subspan 描述子区域，chunkat 按块切片，.at() 定位迭代位置。你描述取哪块，编译器生成所有地址计算。",
    textEN:
      "CroqTile is fundamentally different. It programs from the macro view — data is a tensor, not a buffer. Subspan describes a sub-region, chunkat slices by block, .at() locates the iteration. You describe what to take — the compiler generates all address math.",
    highlights: [
      "CroqTile",
      "张量",
      "tensor",
      "subspan",
      "chunkat",
      ".at()",
      "编译器",
      "compiler",
    ],
  },
  {
    startFrame: 3049,
    endFrame: 3365,
    textCN:
      "结果不仅是代码量减少 60%，而且代码变得极其直观——人类工程师和 AI agent 都能一眼读懂内核逻辑。",
    textEN:
      "The result is not only 60% less code, but code that's super intuitive — both human engineers and AI agents can understand kernel logic at a glance.",
    highlights: ["60%", "直观", "intuitive", "AI agent"],
  },

  // ═══ 段 3: 零成本抽象 (3400–4169) ═══
  {
    startFrame: 3420,
    endFrame: 3649,
    textCN:
      "和其他内核 DSL 相比，CroqTile 在相同计算核实现中展现了最少的代码量。",
    textEN:
      "Compared to other kernel DSLs, CroqTile shows the minimal lines of code for the same kernel implementation.",
    highlights: ["DSL", "最少的代码量", "minimal lines of code"],
  },
  {
    startFrame: 3657,
    endFrame: 3913,
    textCN:
      "这种简洁性没有以性能为代价。零成本抽象是我们在语法设计中的第一原则。",
    textEN:
      "This level of simplicity comes without performance compromise. Zero-cost abstraction is our first design principle.",
    highlights: [
      "零成本抽象",
      "zero-cost abstraction",
      "第一原则",
      "first design principle",
    ],
  },
  {
    startFrame: 3921,
    endFrame: 4140,
    textCN:
      "这使得 CroqTile 成为最简单、最直观，同时拥有顶级性能的内核编程语言。",
    textEN:
      "This makes CroqTile the most simple and intuitive kernel language — with still top-level performance.",
    highlights: [
      "最简单",
      "most simple",
      "顶级性能",
      "top-level performance",
    ],
  },

  // ═══ 段 4: 编译时安全 (3992–4871) ═══
  {
    startFrame: 3992,
    endFrame: 4200,
    textCN: "除了易用性，调试体验也是影响计算核开发效率的重要因素。",
    textEN:
      "the debugging experience is a major factor in kernel development efficiency.",
    highlights: ["调试体验", "debugging experience"],
  },
  // seg4-02 (VO 4395–4815) → 3 chunks
  {
    startFrame: 4203,
    endFrame: 4432,
    textCN:
      "传统的调优过程经常出现运行时报错——定位一个 DMA 越界或 shape 不匹配往往要花上数小时甚至数天。",
    textEN:
      "Traditional tuning cycles are plagued by runtime errors —",
    highlights: ["运行时报错", "runtime errors"],
  },
  {
    startFrame: 4435,
    endFrame: 4652,
    textCN: "CroqTile 是当前市场上唯一设计了独立编译模块的新一代计算核编程语言。",
    textEN:
      "Tracking down a DMA overflow or shape mismatch can take hours, even days.",
    highlights: ["DMA", "shape"],
  },
  // seg4-03 (VO 4823–5176) → 2 chunks
  {
    startFrame: 4823,
    endFrame: 5000,
    textCN:
      "CroqTile 是市场上唯一设计了独立编译模块的新一代计算核语言。",
    textEN:
      "CroqTile is the only next-gen kernel language with a standalone compiler.",
    highlights: ["唯一", "only", "独立编译模块", "standalone compiler"],
  },
  {
    startFrame: 4655,
    endFrame: 4871,
    textCN:
      "DMA 越界、shape 不匹配、同步错误——CroqTile 编译器在编译期就能优雅地拦截。",
    textEN:
      "This gives CroqTile unparalleled compile-time static analysis.",
    highlights: ["编译期", "compile-time"],
  },
  // seg4-04 (VO 5184–5563) → 2 chunks
  {
    startFrame: 5184,
    endFrame: 5370,
    textCN: "DMA 越界、shape 不匹配、同步错误——",
    textEN: "DMA overflows, shape mismatches, sync errors —",
    highlights: ["DMA", "shape", "同步错误", "sync errors"],
  },
  {
    startFrame: 5373,
    endFrame: 5563,
    textCN:
      "这些最难追踪的 runtime bug，编译期就能优雅地拦截。",
    textEN:
      "the hardest runtime bugs, caught by the compiler at compile time.",
    highlights: ["编译期", "compile time"],
  },

  // ═══ 段 5: 异构计算 · Write Once Run Everywhere (5600–6719) ═══
  // seg5-01 audio: rel f10–f467 → abs 5610–6067 → sub-offset 5402 → rel 208–665
  {
    startFrame: 5412,
    endFrame: 5518,
    textCN: "CroqTile 编译器支持多种后端执行设备。",
    textEN: "The CroqTile compiler supports multiple backend devices.",
    highlights: ["编译器", "compiler", "后端", "backend"],
  },
  {
    startFrame: 5524,
    endFrame: 5720,
    textCN: "通过简单的编译器配置，同一份源码就能运行在不同的后端设备上。",
    textEN: "With a simple compiler config, the same source runs on different backends.",
    highlights: ["同一份", "same", "编译器配置", "compiler config"],
  },
  {
    startFrame: 5726,
    endFrame: 5878,
    textCN: "甚至自定义加速器上，不需要复杂的迁移与适配。",
    textEN: "Even custom accelerators — no complex migration or adaptation.",
    highlights: ["自定义加速器", "custom accelerators", "迁移", "migration"],
  },
  // seg5-02 audio: rel f490 → abs 6090
  {
    startFrame: 5892,
    endFrame: 6008,
    textCN: "不仅如此，CroqTile 还能让多个设备协同工作。",
    textEN: "What's more, CroqTile enables multi-device collaboration.",
    highlights: ["多个设备", "multi-device", "协同", "collaboration"],
  },
  {
    startFrame: 6014,
    endFrame: 6180,
    textCN: "增加一层 parallel-by 结构，标注通过 mpi 分发，",
    textEN: "Add a parallel-by structure, specify mpi dispatch,",
    highlights: ["parallel-by", "mpi"],
  },
  {
    startFrame: 6186,
    endFrame: 6430,
    textCN: "编译器自动完成宿主机和设备端代码的生成和分发，与单设备一样简单。",
    textEN: "the compiler generates and distributes host and device code — as simple as single-device.",
    highlights: ["编译器", "compiler", "宿主机", "host", "设备端", "device", "单设备", "single-device"],
  },

  // ═══ 段 6: AI-Native (6720–11369) ═══
  // seg6-01 (VO 6740, 246f) → 2 chunks
  {
    startFrame: 6740,
    endFrame: 6863,
    textCN: "CroqTile 从设计之初就在思考一个问题：",
    textEN: "From the very beginning, CroqTile was designed around one question:",
    highlights: ["CroqTile"],
  },
  {
    startFrame: 6863,
    endFrame: 6986,
    textCN: "怎样让 AI Agent 成为更好的计算核调优工程师？",
    textEN: "how do we make AI Agent a better kernel tuning engineer?",
    highlights: ["AI Agent", "计算核调优工程师", "kernel tuning engineer"],
  },
  // seg6-02 (VO 6994, 215f) → 2 chunks
  {
    startFrame: 6994,
    endFrame: 7054,
    textCN: "答案是两件事——",
    textEN: "The answer comes down to two things —",
    highlights: [],
  },
  {
    startFrame: 7054,
    endFrame: 7209,
    textCN: "让 AI Agent 更容易读懂代码，也更快地得到编译器的反馈。",
    textEN:
      "making code easier for AI Agent to read, and making compiler feedback faster.",
    highlights: ["AI Agent", "编译器", "compiler feedback"],
  },
  // seg6-03 (VO 7217, 263f) → 2 chunks
  {
    startFrame: 7217,
    endFrame: 7348,
    textCN: "首先是上下文。CroqTile 的代码极其精简，",
    textEN: "First, context. CroqTile's code is extremely concise —",
    highlights: ["上下文", "context", "CroqTile"],
  },
  {
    startFrame: 7348,
    endFrame: 7480,
    textCN: "同样的计算核实现，所需的 token 数远低于其他语言。",
    textEN:
      "the same kernel implementation requires far fewer tokens than other languages.",
    highlights: ["token", "计算核", "kernel"],
  },
  // seg6-04 (VO 7488, 241f) → 2 chunks
  {
    startFrame: 7488,
    endFrame: 7608,
    textCN: "这意味着同样的预算下，AI Agent 可以跑更多轮优化，",
    textEN:
      "This means with the same budget, AI Agent can run more optimization rounds,",
    highlights: ["预算", "budget", "AI Agent", "优化", "optimization"],
  },
  {
    startFrame: 7608,
    endFrame: 7729,
    textCN: "或者用更小的模型达到同样效果。",
    textEN: "or achieve the same results with a smaller model.",
    highlights: ["模型", "model"],
  },
  // seg6-05 (VO 7737, 251f) → 2 chunks
  {
    startFrame: 7737,
    endFrame: 7862,
    textCN: "而且每个逻辑变更只对应很少的代码修改，",
    textEN: "And every logical change requires only minimal code modifications —",
    highlights: ["逻辑变更", "logical change", "minimal"],
  },
  {
    startFrame: 7862,
    endFrame: 7988,
    textCN: "AI Agent 不会因为要同时改多个位置而出错。",
    textEN:
      "AI Agent won't make mistakes from having to modify multiple locations at once.",
    highlights: ["AI Agent"],
  },
  // seg6-06 (VO 7996, 258f) → 2 chunks
  {
    startFrame: 7996,
    endFrame: 8125,
    textCN: "然后是反馈速度。传统语言的错误要等到 GPU 运行时才暴露，",
    textEN:
      "Then there's feedback speed. In traditional languages, errors only surface at GPU runtime —",
    highlights: ["反馈速度", "feedback speed", "GPU runtime"],
  },
  {
    startFrame: 8125,
    endFrame: 8254,
    textCN: "定位一个 bug 可能需要几十分钟。",
    textEN: "tracking down a single bug can take tens of minutes.",
    highlights: ["bug", "几十分钟", "tens of minutes"],
  },
  // seg6-07 (VO 8262, 235f) → 2 chunks
  {
    startFrame: 8262,
    endFrame: 8379,
    textCN: "而 CroqTile 在编译期就能拦截绝大部分错误，",
    textEN: "CroqTile catches most errors at compile time,",
    highlights: ["CroqTile", "编译期", "compile time"],
  },
  {
    startFrame: 8379,
    endFrame: 8497,
    textCN: "AI Agent 不需要等待漫长的运行和调试。",
    textEN: "so AI Agent doesn't need to wait through lengthy runs and debugging.",
    highlights: ["AI Agent"],
  },
  // seg6-08 (VO 8505, 351f) → 2 chunks
  {
    startFrame: 8505,
    endFrame: 8680,
    textCN: "配合大量的编译期检查和运行时断言，每一轮 AI Agent 迭代只需几秒。",
    textEN:
      "Combined with extensive compile-time checks and runtime assertions, each AI Agent iteration takes just seconds —",
    highlights: ["编译期检查", "compile-time checks", "runtime assertions", "AI Agent"],
  },
  {
    startFrame: 8680,
    endFrame: 8856,
    textCN: "这让 AI Agent 的试错效率提升了一个数量级。",
    textEN:
      "an order-of-magnitude improvement in trial-and-error efficiency.",
    highlights: ["数量级", "order-of-magnitude", "试错", "trial-and-error", "AI Agent"],
  },
  // seg6-09 (VO 8864, 217f) → 2 chunks
  {
    startFrame: 8864,
    endFrame: 8919,
    textCN: "在编译器之上，",
    textEN: "On top of the compiler,",
    highlights: ["编译器", "compiler"],
  },
  {
    startFrame: 8919,
    endFrame: 9081,
    textCN: "CroqTile 还提供了两层专门为 AI Agent 设计的增强工具。",
    textEN:
      "CroqTile provides two additional AI Agent-specific enhancement layers.",
    highlights: ["CroqTile", "AI Agent", "enhancement layers"],
  },
  // seg6-10 (VO 9089, 300f) → 2 chunks
  {
    startFrame: 9089,
    endFrame: 9239,
    textCN: "统一的性能分析接口，让 AI Agent 直接获取结构化的性能数据，",
    textEN:
      "A unified profiling interface gives AI Agent structured performance data directly,",
    highlights: ["性能分析", "profiling interface", "结构化", "structured", "AI Agent"],
  },
  {
    startFrame: 9239,
    endFrame: 9389,
    textCN: "不需要适配不同硬件平台各自的 profiler 格式。",
    textEN:
      "without adapting to each hardware platform's profiler format.",
    highlights: ["profiler", "硬件平台", "hardware platform"],
  },
  // seg6-11 (VO 9397, 242f) → 2 chunks
  {
    startFrame: 9397,
    endFrame: 9497,
    textCN: "以及预封装的编程知识库，",
    textEN: "And a pre-packaged programming knowledge base,",
    highlights: ["知识库", "knowledge base"],
  },
  {
    startFrame: 9497,
    endFrame: 9639,
    textCN: "让 AI Agent 从第一次尝试就能写出接近最优的代码。",
    textEN:
      "so AI Agent writes near-optimal code from the very first attempt.",
    highlights: ["AI Agent", "near-optimal", "第一次尝试", "first attempt"],
  },
  // seg6-12 (VO 9647, 691f) → 5 chunks
  {
    startFrame: 9647,
    endFrame: 9747,
    textCN: "这些设计带来的结果是什么？",
    textEN: "What do these design choices deliver?",
    highlights: ["设计", "design choices"],
  },
  {
    startFrame: 9747,
    endFrame: 9897,
    textCN: "同样的 Agent 模型、同样的硬件、同样的调优系统，",
    textEN: "Same agent model, same hardware, same tuning system —",
    highlights: ["Agent 模型", "agent model", "调优系统", "tuning system"],
  },
  {
    startFrame: 9897,
    endFrame: 10097,
    textCN: "在我们的实验中，用 CroqTile 进行调优效果显著好于其他计算核编程语言，",
    textEN:
      "in our experiments, tuning with CroqTile significantly outperforms other kernel languages,",
    highlights: ["CroqTile", "计算核编程语言", "kernel languages"],
  },
  {
    startFrame: 10097,
    endFrame: 10217,
    textCN: "甚至在很多算子的调优上，能超过当前厂商的算子库性能。",
    textEN:
      "and even surpasses vendor library performance on many operators.",
    highlights: ["算子", "operators", "厂商", "vendor library"],
  },
  {
    startFrame: 10217,
    endFrame: 10338,
    textCN: "CroqTile 让生产级别的 AI Agent 调优应用成为可能。",
    textEN: "CroqTile makes production-grade AI Agent tuning a reality.",
    highlights: ["CroqTile", "生产级别", "production-grade", "AI Agent 调优", "AI Agent tuning"],
  },
  // seg6-13 (VO 10346, 134f)
  {
    startFrame: 10346,
    endFrame: 10480,
    textCN: "用 CroqTile，让你的计算核调优更加写意。",
    textEN: "With CroqTile, make your kernel tuning truly effortless.",
    highlights: ["CroqTile", "计算核", "kernel tuning", "写意", "effortless"],
  },
  // seg6-14 removed: "你的编程体验" is now visual-only slogan on back cover

  // ═══ 段 7: 结语 CTA (11172–11471) ═══
  {
    startFrame: 11212,
    endFrame: 11340,
    textCN: "欢迎来到计算编程的新时代。",
    textEN: "Welcome to the new era of compute programming.",
    highlights: ["新时代", "new era"],
  },
  {
    startFrame: 11343,
    endFrame: 11471,
    textCN: "你的性能开发效率，值得被重新定义。",
    textEN:
      "Your kernel development productivity deserves to be redefined.",
    highlights: ["重新定义", "redefined"],
  },
];
