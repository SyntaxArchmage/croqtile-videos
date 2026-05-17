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
 *   段 5  DynamicShape     4442–5341
 *   段 6  AINative         5342–9991
 *   段 7  OutroCTA         9992–10291
 */

import type { SubtitleCue } from "../components/Subtitle";

export const SUBTITLES: SubtitleCue[] = [
  // ═══ 段 0: 痛点开场 (0–438) ═══
  {
    startFrame: 0,
    endFrame: 162,
    textCN: "写一个生产级 GPU 计算核，需要多长时间？",
    textEN: "How long does it take to write a production-grade GPU kernel?",
    highlights: ["GPU 计算核", "GPU kernel"],
  },
  {
    startFrame: 165,
    endFrame: 425,
    textCN: "FlashAttention、Blockscale GEMM 这样的算子，顶尖专家也要花上几个星期来实现与调优。",
    textEN:
      "For operators like FlashAttention and Blockscale GEMM, even top experts spend weeks on implementation and tuning.",
    highlights: ["FlashAttention", "几个星期", "weeks"],
  },

  // ═══ 段 1: 迭代开发 + CroqTile 揭晓 (439–1831) ═══
  {
    startFrame: 439,
    endFrame: 602,
    textCN: "这不仅仅是因为实现复杂、代码行数多。",
    textEN:
      "It's not just because the implementation is complex or the code is long.",
    highlights: ["实现复杂", "complex"],
  },
  {
    startFrame: 605,
    endFrame: 993,
    textCN: "而是因为一个生产级计算核，需要经过多轮编写、编译调试、性能剖析、参数调优的完整迭代，才能逐步逼近生产级性能。",
    textEN:
      "A production-grade kernel requires multiple iterations of coding, compile-debugging, profiling, and parameter tuning — each cycle inching closer to production-level performance.",
    highlights: ["多轮", "multiple iterations", "编写", "编译调试", "性能剖析", "参数调优"],
  },
  {
    startFrame: 996,
    endFrame: 1284,
    textCN: "这个过程不仅需要扎实的编程能力，还需要深厚的硬件知识与丰富的性能优化经验。",
    textEN:
      "This process demands not only solid programming skills, but also deep hardware knowledge and extensive optimization experience.",
    highlights: ["编程能力", "硬件知识", "性能优化", "hardware knowledge"],
  },
  {
    startFrame: 1287,
    endFrame: 1430,
    textCN: "这些门槛，大大限制了计算核的开发效率。",
    textEN:
      "These barriers severely limit kernel development efficiency.",
    highlights: ["门槛", "barriers", "开发效率", "efficiency"],
  },
  {
    startFrame: 1433,
    endFrame: 1812,
    textCN: "所以我们造了 CroqTile——新一代 GPU 和 DSA 内核编程语言，5 倍生产力，为 AI 时代而生。",
    textEN:
      "So we built CroqTile — the next-generation GPU and DSA kernel programming language. 5× productivity, designed for the AI era.",
    highlights: ["CroqTile", "5 倍生产力", "5×", "AI 时代", "AI era"],
  },

  // ═══ 段 2: 简单易用 — thread-view vs tensor-view (1832–3221) ═══
  {
    startFrame: 1832,
    endFrame: 2342,
    textCN: "传统内核语言如 CUDA、OpenCL，从线程视角编程。每个线程操作 buffer 和 offset，手动计算内存地址。想实现 data blocking？你必须拼出所有偏移量。",
    textEN:
      "Traditional kernel languages like CUDA and OpenCL program from the thread's view. Each thread works with raw buffers and offsets, manually computing memory addresses. Want data blocking? You piece together all the offset math yourself.",
    highlights: ["buffer", "offset", "data blocking", "线程", "thread"],
  },
  {
    startFrame: 2342,
    endFrame: 2932,
    textCN: "CroqTile 完全不同。它从宏观角度编程——数据是张量，不是 buffer。subspan 描述子区域，chunkat 按块切片，.at() 定位迭代位置。你描述取哪块，编译器生成所有地址计算。",
    textEN:
      "CroqTile is fundamentally different. It programs from the macro view — data is a tensor, not a buffer. Subspan describes a sub-region, chunkat slices by block, .at() locates the iteration. You describe what to take — the compiler generates all address math.",
    highlights: ["subspan", "chunkat", ".at()", "张量", "tensor", "宏观"],
  },
  {
    startFrame: 2932,
    endFrame: 3222,
    textCN: "结果不仅是代码量减少 60%，而且代码变得极其直观——人类工程师和 AI agent 都能一眼读懂内核逻辑。",
    textEN:
      "The result is not only 60% less code, but code that's super intuitive — both human engineers and AI agents can understand kernel logic at a glance.",
    highlights: ["60%", "直观", "intuitive", "AI agent"],
  },

  // ═══ 段 3: 性能数据 (3222–3971) ═══
  {
    startFrame: 3222,
    endFrame: 3451,
    textCN: "和其他内核 DSL 相比，CroqTile 在相同计算核实现中展现了最少的代码量。",
    textEN:
      "Compared to other kernel DSLs, CroqTile shows the minimal lines of code for the same kernel implementation.",
    highlights: ["DSL", "最少的代码量", "minimal lines of code"],
  },
  {
    startFrame: 3472,
    endFrame: 3729,
    textCN: "这种简洁性没有以性能为代价。零成本抽象是我们在语法设计中的第一原则。",
    textEN:
      "This level of simplicity comes without performance compromise. Zero-cost abstraction is our first design principle.",
    highlights: ["零成本抽象", "zero-cost abstraction", "第一原则", "first design principle"],
  },
  {
    startFrame: 3722,
    endFrame: 3972,
    textCN: "这使得 CroqTile 成为最简单、最直观，同时拥有顶级性能的内核编程语言。",
    textEN:
      "This makes CroqTile the most simple and intuitive kernel language — with still top-level performance.",
    highlights: ["最简单", "most simple", "顶级性能", "top-level performance"],
  },

  // ═══ 段 4: 编译时安全 (3542–4441) ═══
  {
    startFrame: 3562,
    endFrame: 3832,
    textCN: "在 CroqTile 里，shape 不匹配、DMA 越界、类型错误，全部在编译期被拦住。",
    textEN:
      "In CroqTile, shape mismatches, DMA overflows, and type errors are all caught at compile time.",
    highlights: ["编译期", "compile time", "shape 不匹配", "DMA"],
  },
  {
    startFrame: 3842,
    endFrame: 4092,
    textCN: "353 项编译时检查，1,319 项运行时断言——没有一个错误能溜到 GPU dispatch 之后。",
    textEN:
      "353 compile-time checks. 1,319 runtime assertions. Not a single error gets past GPU dispatch.",
    highlights: ["353", "1,319"],
  },
  {
    startFrame: 4102,
    endFrame: 4422,
    textCN: "DMA 类 bug 在 CUDA 里素来难以追踪，CroqTile 直接从语言层面消灭了这类问题。",
    textEN:
      "DMA bugs that haunt CUDA codebases for days — CroqTile eliminates the entire class at the language level.",
    highlights: ["语言层面", "language level"],
  },

  // ═══ 段 5: 动态符号化维度 (4442–5341) ═══
  {
    startFrame: 4462,
    endFrame: 4732,
    textCN: "CroqTile 是同类工具中第一个支持符号化维度的内核语言。",
    textEN:
      "CroqTile is the first kernel language in its class to support symbolic dimensions.",
    highlights: ["符号化维度", "symbolic dimensions", "第一个", "first"],
  },
  {
    startFrame: 4742,
    endFrame: 4992,
    textCN: "一套代码，从小矩阵到 8K×16K，不需要重新编译，不需要模板特化。",
    textEN:
      "One kernel, any shape — from small tiles to 8K×16K matrices. No recompilation. No template specialization.",
    highlights: ["一套代码", "One kernel", "8K×16K"],
  },
  {
    startFrame: 5002,
    endFrame: 5322,
    textCN: "Triton 要求 block size 是编译期常量。CUDA 需要模板元编程。CroqTile 不需要。",
    textEN:
      "Triton requires compile-time constexpr block sizes. CUDA needs template metaprogramming. CroqTile doesn't.",
    highlights: ["Triton", "CUDA", "CroqTile 不需要", "CroqTile doesn't"],
  },

  // ═══ 段 6A: 引子 (5342–5791) ═══
  {
    startFrame: 5362,
    endFrame: 5572,
    textCN: "借助 CroqTile 的这些进步，哪怕是入门级性能工程师，也能独立写出生产级内核。",
    textEN:
      "Thanks to CroqTile's advances, even an entry-level performance engineer can independently produce production-grade kernels.",
    highlights: ["入门级", "entry-level", "生产级", "production-grade"],
  },
  {
    startFrame: 5582,
    endFrame: 5791,
    textCN: "用编程 Agent 搭配 CroqTile，这一切可以再乘以十。因为 CroqTile，从一开始就是为 AI-native 而设计的。",
    textEN:
      "Pair CroqTile with a coding agent, and multiply that by ten. Because CroqTile was designed for AI-native from day one.",
    highlights: ["编程 Agent", "coding agent", "AI-native", "乘以十", "multiply"],
  },

  // ═══ 段 6B: 上下文精简 (5792–6541) ═══
  {
    startFrame: 5812,
    endFrame: 6092,
    textCN: "AI 的工作质量，和它能看到的上下文直接相关。",
    textEN:
      "The quality of AI work is directly tied to how much context it can see.",
    highlights: ["上下文", "context"],
  },
  {
    startFrame: 6102,
    endFrame: 6342,
    textCN: "CroqTile 只需要约 500 个 token，而 CUDA+CuTe 要消耗 2000 到 4000 个 token。",
    textEN:
      "CroqTile takes roughly 500 tokens versus 2,000 to 4,000 in CUDA plus CuTe.",
    highlights: ["500", "2000", "4000", "500 tokens"],
  },
  {
    startFrame: 6352,
    endFrame: 6541,
    textCN: "整个内核永远在上下文窗口里。AI 永远拥有完整的全局视图。",
    textEN:
      "The entire kernel always fits in the context window. The AI always has the full picture.",
    highlights: ["上下文窗口", "context window"],
  },

  // ═══ 段 6C: 零 context 浪费 (6542–7291) ═══
  {
    startFrame: 6562,
    endFrame: 6842,
    textCN: "CroqTile 让每一个逻辑变更，只对应一处代码修改。",
    textEN:
      "CroqTile ensures every logical change maps to exactly one code change site.",
    highlights: ["一处", "one"],
  },
  {
    startFrame: 6852,
    endFrame: 7092,
    textCN: "对 AI 来说，这意味着几乎零 context 浪费。",
    textEN:
      "For AI, this means nearly zero context waste.",
    highlights: ["零 context 浪费", "zero context waste"],
  },
  {
    startFrame: 7102,
    endFrame: 7291,
    textCN: "即便是复杂的结构调整，AI 也能在一步内完成，不会漏改。",
    textEN:
      "Even complex structural changes can be completed in a single step without missing anything.",
    highlights: ["一步", "single step"],
  },

  // ═══ 段 6D: 编译失败率最低 (7292–8041) ═══
  {
    startFrame: 7312,
    endFrame: 7542,
    textCN: "CroqTile 的编译失败率是所有对比 DSL 中最低的——只有 3.5%。",
    textEN:
      "CroqTile has the lowest compile failure rate among all compared DSLs — just 3.5%.",
    highlights: ["3.5%", "最低", "lowest"],
  },
  {
    startFrame: 7552,
    endFrame: 7812,
    textCN: "关键不在于 AI 犯更少的错误，而在于每一个错误都被更快地发现。",
    textEN:
      "The point isn't that AI makes fewer mistakes. It's that every mistake is caught faster.",
    highlights: ["更快地发现", "caught faster"],
  },
  {
    startFrame: 7822,
    endFrame: 8041,
    textCN: "结合 30–40% 配置空间预剪枝，调优循环比 profiler-only 方法快 5 倍。",
    textEN:
      "Combined with 30–40% configuration space pruning, the tuning loop converges 5× faster.",
    highlights: ["5 倍", "5×", "30–40%"],
  },

  // ═══ 段 6E: 额外护栏层 (8042–8941) ═══
  {
    startFrame: 8062,
    endFrame: 8322,
    textCN: "除了编译器护栏，CroqTile 还提供两层额外的 AI 增强层。",
    textEN:
      "Beyond compiler guardrails, CroqTile provides two additional AI enhancement layers.",
    highlights: ["编译器护栏", "compiler guardrails", "AI 增强层"],
  },
  {
    startFrame: 8332,
    endFrame: 8622,
    textCN: "统一 profiler CLI：将 ncu 与其他 DSA profiler 的输出整合成一个统一界面。",
    textEN:
      "Unified profiler CLI — integrating NVIDIA ncu and other DSA profiler outputs into a single interface.",
    highlights: ["统一 profiler CLI", "Unified profiler CLI", "ncu"],
  },
  {
    startFrame: 8632,
    endFrame: 8941,
    textCN: "CroqTile Skills：为编程 Agent 预封装的语法规则、常用模式与代码模板。",
    textEN:
      "CroqTile Skills — pre-packaged syntax rules, common patterns, and code templates for coding agents.",
    highlights: ["CroqTile Skills", "代码模板", "code templates"],
  },

  // ═══ 段 6F: 实测结果 (8942–9991) ═══
  {
    startFrame: 8962,
    endFrame: 9242,
    textCN: "CroqTile 上的 AI agent 能够自发完成复杂的结构代码变更。",
    textEN:
      "AI agents on CroqTile can autonomously make complex structural code changes.",
    highlights: ["AI agent", "结构代码变更", "structural code changes"],
  },
  {
    startFrame: 9252,
    endFrame: 9542,
    textCN: "AI 在 68 次迭代内将吞吐量从 671 提升到 1127 TFLOPS，达到 vendor library 水平。",
    textEN:
      "AI converges in 68 iterations, pushing FP8 sparse GEMM from 671 to 1,127 TFLOPS — matching vendor library performance.",
    highlights: ["671", "1127", "1,127", "68 次", "68 iterations"],
  },
  {
    startFrame: 9552,
    endFrame: 9832,
    textCN: "这开启了一个新的工作范式：AI 调优不再是下游的人工兜底，而是上游的主动探索引擎。",
    textEN:
      "This enables a fundamentally new paradigm: AI tuning as an upstream workflow, not a downstream safety net.",
    highlights: ["新的工作范式", "new paradigm", "上游", "upstream"],
  },
  {
    startFrame: 9842,
    endFrame: 9991,
    textCN: "CroqTile 已经把 AI 推上了驾驶位——这就是 AI-native 的真正含义。",
    textEN:
      "CroqTile has already put AI in the driver's seat — that's what AI-native truly means.",
    highlights: ["驾驶位", "driver's seat", "AI-native"],
  },

  // ═══ 段 7: 结语 CTA (9992–10291) ═══
  {
    startFrame: 10032,
    endFrame: 10291,
    textCN: "欢迎来到计算编程的新时代。你的性能开发效率，值得被重新定义。",
    textEN:
      "Welcome to the new era of compute programming. Your kernel development productivity deserves to be redefined.",
    highlights: ["新时代", "new era", "重新定义", "redefined"],
  },
];
