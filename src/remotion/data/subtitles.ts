/**
 * data/subtitles.ts
 * 全部字幕 cue — 基于 SCRIPT-v1.md 旁白
 * startFrame / endFrame 是 FullVideo 的绝对帧号（30fps）
 *
 * 帧号参考 (v2):
 *   段 0  PainPoint        0–438
 *   段 1  IterativeDev     446–1756
 *   段 2  FeatureSpotlight 1757–3166
 *   段 3  PerfChart        3107–3406
 *   段 4  CompileTimeSafety 3407–4306
 *   段 5  DynamicShape     4307–5206
 *   段 6  AINative         5207–9856
 *   段 7  OutroCTA         9857–10156
 */

import type { SubtitleCue } from "../components/Subtitle";

export const SUBTITLES: SubtitleCue[] = [
  // ═══ 段 0: 痛点开场 (0–438) ═══
  {
    startFrame: -7,
    endFrame: 155,
    textCN: "写一个生产级 GPU 计算核，需要多长时间？",
    textEN: "How long does it take to write a production-grade GPU kernel?",
    highlights: ["GPU 计算核", "GPU kernel"],
  },
  {
    startFrame: 158,
    endFrame: 418,
    textCN: "FlashAttention、Blockscale GEMM 这样的算子，顶尖专家也要花上几个星期来实现与调优。",
    textEN:
      "For operators like FlashAttention and Blockscale GEMM, even top experts spend weeks on implementation and tuning.",
    highlights: ["FlashAttention", "几个星期", "weeks"],
  },

  // ═══ 段 1: 迭代开发 + CroqTile 揭晓 (461–1771) ═══
  {
    startFrame: 439,
    endFrame: 589,
    textCN: "这不仅仅是因为实现复杂、代码行数多。",
    textEN:
      "It's not just because the implementation is complex or the code is long.",
    highlights: ["实现复杂", "complex"],
  },
  {
    startFrame: 599,
    endFrame: 947,
    textCN: "而是因为一个生产级计算核，需要经过多轮编写、编译调试、性能剖析、参数调优的完整迭代，才能逐步逼近生产级性能。",
    textEN:
      "A production-grade kernel requires multiple iterations of coding, compile-debugging, profiling, and parameter tuning — each cycle inching closer to production-level performance.",
    highlights: ["多轮", "multiple iterations", "编写", "编译调试", "性能剖析", "参数调优"],
  },
  {
    startFrame: 956,
    endFrame: 1214,
    textCN: "这个过程不仅需要扎实的编程能力，还需要深厚的硬件知识与丰富的性能优化经验。",
    textEN:
      "This process demands not only solid programming skills, but also deep hardware knowledge and extensive optimization experience.",
    highlights: ["编程能力", "硬件知识", "性能优化", "hardware knowledge"],
  },
  {
    startFrame: 1223,
    endFrame: 1362,
    textCN: "这些门槛，大大限制了计算核的开发效率。",
    textEN:
      "These barriers severely limit kernel development efficiency.",
    highlights: ["门槛", "barriers", "开发效率", "efficiency"],
  },
  {
    startFrame: 1371,
    endFrame: 1711,
    textCN: "所以我们造了 CroqTile——新一代 GPU 和 DSA 内核编程语言，5 倍生产力，为 AI 时代而生。",
    textEN:
      "So we built CroqTile — the next-generation GPU and DSA kernel programming language. 5× productivity, designed for the AI era.",
    highlights: ["CroqTile", "5 倍生产力", "5×", "AI 时代", "AI era"],
  },

  // ═══ 段 2A: 更直观的编程抽象 (1747–2766) ═══
  {
    startFrame: 1770,
    endFrame: 2040,
    textCN: "在 CroqTile 里，声明一个张量只需要三件事：内存位置、数据类型、形状。",
    textEN:
      "In CroqTile, declaring a tensor requires only three things: memory specifier, data type, and shape.",
    highlights: ["三件事", "three things", "张量", "tensor"],
  },
  {
    startFrame: 2050,
    endFrame: 2210,
    textCN: "不需要指针，不需要步长，不需要偏移量。",
    textEN: "No raw pointers. No strides. No offset arithmetic.",
    highlights: ["指针", "pointers", "步长", "strides"],
  },
  {
    startFrame: 2230,
    endFrame: 2490,
    textCN: "要从一个大矩阵中取出本次计算需要的小块？你只需要描述它的位置。",
    textEN:
      "To pull a tile out of a large tensor for this iteration? Just describe where it is.",
    highlights: ["描述", "describe"],
  },
  {
    startFrame: 2510,
    endFrame: 2769,
    textCN: "并行结构用同一个 parallel by 关键字统一描述。再也不用手动组合 blockIdx 和 threadIdx。",
    textEN:
      "All parallelism is expressed through a single unified parallel by keyword.",
    highlights: ["parallel by", "blockIdx", "threadIdx"],
  },

  // ═══ 段 2B: 零样板代码 (2770–3159) ═══
  {
    startFrame: 2790,
    endFrame: 2990,
    textCN: "TMA 数据搬运，一行。Tensor Core MMA 计算，一行。",
    textEN: "TMA data movement: one line. Tensor Core MMA: one line.",
    highlights: ["TMA", "MMA", "一行", "one line"],
  },
  {
    startFrame: 3000,
    endFrame: 3159,
    textCN: "CroqTile 总代码量是等效 CUDA 的 40%，但可读性和性能一个都没有丢。",
    textEN:
      "CroqTile uses just 40% of equivalent CUDA code — with no loss in readability or performance.",
    highlights: ["40%", "可读性", "readability", "性能", "performance"],
  },

  // ═══ 段 3: 性能数据 (3160–3459) ═══
  {
    startFrame: 3180,
    endFrame: 3340,
    textCN: "高层语法，厂商级性能。GEMM FP16，CroqTile 比 PyTorch 快 5.3%。",
    textEN:
      "High-level syntax. Vendor-library performance. On FP16 GEMM, CroqTile outperforms PyTorch by 5.3%.",
    highlights: ["5.3%", "471.3 TFLOPS", "PyTorch"],
  },
  {
    startFrame: 3350,
    endFrame: 3459,
    textCN: "这不是近似——这是零成本抽象。",
    textEN: "Not approximate — zero-cost abstraction.",
    highlights: ["零成本抽象", "zero-cost abstraction"],
  },

  // ═══ 段 4: 编译时安全 (3460–4359) ═══
  {
    startFrame: 3480,
    endFrame: 3750,
    textCN: "在 CroqTile 里，shape 不匹配、DMA 越界、类型错误，全部在编译期被拦住。",
    textEN:
      "In CroqTile, shape mismatches, DMA overflows, and type errors are all caught at compile time.",
    highlights: ["编译期", "compile time", "shape 不匹配", "DMA"],
  },
  {
    startFrame: 3760,
    endFrame: 4010,
    textCN: "353 项编译时检查，1,319 项运行时断言——没有一个错误能溜到 GPU dispatch 之后。",
    textEN:
      "353 compile-time checks. 1,319 runtime assertions. Not a single error gets past GPU dispatch.",
    highlights: ["353", "1,319"],
  },
  {
    startFrame: 4020,
    endFrame: 4340,
    textCN: "DMA 类 bug 在 CUDA 里素来难以追踪，CroqTile 直接从语言层面消灭了这类问题。",
    textEN:
      "DMA bugs that haunt CUDA codebases for days — CroqTile eliminates the entire class at the language level.",
    highlights: ["语言层面", "language level"],
  },

  // ═══ 段 5: 动态符号化维度 (4360–5259) ═══
  {
    startFrame: 4380,
    endFrame: 4650,
    textCN: "CroqTile 是同类工具中第一个支持符号化维度的内核语言。",
    textEN:
      "CroqTile is the first kernel language in its class to support symbolic dimensions.",
    highlights: ["符号化维度", "symbolic dimensions", "第一个", "first"],
  },
  {
    startFrame: 4660,
    endFrame: 4910,
    textCN: "一套代码，从小矩阵到 8K×16K，不需要重新编译，不需要模板特化。",
    textEN:
      "One kernel, any shape — from small tiles to 8K×16K matrices. No recompilation. No template specialization.",
    highlights: ["一套代码", "One kernel", "8K×16K"],
  },
  {
    startFrame: 4920,
    endFrame: 5240,
    textCN: "Triton 要求 block size 是编译期常量。CUDA 需要模板元编程。CroqTile 不需要。",
    textEN:
      "Triton requires compile-time constexpr block sizes. CUDA needs template metaprogramming. CroqTile doesn't.",
    highlights: ["Triton", "CUDA", "CroqTile 不需要", "CroqTile doesn't"],
  },

  // ═══ 段 6A: 引子 (5260–5709) ═══
  {
    startFrame: 5280,
    endFrame: 5490,
    textCN: "借助 CroqTile 的这些进步，哪怕是入门级性能工程师，也能独立写出生产级内核。",
    textEN:
      "Thanks to CroqTile's advances, even an entry-level performance engineer can independently produce production-grade kernels.",
    highlights: ["入门级", "entry-level", "生产级", "production-grade"],
  },
  {
    startFrame: 5500,
    endFrame: 5709,
    textCN: "用编程 Agent 搭配 CroqTile，这一切可以再乘以十。因为 CroqTile，从一开始就是为 AI-native 而设计的。",
    textEN:
      "Pair CroqTile with a coding agent, and multiply that by ten. Because CroqTile was designed for AI-native from day one.",
    highlights: ["编程 Agent", "coding agent", "AI-native", "乘以十", "multiply"],
  },

  // ═══ 段 6B: 上下文精简 (5710–6459) ═══
  {
    startFrame: 5730,
    endFrame: 6010,
    textCN: "AI 的工作质量，和它能看到的上下文直接相关。",
    textEN:
      "The quality of AI work is directly tied to how much context it can see.",
    highlights: ["上下文", "context"],
  },
  {
    startFrame: 6020,
    endFrame: 6260,
    textCN: "CroqTile 只需要约 500 个 token，而 CUDA+CuTe 要消耗 2000 到 4000 个 token。",
    textEN:
      "CroqTile takes roughly 500 tokens versus 2,000 to 4,000 in CUDA plus CuTe.",
    highlights: ["500", "2000", "4000", "500 tokens"],
  },
  {
    startFrame: 6270,
    endFrame: 6459,
    textCN: "整个内核永远在上下文窗口里。AI 永远拥有完整的全局视图。",
    textEN:
      "The entire kernel always fits in the context window. The AI always has the full picture.",
    highlights: ["上下文窗口", "context window"],
  },

  // ═══ 段 6C: 零 context 浪费 (6460–7209) ═══
  {
    startFrame: 6480,
    endFrame: 6760,
    textCN: "CroqTile 让每一个逻辑变更，只对应一处代码修改。",
    textEN:
      "CroqTile ensures every logical change maps to exactly one code change site.",
    highlights: ["一处", "one"],
  },
  {
    startFrame: 6770,
    endFrame: 7010,
    textCN: "对 AI 来说，这意味着几乎零 context 浪费。",
    textEN:
      "For AI, this means nearly zero context waste.",
    highlights: ["零 context 浪费", "zero context waste"],
  },
  {
    startFrame: 7020,
    endFrame: 7209,
    textCN: "即便是复杂的结构调整，AI 也能在一步内完成，不会漏改。",
    textEN:
      "Even complex structural changes can be completed in a single step without missing anything.",
    highlights: ["一步", "single step"],
  },

  // ═══ 段 6D: 编译失败率最低 (7210–7959) ═══
  {
    startFrame: 7230,
    endFrame: 7460,
    textCN: "CroqTile 的编译失败率是所有对比 DSL 中最低的——只有 3.5%。",
    textEN:
      "CroqTile has the lowest compile failure rate among all compared DSLs — just 3.5%.",
    highlights: ["3.5%", "最低", "lowest"],
  },
  {
    startFrame: 7470,
    endFrame: 7730,
    textCN: "关键不在于 AI 犯更少的错误，而在于每一个错误都被更快地发现。",
    textEN:
      "The point isn't that AI makes fewer mistakes. It's that every mistake is caught faster.",
    highlights: ["更快地发现", "caught faster"],
  },
  {
    startFrame: 7740,
    endFrame: 7959,
    textCN: "结合 30–40% 配置空间预剪枝，调优循环比 profiler-only 方法快 5 倍。",
    textEN:
      "Combined with 30–40% configuration space pruning, the tuning loop converges 5× faster.",
    highlights: ["5 倍", "5×", "30–40%"],
  },

  // ═══ 段 6E: 额外护栏层 (7960–8859) ═══
  {
    startFrame: 7980,
    endFrame: 8240,
    textCN: "除了编译器护栏，CroqTile 还提供两层额外的 AI 增强层。",
    textEN:
      "Beyond compiler guardrails, CroqTile provides two additional AI enhancement layers.",
    highlights: ["编译器护栏", "compiler guardrails", "AI 增强层"],
  },
  {
    startFrame: 8250,
    endFrame: 8540,
    textCN: "统一 profiler CLI：将 ncu 与其他 DSA profiler 的输出整合成一个统一界面。",
    textEN:
      "Unified profiler CLI — integrating NVIDIA ncu and other DSA profiler outputs into a single interface.",
    highlights: ["统一 profiler CLI", "Unified profiler CLI", "ncu"],
  },
  {
    startFrame: 8550,
    endFrame: 8859,
    textCN: "CroqTile Skills：为编程 Agent 预封装的语法规则、常用模式与代码模板。",
    textEN:
      "CroqTile Skills — pre-packaged syntax rules, common patterns, and code templates for coding agents.",
    highlights: ["CroqTile Skills", "代码模板", "code templates"],
  },

  // ═══ 段 6F: 实测结果 (8860–9909) ═══
  {
    startFrame: 8880,
    endFrame: 9160,
    textCN: "CroqTile 上的 AI agent 能够自发完成复杂的结构代码变更。",
    textEN:
      "AI agents on CroqTile can autonomously make complex structural code changes.",
    highlights: ["AI agent", "结构代码变更", "structural code changes"],
  },
  {
    startFrame: 9170,
    endFrame: 9460,
    textCN: "AI 在 68 次迭代内将吞吐量从 671 提升到 1127 TFLOPS，达到 vendor library 水平。",
    textEN:
      "AI converges in 68 iterations, pushing FP8 sparse GEMM from 671 to 1,127 TFLOPS — matching vendor library performance.",
    highlights: ["671", "1127", "1,127", "68 次", "68 iterations"],
  },
  {
    startFrame: 9470,
    endFrame: 9750,
    textCN: "这开启了一个新的工作范式：AI 调优不再是下游的人工兜底，而是上游的主动探索引擎。",
    textEN:
      "This enables a fundamentally new paradigm: AI tuning as an upstream workflow, not a downstream safety net.",
    highlights: ["新的工作范式", "new paradigm", "上游", "upstream"],
  },
  {
    startFrame: 9760,
    endFrame: 9909,
    textCN: "CroqTile 已经把 AI 推上了驾驶位——这就是 AI-native 的真正含义。",
    textEN:
      "CroqTile has already put AI in the driver's seat — that's what AI-native truly means.",
    highlights: ["驾驶位", "driver's seat", "AI-native"],
  },

  // ═══ 段 7: 结语 CTA (9910–10209) ═══
  {
    startFrame: 9950,
    endFrame: 10209,
    textCN: "欢迎来到计算编程的新时代。你的性能开发效率，值得被重新定义。",
    textEN:
      "Welcome to the new era of compute programming. Your kernel development productivity deserves to be redefined.",
    highlights: ["新时代", "new era", "重新定义", "redefined"],
  },
];
