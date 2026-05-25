"""
generate-voiceover.py
Generates Chinese and English voiceover audio files using edge-tts.
Outputs per-cue MP3 files to public/voiceover/cn/ and public/voiceover/en/.
"""

import asyncio
import os
import subprocess
import tempfile
import edge_tts

try:
    from imageio_ffmpeg import get_ffmpeg_exe
    FFMPEG = get_ffmpeg_exe()
except ImportError:
    FFMPEG = "ffmpeg"

VOICE_CN = "zh-CN-YunxiNeural"
VOICE_EN = "en-GB-RyanNeural"

CUES = [
    # (id, cn_text, en_text)
    # ═══ Seg 0: 痛点开场（前两句）═══
    ("seg0-01", "写一个生产级 GPU 计算核，需要多长时间？", "How long does it take to write a production-grade GPU kernel?"),
    ("seg0-02", "FlashAttention、Blockscale GEMM 这样的算子，顶尖专家也要花上几个星期来实现与调优。", "For operators like FlashAttention and Blockscale GEMM, even top experts spend weeks on implementation and tuning."),

    # ═══ Seg 1: 迭代开发痛苦 + CroqTile 揭晓 ═══
    ("seg1-01", "这不仅仅是因为实现复杂、代码量大。", "It's not just because the implementation is complex or the code is long."),
    ("seg1-02", "而是因为一个生产级计算核，需要经过多轮编写、编译调试、性能剖析、参数调优的完整迭代，才能逐步逼近生产级性能。", "A production-grade kernel requires multiple iterations of coding, compile-debugging, profiling, and parameter tuning — each cycle inching closer to production-level performance."),
    ("seg1-03", "这个过程不仅需要扎实的编程能力，还需要深厚的硬件知识与丰富的性能优化经验。", "This process demands not only solid programming skills, but also deep hardware knowledge and extensive optimization experience."),
    ("seg1-04", "这些门槛，大大限制了计算核的开发效率。", "These barriers severely limit kernel development efficiency."),
    ("seg1-05", "所以我们造了 CroqTile——新一代 GPU 和 DSA 内核编程语言，5 倍生产力，为 AI 时代而生。", "So we built CroqTile — the next-generation GPU and DSA kernel programming language. 5 times productivity, designed for the AI era."),

    ("seg2-01", "传统内核语言如 CUDA，从单个线程的视角编程。每个线程操作一个 buffer 指针加上 offset——你为一个线程写逻辑容易，但很难想象一组线程累积起来的数据全貌。想实现数据块切分？你必须手动拼出所有偏移量。", "Traditional kernel languages like CUDA program from a single thread's view. Each thread works with a buffer pointer plus an offset — writing logic for one thread is easy, but it's hard to picture the accumulated data across a group of threads. Want data blocking? You piece together all the offset math yourself."),
    ("seg2-02", "CroqTile 完全不同。它从宏观角度编程——数据是张量，不是 buffer。subspan 描述子区域，chunkat 按块切片，.at() 定位迭代位置。你描述取哪块，编译器生成所有地址计算。", "CroqTile is fundamentally different. It programs from the macro view — data is a tensor, not a buffer. Subspan describes a sub-region, chunkat slices by block, .at() locates the iteration. You describe what to take — the compiler generates all address math."),
    ("seg2-03", "结果不仅是代码量减少 60%，而且代码变得极其直观——人类工程师和 AI agent 都能一眼读懂内核逻辑。", "The result is not only 60% less code, but code that's super intuitive — both human engineers and AI agents can understand kernel logic at a glance."),

    ("seg3-01", "和其他内核 DSL 相比，CroqTile 在相同计算核实现中展现了最少的代码量。", "Compared to other kernel DSLs, CroqTile shows the minimal lines of code for the same kernel implementation."),
    ("seg3-02", "这种简洁性没有以性能为代价。零成本抽象是我们在语法设计中的第一原则。", "This level of simplicity comes without performance compromise. Zero-cost abstraction is our first design principle."),
    ("seg3-03", "这使得 CroqTile 成为最简单、最直观，同时拥有顶级性能的内核编程语言。", "This makes CroqTile the most simple and intuitive kernel language — with still top-level performance."),

    ("seg4-01", "除了易用性，调试体验也是影响计算核开发效率的重要因素。", "Beyond usability, the debugging experience is a major factor in kernel development efficiency."),
    ("seg4-02", "传统的调优过程经常出现运行时报错——这类 bug 只在 GPU 上实际跑的时候才暴露，定位一个 DMA 越界或 shape 不匹配往往要花上数小时甚至数天。", "Traditional tuning cycles are plagued by runtime errors — bugs that only surface when the GPU actually runs. Tracking down a single DMA overflow or shape mismatch can take hours, even days."),
    ("seg4-03", "而 CroqTile 是当前市场上唯一设计了独立编译模块的新一代计算核编程语言。这使得 CroqTile 具备了更为强劲的代码检查能力。", "CroqTile is the only next-generation kernel language on the market with a purpose-built standalone compiler. This gives CroqTile superior code analysis capabilities."),
    ("seg4-04", "DMA 越界、shape 不匹配、同步错误——这些传统内核开发中最难追踪的 runtime bug，CroqTile 编译器通常在编译期就能优雅地拦截。", "DMA overflows, shape mismatches, sync errors — the hardest runtime bugs to track in traditional kernel development are typically caught elegantly by the CroqTile compiler at compile time."),

    ("seg5-01", "CroqTile 编译器支持多种后端执行设备，可以通过简单的编译器配置，就能将同一份 CroqTile 源码，运行在不同的后端设备上，甚至自定义加速器上，不需要用户进行复杂的迁移与适配。", "The CroqTile compiler supports multiple backend devices. With a simple compiler configuration, the same CroqTile source can run on different backend devices, even custom accelerators, without any complex migration or adaptation."),
    ("seg5-02", "不仅如此，CroqTile 还能让多个设备协同工作。只需增加一层 parallel-by 结构，并标注通过 mpi 分发，CroqTile 编译器就能自动完成对应的宿主机代码和设备端代码的生成和分发，多设备编程与单设备一样简单。", "What's more, CroqTile enables multi-device collaboration. Just add a parallel-by structure and specify mpi dispatch, and the CroqTile compiler automatically generates and distributes the corresponding host code and device code — multi-device programming is as simple as single-device."),

    # ═══ Seg 6: AI-Native (6A→6C→6D→6E→6B→closing) ═══
    # 6A: AI-native intro
    ("seg6-01", "CroqTile 从设计之初就在思考一个问题：怎样让 AI Agent 成为更好的计算核调优工程师？", "From the very beginning, CroqTile was designed around one question: how do we make AI Agent a better kernel tuning engineer?"),
    ("seg6-02", "答案是两件事——让 AI Agent 更容易读懂代码，也更快地得到编译器的反馈。", "The answer comes down to two things — making code easier for AI Agent to read, and making compiler feedback faster."),
    # 6C: Token footprint
    ("seg6-03", "首先是上下文。CroqTile 的代码极其精简，同样的计算核实现，所需的 token 数远低于其他语言。", "First, context. CroqTile's code is extremely concise — the same kernel implementation requires far fewer tokens than other languages."),
    ("seg6-04", "这意味着同样的预算下，AI Agent 可以跑更多轮优化，或者用更小的模型达到同样效果。", "This means with the same budget, AI Agent can run more optimization rounds, or achieve the same results with a smaller model."),
    ("seg6-05", "而且每个逻辑变更只对应很少的代码修改，AI Agent 不会因为要同时改多个位置而出错。", "And every logical change requires only minimal code modifications — AI Agent won't make mistakes from having to modify multiple locations at once."),
    # 6D: Compiler guardrails
    ("seg6-06", "然后是反馈速度。传统语言的错误要等到 GPU 运行时才暴露，定位一个 bug 可能需要几十分钟。", "Then there's feedback speed. In traditional languages, errors only surface at GPU runtime — tracking down a single bug can take tens of minutes."),
    ("seg6-07", "而 CroqTile 在编译期就能拦截绝大部分错误，AI Agent 不需要等待漫长的运行和调试。", "CroqTile catches most errors at compile time, so AI Agent doesn't need to wait through lengthy runs and debugging."),
    ("seg6-08", "配合大量的编译期检查和运行时断言，每一轮 AI Agent 迭代只需几秒。这让 AI Agent 的试错效率提升了一个数量级。", "Combined with extensive compile-time checks and runtime assertions, each AI Agent iteration takes just seconds — an order-of-magnitude improvement in trial-and-error efficiency."),
    # 6E: AI Agent enhancement layers
    ("seg6-09", "在编译器之上，CroqTile 还提供了两层专门为 AI Agent 设计的增强工具。", "On top of the compiler, CroqTile provides two additional AI Agent-specific enhancement layers."),
    ("seg6-10", "统一的性能分析接口，让 AI Agent 直接获取结构化的性能数据，不需要适配不同硬件平台各自的 profiler 格式。", "A unified profiling interface gives AI Agent structured performance data directly, without adapting to each hardware platform's profiler format."),
    ("seg6-11", "以及预封装的编程知识库，让 AI Agent 从第一次尝试就能写出接近最优的代码。", "And a pre-packaged programming knowledge base, so AI Agent writes near-optimal code from the very first attempt."),
    # 6B: Results
    ("seg6-12", "这些设计带来的结果是什么？同样的 Agent 模型、同样的硬件、同样的调优系统，在我们的实验中，用 CroqTile 进行调优效果显著好于其他计算核编程语言，甚至在很多算子的调优上，能超过当前厂商的算子库性能。CroqTile 让生产级别的 AI Agent 调优应用成为可能。", "What do these design choices deliver? Same agent model, same hardware, same tuning system — in our experiments, tuning with CroqTile significantly outperforms other kernel languages, and even surpasses vendor library performance on many operators. CroqTile makes production-grade AI Agent tuning a reality."),
    # Closing
    ("seg6-13", "用 CroqTile，让你的计算核调优更加写意。", "With CroqTile, make your kernel tuning truly effortless."),
    ("seg6-14", "你的编程体验，值得被重新定义。", "Your programming experience deserves to be redefined."),

    ("seg7-01", "欢迎来到计算编程的新时代。你的性能开发效率，值得被重新定义。", "Welcome to the new era of compute programming. Your kernel development productivity deserves to be redefined."),
]


def _normalize_mp3(path: str) -> None:
    """Re-encode to 44.1kHz/128kbps MP3v1 for browser compatibility."""
    fd, tmp = tempfile.mkstemp(suffix=".mp3")
    os.close(fd)
    try:
        subprocess.run(
            [FFMPEG, "-y", "-i", path, "-codec:a", "libmp3lame",
             "-b:a", "128k", "-ar", "44100", tmp],
            check=True, capture_output=True,
        )
        os.replace(tmp, path)
    except (subprocess.CalledProcessError, FileNotFoundError):
        os.unlink(tmp)
        pass  # keep the original if ffmpeg is unavailable


async def generate_all():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cn_dir = os.path.join(base, "public", "voiceover", "cn")
    en_dir = os.path.join(base, "public", "voiceover", "en")
    os.makedirs(cn_dir, exist_ok=True)
    os.makedirs(en_dir, exist_ok=True)

    for cue_id, cn_text, en_text in CUES:
        cn_path = os.path.join(cn_dir, f"{cue_id}.mp3")
        en_path = os.path.join(en_dir, f"{cue_id}.mp3")
        rate = "+0%"

        if not os.path.exists(cn_path):
            print(f"[CN] Generating {cue_id} (rate={rate})...")
            comm = edge_tts.Communicate(cn_text, VOICE_CN, rate=rate)
            await comm.save(cn_path)
            _normalize_mp3(cn_path)
        else:
            print(f"[CN] Skipping {cue_id} (exists)")

        if not os.path.exists(en_path):
            print(f"[EN] Generating {cue_id} (rate={rate})...")
            comm = edge_tts.Communicate(en_text, VOICE_EN, rate=rate)
            await comm.save(en_path)
            _normalize_mp3(en_path)
        else:
            print(f"[EN] Skipping {cue_id} (exists)")

    print(f"\nDone! Generated {len(CUES)} cues × 2 languages")
    print(f"  CN: {cn_dir}")
    print(f"  EN: {en_dir}")


if __name__ == "__main__":
    asyncio.run(generate_all())
