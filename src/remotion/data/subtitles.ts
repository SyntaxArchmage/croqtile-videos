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
 *   段 5  DynamicShape     4872–5771
 *   段 6  AINative         5772–10421
 *   段 7  OutroCTA         10422–10721
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

  // ═══ 段 5: 动态符号化维度 (4872–5771) ═══
  {
    startFrame: 4892,
    endFrame: 5162,
    textCN: "CroqTile 是同类工具中第一个支持符号化维度的内核语言。",
    textEN:
      "CroqTile is the first kernel language in its class to support symbolic dimensions.",
    highlights: ["符号化维度", "symbolic dimensions", "第一个", "first"],
  },
  {
    startFrame: 5172,
    endFrame: 5422,
    textCN: "一套代码，从小矩阵到 8K×16K，不需要重新编译，不需要模板特化。",
    textEN:
      "One kernel, any shape — from small tiles to 8K×16K matrices. No recompilation. No template specialization.",
    highlights: ["一套代码", "One kernel", "8K×16K"],
  },
  {
    startFrame: 5432,
    endFrame: 5752,
    textCN: "Triton 要求 block size 是编译期常量。CUDA 需要模板元编程。CroqTile 不需要。",
    textEN:
      "Triton requires compile-time constexpr block sizes. CUDA needs template metaprogramming. CroqTile doesn't.",
    highlights: [
      "Triton",
      "CUDA",
      "CroqTile 不需要",
      "CroqTile doesn't",
    ],
  },

  // ═══ 段 6A: 引子 (5772–6221) ═══
  {
    startFrame: 5792,
    endFrame: 6002,
    textCN: "借助 CroqTile 的这些进步，哪怕是入门级性能工程师，也能独立写出生产级内核。",
    textEN:
      "Thanks to CroqTile's advances, even an entry-level performance engineer can independently produce production-grade kernels.",
    highlights: [
      "入门级",
      "entry-level",
      "生产级",
      "production-grade",
    ],
  },
  {
    startFrame: 6012,
    endFrame: 6115,
    textCN: "用编程 Agent 搭配 CroqTile，这一切可以再乘以十。",
    textEN:
      "Pair CroqTile with a coding agent, and multiply that by ten.",
    highlights: ["编程 Agent", "coding agent", "乘以十", "multiply"],
  },
  {
    startFrame: 6118,
    endFrame: 6221,
    textCN: "因为 CroqTile，从一开始就是为 AI-native 而设计的。",
    textEN:
      "Because CroqTile was designed for AI-native from day one.",
    highlights: ["AI-native"],
  },

  // ═══ 段 6B: 上下文精简 (6222–6971) ═══
  {
    startFrame: 6242,
    endFrame: 6522,
    textCN: "AI 的工作质量，和它能看到的上下文直接相关。",
    textEN:
      "The quality of AI work is directly tied to how much context it can see.",
    highlights: ["上下文", "context"],
  },
  {
    startFrame: 6532,
    endFrame: 6772,
    textCN: "CroqTile 只需要约 500 个 token，而 CUDA+CuTe 要消耗 2000 到 4000 个 token。",
    textEN:
      "CroqTile takes roughly 500 tokens versus 2,000 to 4,000 in CUDA plus CuTe.",
    highlights: ["500", "2000", "4000", "500 tokens"],
  },
  {
    startFrame: 6782,
    endFrame: 6971,
    textCN: "整个内核永远在上下文窗口里。AI 永远拥有完整的全局视图。",
    textEN:
      "The entire kernel always fits in the context window. The AI always has the full picture.",
    highlights: ["上下文窗口", "context window"],
  },

  // ═══ 段 6C: 零 context 浪费 (6972–7721) ═══
  {
    startFrame: 6992,
    endFrame: 7272,
    textCN: "CroqTile 让每一个逻辑变更，只对应一处代码修改。",
    textEN:
      "CroqTile ensures every logical change maps to exactly one code change site.",
    highlights: ["一处", "one"],
  },
  {
    startFrame: 7282,
    endFrame: 7522,
    textCN: "对 AI 来说，这意味着几乎零 context 浪费。",
    textEN: "For AI, this means nearly zero context waste.",
    highlights: ["零 context 浪费", "zero context waste"],
  },
  {
    startFrame: 7532,
    endFrame: 7721,
    textCN: "即便是复杂的结构调整，AI 也能在一步内完成，不会漏改。",
    textEN:
      "Even complex structural changes can be completed in a single step without missing anything.",
    highlights: ["一步", "single step"],
  },

  // ═══ 段 6D: 编译失败率最低 (7722–8471) ═══
  {
    startFrame: 7742,
    endFrame: 7972,
    textCN: "CroqTile 的编译失败率是所有对比 DSL 中最低的——只有 3.5%。",
    textEN:
      "CroqTile has the lowest compile failure rate among all compared DSLs — just 3.5%.",
    highlights: ["3.5%", "最低", "lowest"],
  },
  {
    startFrame: 7982,
    endFrame: 8242,
    textCN: "关键不在于 AI 犯更少的错误，而在于每一个错误都被更快地发现。",
    textEN:
      "The point isn't that AI makes fewer mistakes. It's that every mistake is caught faster.",
    highlights: ["更快地发现", "caught faster"],
  },
  {
    startFrame: 8252,
    endFrame: 8471,
    textCN: "结合 30–40% 配置空间预剪枝，调优循环比 profiler-only 方法快 5 倍。",
    textEN:
      "Combined with 30–40% configuration space pruning, the tuning loop converges 5× faster.",
    highlights: ["5 倍", "5×", "30–40%"],
  },

  // ═══ 段 6E: 额外护栏层 (8472–9371) ═══
  {
    startFrame: 8492,
    endFrame: 8752,
    textCN: "除了编译器护栏，CroqTile 还提供两层额外的 AI 增强层。",
    textEN:
      "Beyond compiler guardrails, CroqTile provides two additional AI enhancement layers.",
    highlights: ["编译器护栏", "compiler guardrails", "AI 增强层"],
  },
  {
    startFrame: 8762,
    endFrame: 9052,
    textCN: "统一 profiler CLI：将 ncu 与其他 DSA profiler 的输出整合成一个统一界面。",
    textEN:
      "Unified profiler CLI — integrating NVIDIA ncu and other DSA profiler outputs into a single interface.",
    highlights: ["统一 profiler CLI", "Unified profiler CLI", "ncu"],
  },
  {
    startFrame: 9062,
    endFrame: 9371,
    textCN: "CroqTile Skills：为编程 Agent 预封装的语法规则、常用模式与代码模板。",
    textEN:
      "CroqTile Skills — pre-packaged syntax rules, common patterns, and code templates for coding agents.",
    highlights: ["CroqTile Skills", "代码模板", "code templates"],
  },

  // ═══ 段 6F: 实测结果 (9372–10421) ═══
  {
    startFrame: 9392,
    endFrame: 9672,
    textCN: "CroqTile 上的 AI agent 能够自发完成复杂的结构代码变更。",
    textEN:
      "AI agents on CroqTile can autonomously make complex structural code changes.",
    highlights: [
      "AI agent",
      "结构代码变更",
      "structural code changes",
    ],
  },
  {
    startFrame: 9682,
    endFrame: 9972,
    textCN: "AI 在 68 次迭代内将吞吐量从 671 提升到 1127 TFLOPS，达到 vendor library 水平。",
    textEN:
      "AI converges in 68 iterations, pushing FP8 sparse GEMM from 671 to 1,127 TFLOPS — matching vendor library performance.",
    highlights: ["671", "1127", "1,127", "68 次", "68 iterations"],
  },
  {
    startFrame: 9982,
    endFrame: 10262,
    textCN: "这开启了一个新的工作范式：AI 调优不再是下游的人工兜底，而是上游的主动探索引擎。",
    textEN:
      "This enables a fundamentally new paradigm: AI tuning as an upstream workflow, not a downstream safety net.",
    highlights: ["新的工作范式", "new paradigm", "上游", "upstream"],
  },
  {
    startFrame: 10272,
    endFrame: 10421,
    textCN: "CroqTile 已经把 AI 推上了驾驶位——这就是 AI-native 的真正含义。",
    textEN:
      "CroqTile has already put AI in the driver's seat — that's what AI-native truly means.",
    highlights: ["驾驶位", "driver's seat", "AI-native"],
  },

  // ═══ 段 7: 结语 CTA (10422–10721) ═══
  {
    startFrame: 10462,
    endFrame: 10590,
    textCN: "欢迎来到计算编程的新时代。",
    textEN: "Welcome to the new era of compute programming.",
    highlights: ["新时代", "new era"],
  },
  {
    startFrame: 10593,
    endFrame: 10721,
    textCN: "你的性能开发效率，值得被重新定义。",
    textEN:
      "Your kernel development productivity deserves to be redefined.",
    highlights: ["重新定义", "redefined"],
  },
];
