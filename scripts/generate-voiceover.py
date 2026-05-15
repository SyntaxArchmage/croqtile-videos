"""
generate-voiceover.py
Generates Chinese and English voiceover audio files using edge-tts.
Outputs per-cue MP3 files to public/voiceover/cn/ and public/voiceover/en/.
"""

import asyncio
import os
import edge_tts

VOICE_CN = "zh-CN-YunxiNeural"
VOICE_EN = "en-GB-RyanNeural"

CUES = [
    # (id, cn_text, en_text)
    # ═══ Seg 0: 痛点开场（前两句）═══
    ("seg0-01", "写一个生产级 GPU 计算核，需要多长时间？", "How long does it take to write a production-grade GPU kernel?"),
    ("seg0-02", "FlashAttention、Blockscale Gem 这样的算子，顶尖专家也要花上几个星期来实现与调优。", "For operators like FlashAttention and Blockscale Gem, even top experts spend weeks on implementation and tuning."),

    # ═══ Seg 1: 迭代开发痛苦 + CroqTile 揭晓 ═══
    ("seg1-01", "这不仅仅是因为实现复杂、代码行数多。", "It's not just because the implementation is complex or the code is long."),
    ("seg1-02", "而是因为一个生产级计算核，需要经过多轮编写、编译调试、性能剖析、参数调优的完整迭代，才能逐步逼近生产级性能。", "A production-grade kernel requires multiple iterations of coding, compile-debugging, profiling, and parameter tuning — each cycle inching closer to production-level performance."),
    ("seg1-03", "这个过程不仅需要扎实的编程能力，还需要深厚的硬件知识与丰富的性能优化经验。", "This process demands not only solid programming skills, but also deep hardware knowledge and extensive optimization experience."),
    ("seg1-04", "这些门槛，大大限制了计算核的开发效率。", "These barriers severely limit kernel development efficiency."),
    ("seg1-05", "所以我们造了 CroqTile——新一代 GPU 和 DSA 内核编程语言，5 倍生产力，为 AI 时代而生。", "So we built CroqTile — the next-generation GPU and DSA kernel programming language. 5 times productivity, designed for the AI era."),

    ("seg2a-01", "在 CroqTile 里，声明一个张量只需要三件事：内存位置、数据类型、形状。", "In CroqTile, declaring a tensor requires only three things: memory specifier, data type, and shape."),
    ("seg2a-02", "不需要指针，不需要步长，不需要偏移量。", "No raw pointers. No strides. No offset arithmetic."),
    ("seg2a-03", "要从一个大矩阵中取出本次计算需要的小块？你只需要描述它的位置。", "To pull a tile out of a large tensor for this iteration? Just describe where it is."),
    ("seg2a-04", "并行结构用同一个 parallel by 关键字统一描述。再也不用手动组合 blockIdx 和 threadIdx。", "All parallelism is expressed through a single unified parallel by keyword."),

    ("seg2b-01", "TMA 数据搬运，一行。Tensor Core MMA 计算，一行。", "TMA data movement: one line. Tensor Core MMA: one line."),
    ("seg2b-02", "CroqTile 总代码量是等效 CUDA 的 40%，但可读性和性能一个都没有丢。", "CroqTile uses just 40% of equivalent CUDA code — with no loss in readability or performance."),

    ("seg3-01", "高层语法，厂商级性能。GEMM FP16，CroqTile 比 PyTorch 快 5.3%。", "High-level syntax. Vendor-library performance. On FP16 GEMM, CroqTile outperforms PyTorch by 5.3%."),
    ("seg3-02", "这不是近似——这是零成本抽象。", "Not approximate — zero-cost abstraction."),

    ("seg4-01", "在 CroqTile 里，shape 不匹配、DMA 越界、类型错误，全部在编译期被拦住。", "In CroqTile, shape mismatches, DMA overflows, and type errors are all caught at compile time."),
    ("seg4-02", "353 项编译时检查，1319 项运行时断言——没有一个错误能溜到 GPU dispatch 之后。", "353 compile-time checks. 1,319 runtime assertions. Not a single error gets past GPU dispatch."),
    ("seg4-03", "DMA 类 bug 在 CUDA 里素来难以追踪，CroqTile 直接从语言层面消灭了这类问题。", "DMA bugs that haunt CUDA codebases for days — CroqTile eliminates the entire class at the language level."),

    ("seg5-01", "CroqTile 是同类工具中第一个支持符号化维度的内核语言。", "CroqTile is the first kernel language in its class to support symbolic dimensions."),
    ("seg5-02", "一套代码，从小矩阵到 8K 乘 16K，不需要重新编译，不需要模板特化。", "One kernel, any shape — from small tiles to 8K times 16K matrices. No recompilation. No template specialization."),
    ("seg5-03", "Triton 要求 block size 是编译期常量。CUDA 需要模板元编程。CroqTile 不需要。", "Triton requires compile-time constexpr block sizes. CUDA needs template metaprogramming. CroqTile doesn't."),

    ("seg6a-01", "借助 CroqTile 的这些进步，哪怕是入门级性能工程师，也能独立写出生产级内核。", "Thanks to CroqTile's advances, even an entry-level performance engineer can independently produce production-grade kernels."),
    ("seg6a-02", "用编程 Agent 搭配 CroqTile，这一切可以再乘以十。因为 CroqTile，从一开始就是为 AI-native 而设计的。", "Pair CroqTile with a coding agent, and multiply that by ten. Because CroqTile was designed for AI-native from day one."),

    ("seg6b-01", "AI 的工作质量，和它能看到的上下文直接相关。", "The quality of AI work is directly tied to how much context it can see."),
    ("seg6b-02", "CroqTile 只需要约 500 个 token，而 CUDA 加 CuTe 要消耗 2000 到 4000 个 token。", "CroqTile takes roughly 500 tokens versus 2,000 to 4,000 in CUDA plus CuTe."),
    ("seg6b-03", "整个内核永远在上下文窗口里。AI 永远拥有完整的全局视图。", "The entire kernel always fits in the context window. The AI always has the full picture."),

    ("seg6c-01", "CroqTile 让每一个逻辑变更，只对应一处代码修改。", "CroqTile ensures every logical change maps to exactly one code change site."),
    ("seg6c-02", "对 AI 来说，这意味着几乎零 context 浪费。", "For AI, this means nearly zero context waste."),
    ("seg6c-03", "即便是复杂的结构调整，AI 也能在一步内完成，不会漏改。", "Even complex structural changes can be completed in a single step without missing anything."),

    ("seg6d-01", "CroqTile 的编译失败率是所有对比 DSL 中最低的——只有 3.5%。", "CroqTile has the lowest compile failure rate among all compared DSLs — just 3.5%."),
    ("seg6d-02", "关键不在于 AI 犯更少的错误，而在于每一个错误都被更快地发现。", "The point isn't that AI makes fewer mistakes. It's that every mistake is caught faster."),
    ("seg6d-03", "结合 30 到 40% 配置空间预剪枝，调优循环比 profiler-only 方法快 5 倍。", "Combined with 30 to 40% configuration space pruning, the tuning loop converges 5 times faster."),

    ("seg6e-01", "除了编译器护栏，CroqTile 还提供两层额外的 AI 增强层。", "Beyond compiler guardrails, CroqTile provides two additional AI enhancement layers."),
    ("seg6e-02", "统一 profiler CLI：将 ncu 与其他 DSA profiler 的输出整合成一个统一界面。", "Unified profiler CLI — integrating NVIDIA ncu and other DSA profiler outputs into a single interface."),
    ("seg6e-03", "CroqTile Skills：为编程 Agent 预封装的语法规则、常用模式与代码模板。", "CroqTile Skills — pre-packaged syntax rules, common patterns, and code templates for coding agents."),

    ("seg6f-01", "CroqTile 上的 AI agent 能够自发完成复杂的结构代码变更。", "AI agents on CroqTile can autonomously make complex structural code changes."),
    ("seg6f-02", "AI 在 68 次迭代内将吞吐量从 671 提升到 1127 TFLOPS，达到 vendor library 水平。", "AI converges in 68 iterations, pushing FP8 sparse GEMM from 671 to 1,127 TFLOPS — matching vendor library performance."),
    ("seg6f-03", "这开启了一个新的工作范式：AI 调优不再是下游的人工兜底，而是上游的主动探索引擎。", "This enables a fundamentally new paradigm: AI tuning as an upstream workflow, not a downstream safety net."),
    ("seg6f-04", "CroqTile 已经把 AI 推上了驾驶位——这就是 AI-native 的真正含义。", "CroqTile has already put AI in the driver's seat — that's what AI-native truly means."),

    ("seg7-01", "欢迎来到计算编程的新时代。你的性能开发效率，值得被重新定义。", "Welcome to the new era of compute programming. Your kernel development productivity deserves to be redefined."),
]


async def generate_all():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cn_dir = os.path.join(base, "public", "voiceover", "cn")
    en_dir = os.path.join(base, "public", "voiceover", "en")
    os.makedirs(cn_dir, exist_ok=True)
    os.makedirs(en_dir, exist_ok=True)

    for cue_id, cn_text, en_text in CUES:
        cn_path = os.path.join(cn_dir, f"{cue_id}.mp3")
        en_path = os.path.join(en_dir, f"{cue_id}.mp3")

        if not os.path.exists(cn_path):
            print(f"[CN] Generating {cue_id}...")
            comm = edge_tts.Communicate(cn_text, VOICE_CN, rate="-5%")
            await comm.save(cn_path)
        else:
            print(f"[CN] Skipping {cue_id} (exists)")

        if not os.path.exists(en_path):
            print(f"[EN] Generating {cue_id}...")
            comm = edge_tts.Communicate(en_text, VOICE_EN, rate="-5%")
            await comm.save(en_path)
        else:
            print(f"[EN] Skipping {cue_id} (exists)")

    print(f"\nDone! Generated {len(CUES)} cues × 2 languages")
    print(f"  CN: {cn_dir}")
    print(f"  EN: {en_dir}")


if __name__ == "__main__":
    asyncio.run(generate_all())
