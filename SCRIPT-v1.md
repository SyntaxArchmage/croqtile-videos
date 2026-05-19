# CroqTile 视频脚本 v1

## 元信息

| 项目 | 内容 |
|------|------|
| 版本 | v1 草稿 |
| 时长 | 5 分 30 秒（330 秒） |
| 用途 | 技术演示 / Developer Demo |
| 语言 | 双语（中/英对照） |
| 风格 | 情感开场 + 功能技术展示（Vibero 风格） |
| CTA 目标 | https://lancerlab.github.io/croqtile-tutorial/ |

## 参考材料

- 旁白底稿：`../croqtile-slides/video-gen/narration.json`
- 幻灯片结构：`../croqtile-slides/decks/croqtile-intro/index.html`
- 网站特性组件：`../croqtile-website/src/components/landing/`
- 网站 i18n 文案：`../croqtile-website/messages/cn.json`（中）& `en.json`（英）
- Vibero 风格参考：`../croqtile-source-read/VIBERO-SCRIPT-REF.md`
- 论文背景数据：`../croqtile-tuner-paper/paper/main.tex`

---

## 脚本正文

> 格式说明：
> - `[画面]` — 当前镜头/动画描述
> - `[中]` — 中文旁白
> - `[英]` — 英文旁白
> - `⏱` — 时间戳（累计）
> - 代码块标注语言类型（`choreo` = CroqTile DSL，`cuda` = CUDA C++）

---

### 第 0 段 · 痛点开场（前两句）

**⏱ 0:00 – 0:15 | 15 秒 (439 帧)  voiceover: Ryan (en-GB) + YunxiNeural (cn), rate=-15%**

---

**[画面]**
黑色背景，极简风格。屏幕中央打字机效果出现核心问题。
随后 CUDA 代码碎片从四面涌入，逐渐组装成一个完整的代码块（macOS 风格代码窗口，含行号、文件名 flash_attention_kernel.cu）。
代码颜色使用真实 CUDA 语法高亮（dark 主题）。

**[中]**
写一个生产级 GPU 计算核，需要多长时间？

FlashAttention、Blockscale Gemm 这样的算子，顶尖专家也要花上几个星期来实现与调优。

**[英]**
How long does it take to write a production-grade GPU kernel?

For operators like FlashAttention and Blockscale Gemm, even top experts spend weeks on implementation and tuning.

---

### 第 1 段 · 迭代开发的痛苦 + 解法揭晓

**⏱ 0:15 – 1:01 | 46 秒 (1393 帧)**

---

**[画面]** *(每句话的动画严格与语音内容对齐)*

**句 1 — seg1-01 (0–163f, 5.4s)**
*"这不仅仅是因为实现复杂、代码行数多。"*

画面从 Seg 0 末尾（代码框）平滑暗转。屏幕中央出现一段简化的 CUDA 代码片段（约 8-10 行），
代码在 0–60f 内快速打字出现。代码行数在右下角显示 `280 lines`（灰色，小字）。
60–163f: 代码整体略缩小并向左移，右侧浮现一个大写的 `✕` 符号和文字 "Not just complexity"（或对应的视觉暗示：划线删除 `280 lines`），
表达"不仅仅是因为复杂"。整体色调冷灰，情绪克制。

**句 2 — seg1-02 (166–554f, 12.9s)**
*"而是因为一个生产级计算核，需要经过多轮编写、编译调试、性能剖析、参数调优的完整迭代"*

画面核心：环形迭代流程图（Code → Debug → Profile → Tune），占据屏幕中央 70%。
- 166–220f: 四个阶段节点依次从透明淡入，每个节点带图标和标签。环形连接线在节点之间出现。
- 220–300f: 第一轮迭代开始。高亮光环沿 Code → Debug → Profile → Tune 顺序旋转一圈。
  中央显示 `Iteration 1`。每经过 Debug 节点时，有短暂的红色错误闪烁（`✕ CUDA error`）。
- 300–420f: 迭代加速。Iteration 2, 3, 4... 数字递增。旋转速度逐渐加快。
  每轮都有随机位置的错误消息闪烁（shape mismatch, DMA overflow, bank conflict 等）。
- 420–554f: 继续加速到 Iteration 8-10。右下角开始出现一条缓慢爬升的性能曲线（TFLOPS），
  曲线有锯齿波动，暗示每轮迭代只带来微小进步。上方出现虚线目标线 `target`。

**句 3 — seg1-03 (557–845f, 9.6s)**
*"这个过程不仅需要扎实的编程能力，还需要深厚的硬件知识与丰富的性能优化经验。"*

迭代环继续缓慢旋转（背景化，透明度降低到 40%）。
前景分三波浮现三组关键词（与语音节奏对齐）：
- 557–640f: 屏幕左上角浮现 `🖥 Programming Skills`，带代码图标，字体大号，amber 色。
- 640–730f: 屏幕右上角浮现 `🔧 Hardware Knowledge`，带芯片图标，amber 色。
- 730–845f: 屏幕底部中央浮现 `📊 Optimization Experience`，带图表图标，amber 色。
三组词形成三角布局，每组出现时有 scale-in + glow 动画。
暗示这些都是 **门槛**。

**句 4 — seg1-04 (848–991f, 4.8s)**
*"这些门槛，大大限制了计算核的开发效率。"*

三组关键词向屏幕中央汇聚收缩，同时变为红色（从 amber 渐变为 red）。
汇聚后形成一个大字 `BARRIERS`（或 `门槛`），红色，带脉冲发光效果。
中央下方出现 `↓ Development Efficiency ↓` 配合向下箭头，暗示效率被限制。
迭代环和性能曲线在背景中 fade out。
到 991f，画面几乎全暗，只剩 `BARRIERS` 字样在中央微微闪烁。

**句 5 — seg1-05 (994–1373f, 12.6s) — CroqTile 揭晓**
*"所以我们造了 CroqTile——新一代 GPU 和 DSA 内核编程语言，5 倍生产力，为 AI 时代而生。"*

994f: `BARRIERS` 字样被一道 mint 绿光束从中间劈开/击碎，碎片向两侧消散。
1000–1060f: CroqTile logo 从中央浮现（spring 弹性动画），mint 绿光晕扩散。
1060–1120f: tagline 逐词出现：`5× Productivity.` → `GPU-native.` → `AI era.`
1120–1180f: 副标题淡入 `Next-gen GPU & DSA kernel programming language`
1180–1373f: 驻留展示。
1373–1393f: 淡出。

**[中]**
这不仅仅是因为实现复杂、代码行数多。

而是因为一个生产级计算核，需要经过多轮"编写——编译调试——性能剖析——参数调优"的完整迭代，才能逐步逼近生产级性能。

这个过程不仅需要扎实的编程能力，还需要深厚的硬件知识与丰富的性能优化经验。

这些门槛，大大限制了计算核的开发效率。

所以我们造了 CroqTile——新一代 GPU 和 DSA 内核编程语言，5 倍生产力，为 AI 时代而生。

**[英]**
It's not just because the implementation is complex or the code is long.

A production-grade kernel requires multiple iterations of coding, compile-debugging, profiling, and parameter tuning — each cycle inching closer to production-level performance.

This process demands not only solid programming skills, but also deep hardware knowledge and extensive optimization experience.

These barriers severely limit kernel development efficiency.

So we built CroqTile — the next-generation GPU and DSA kernel programming language. 5x productivity, designed for the AI era.

---

### 第 2 段 · 亮点一：简单易用

**⏱ 0:48 – 1:35 | 47 秒 (1410 帧 @ 30fps)**

---

#### 叙事路线

> 传统语言（CUDA/OpenCL）→ 线程视角（buffer + offset）→ data blocking 难 →
> CroqTile → 宏观视角（tensor + tile 操作原语）→ data blocking 自然 →
> 结论：不仅 60% less LOC，而且 super intuitive · human & AI 可读

#### 语音分段与帧时间

| Cue ID | 帧范围（Seg内） | 时长 | 内容 |
|--------|----------------|------|------|
| seg2-01 | 0–519f | ~17s | 线程视角：CUDA/OpenCL → buffer+offset → data blocking 困难 |
| seg2-02 | 520–1119f | ~20s | CroqTile 宏观视角：tensor + subspan/chunkat/.at() |
| seg2-03 | 1120–1410f | ~10s | 结论：不仅 60% less code，而且 intuitive + human & AI 可读 |

#### 动画结构（与语音对齐）

| 段落 | 帧范围 | 时长 | 对应语音 | 内容 |
|------|--------|------|----------|------|
| Phase A | 0–519f | ~17s | seg2-01 | Thread grid 混乱示意 + 地址越来越复杂 |
| Phase B | 520–1119f | ~20s | seg2-02 | CroqTile vs CUDA 代码分屏 + subspan/chunkat/.at() 高亮 |
| Phase C | 1120–1410f | ~10s | seg2-03 | 结论卡片：intuitive + AI-readable + 60% less code + LOC 对比条 |

---

**[画面]**

**Phase A (0–510f, ~17s) — 传统内核语言的困境**
四阶段动画：
- (0–140f) 屏幕中央一行大号 CUDA 代码：`A[threadIdx.x*BK + iv_k*TILE_K]`。
  上方两个标注 tab："buffer pointer"（amber）指向 `A`，"offset"（red）指向方括号内容。
  `A` 以 amber 色闪烁，offset 部分以 red 色闪烁
- (140–200f) 过渡：除 `threadIdx.x` 和完整 offset 外其余元素淡出。
  `threadIdx.x` 飞到左上角，变小。下方淡入一维线性地址图（buffer bar）
- (200–300f) `threadIdx.x` 右侧出现 4 个 thread ID（0, 1, 2, 3），
  每行右边飞入各自的 offset 表达式（如 `0*BK + 0*TILE_K`、`1*BK + 0*TILE_K` …）
- (300–440f) 从每个 thread 的 offset 行到 buffer bar 对应格子画 mapping 箭头（虚线动画），
  目标格高亮变红，展示不同线程指向不同内存位置
- (420–460f) 底部浮现注释条 `Every thread manually computes memory addresses`
- (475–510f) 整体淡出过渡到 Phase B

**Phase B (520–1119f, ~20s) — CroqTile 的 tensor-view 对比**
屏幕左右分栏。左侧：CroqTile 代码（mint 色调）；右侧：CUDA 代码（amber 色调）。
三个维度依次高亮展示（每个维度约 200f）：
1. Tensor declaration vs buffer + strides
2. `subspan` / `chunkat` / `.at()` vs manual offset arithmetic（核心维度，最长停留）
3. `parallel by` vs `blockIdx` / `threadIdx` plumbing

**Phase C (1120–1410f, ~10s) — 结论卡片**
代码对比淡出。屏幕中央浮现三行结论（逐行 spring-in）：
1. `Super intuitive` — 代码即逻辑，无隐式偏移
2. `Readable by human & AI` — 人和 AI agent 都能一眼理解
3. `60% less code` — LOC 对比条动画（CroqTile 36 vs CUDA 280）

**[中]**
*(seg2-01)* 传统内核语言如 CUDA，从单个线程的视角编程。每个线程操作一个 buffer 指针加上 offset——你为一个线程写逻辑容易，但很难想象一组线程累积起来的数据全貌。想实现 data blocking？你必须手动拼出所有偏移量。

*(seg2-02)* CroqTile 完全不同。它从宏观角度编程——数据是张量，不是 buffer。`subspan` 描述子区域，`chunkat` 按块切片，`.at()` 定位迭代位置。你描述取哪块，编译器生成所有地址计算。

*(seg2-03)* 结果不仅是代码量减少 60%，而且代码变得极其直观——人类工程师和 AI agent 都能一眼读懂内核逻辑。

**[英]**
*(seg2-01)* Traditional kernel languages like CUDA program from a single thread's view. Each thread works with a buffer pointer plus an offset — writing logic for one thread is easy, but it's hard to picture the accumulated data across a group of threads. Want data blocking? You piece together all the offset math yourself.

*(seg2-02)* CroqTile is fundamentally different. It programs from the macro view — data is a tensor, not a buffer. Subspan describes a sub-region, chunkat slices by block, .at() locates the iteration. You describe what to take — the compiler generates all address math.

*(seg2-03)* The result is not only 60% less code, but code that's super intuitive — both human engineers and AI agents can understand kernel logic at a glance.

---

### 第 3 段 · 零成本抽象 · 简单+性能

**⏱ 1:35 – 2:05 | 30 秒 (900 帧 @ 30fps)**

---

#### 叙事路线

> Seg 2 结尾 → LOC 对比（所有竞品中最少）→ 零成本抽象原则 → 简单性 vs 性能散点图（CroqTile 右上角）

#### 语音分段与帧时间

| Cue ID | 帧范围（Seg内） | 内容 |
|--------|----------------|------|
| seg3-01 | 0–?f | LOC 对比引出：compared to other DSLs, minimal LOC |
| seg3-02 | ?–?f | 零成本抽象：simplicity without perf compromise |
| seg3-03 | ?–end | 散点图结论：most simple + top performance |

#### 动画结构

| 段落 | 内容 |
|------|------|
| Phase A | LOC 横向柱状图（6 种语言，CroqTile 最短） |
| Phase B | 零成本抽象 transition + TFLOPS 性能数据 |
| Phase C | Simplicity vs Performance 散点图（X=简单性，Y=性能），CroqTile 在右上角 |

---

**[画面]**

**Phase A — LOC 对比柱状图**
从 Seg 2 结尾平滑衔接。横向柱状图弹入，6 种语言按 LOC 从小到大排列：
CroqTile-Python 30L · CroqTile 36L · TileLang 70L · Triton 80L · CUDA+CuTe 182L · CUTLASS 280L
CroqTile 柱高亮 mint 色，其他灰色。

**Phase B — 零成本抽象过渡**
柱状图淡出，浮现 "Zero-Cost Abstraction" 大字 + GEMM FP16 性能对比
（CroqTile 471.3 TFLOPS vs PyTorch 447.5 TFLOPS, +5.3%）

**Phase C — Simplicity vs Performance 散点图**
性能数据变形为散点图。X 轴 = Simplicity（越右越简单），Y 轴 = Performance（TFLOPS）。
各语言以圆点标注。CroqTile 位于右上角（最简单 + 最高性能），带发光效果。

**[中]**
*(seg3-01)* 和其他内核 DSL 相比，CroqTile 在相同计算核实现中展现了最少的代码量。

*(seg3-02)* 这种简洁性没有以性能为代价。零成本抽象是我们在语法设计中的第一原则。

*(seg3-03)* 这使得 CroqTile 成为最简单、最直观，同时拥有顶级性能的内核编程语言。

**[英]**
*(seg3-01)* Compared to other kernel DSLs, CroqTile shows the minimal lines of code for the same kernel implementation.

*(seg3-02)* This level of simplicity comes without performance compromise. Zero-cost abstraction is our first design principle.

*(seg3-03)* This makes CroqTile the most simple and intuitive kernel language — with still top-level performance.

---

### 第 4 段 · 亮点二：编译时安全

**⏱ 1:45 – 2:15 | 30 秒**

---

**[画面]**
屏幕出现一段代码，其中有一处 shape 不匹配的 bug（红色高亮）。编译器错误弹窗立即出现（类终端样式），清晰指出错误位置和原因。
右侧对比：CUDA 程序跑到 GPU 上之后才崩溃，显示 `CUDA error: illegal memory access` 的红色报错。

```choreo
// CroqTile：shape 不匹配 → 编译时立即报错
shared f16 [WARP_M, TILE_K] lhs_s;
tma.copy lhs.subspan(WARP_M, TILE_K * 2).at(bm, iv_k) => lhs_s;
// 编译器: error: span size mismatch in chunkat — expected [64, 64], got [64, 128]
```

**[中]**
*(seg4-01)* 除了易用性，调试体验也是影响计算核开发效率的重要因素。

*(seg4-02)* 传统的调优过程经常出现运行时报错——这类 bug 只在 GPU 上实际跑的时候才暴露，定位一个 DMA 越界或 shape 不匹配往往要花上数小时甚至数天。

*(seg4-03)* 而 CroqTile 是当前市场上唯一设计了独立编译模块的新一代计算核编程语言。这使得 CroqTile 具备了独一无二的编译期静态检查能力。

*(seg4-04)* DMA 越界、shape 不匹配、同步错误——这些传统内核开发中最难追踪的 runtime bug，CroqTile 编译器在编译期就能优雅地拦截。

**[英]**
*(seg4-01)* Beyond usability, the debugging experience is a major factor in kernel development efficiency.

*(seg4-02)* Traditional tuning cycles are plagued by runtime errors — bugs that only surface when the GPU actually runs. Tracking down a single DMA overflow or shape mismatch can take hours, even days.

*(seg4-03)* CroqTile is the only next-generation kernel language on the market with a purpose-built standalone compiler. This gives CroqTile unparalleled compile-time static analysis.

*(seg4-04)* DMA overflows, shape mismatches, sync errors — the hardest runtime bugs to track in traditional kernel development are caught elegantly by the CroqTile compiler at compile time.

---

### 第 5 段 · 亮点三：异构计算支持 · Write Once, Run Everywhere

**⏱ 2:15 – 2:45 | 30 秒 (900 帧 @ 30fps)**

---

#### 叙事路线

> CroqTile 源码不绑定硬件 → 编译器降级到各后端原生 ISA → 一个 flag 切换目标 → 多设备编程（parallel-by mpi）→ 编译器自动生成 host dispatch / 数据分区

#### 语音分段与帧时间

| Cue ID | 帧范围（Seg内） | 时长 | 内容 |
|--------|----------------|------|------|
| seg5-01 | 0–280f | ~9s | 同一源码 → 多后端（H800/A100/MI300/DSA） |
| seg5-02 | 280–560f | ~9s | 改一个 flag，同 kernel 跑不同硬件 |
| seg5-03 | 560–890f | ~11s | 多设备：parallel-by mpi，编译器自动 dispatch |

#### 动画结构（与语音对齐）

| 段落 | 帧范围 | 时长 | 对应语音 | 内容 |
|------|--------|------|----------|------|
| Phase A | 0–280f | ~9s | seg5-01 | CroqTile 源码居中，右侧分支箭头指向 4 个目标设备卡片 |
| Phase B | 280–560f | ~9s | seg5-02 | 编译 flag 动画切换（`-t cute -arch=sm_90a` → `-t gfx942` → `-t dsa_x`） |
| Phase C | 560–890f | ~11s | seg5-03 | distributed_matmul 代码 + 节点分区图（2×2 grid） |

---

**[画面]**

**Phase A (0–280f, ~9s) — Write Once, Run Everywhere**
屏幕左侧出现 CroqTile matmul 内核代码（约 12 行，mint 色调的 DeviceShell）。
右侧从中间发散出 4 条带箭头的连线，每条连线末端是一个目标设备卡片，依次弹入（spring 动画）：
- NVIDIA H800/H100（mint 绿边框）：`-t cute -arch=sm_90a` → Hopper SM90a (PTX + SASS)
- NVIDIA A100（cyan 边框）：`-t cute -arch=sm_80` → Ampere SM80
- AMD MI300（orange 边框）：`-t gfx942` → AMDGPU ISA
- Custom DSA（pink 边框）：`-t dsa_x` → Pluggable backend

每条连线上标注对应的编译 flag（mono 字体、小号）。底部居中标注：
`Same source → different targets — the compiler lowers CroqTile IR to each backend's native ISA`

**Phase B (280–560f, ~9s) — 一个 Flag 切换目标**
左侧代码不变。右侧 4 个设备卡片依次高亮（当前活跃的卡片边框变亮、带 glow），
其余变灰。对应的编译 flag 在代码上方一行以 crossfade 动画切换。
暗示：源码完全不动，只有编译目标在变化。

**Phase C (560–890f, ~11s) — 多设备编程**
Phase A/B 淡出。屏幕左右分栏：
- 左侧：distributed_matmul.co 代码（DeviceShell），高亮 `parallel {node_m, node_n} by [...] : mpi { ... }` 这几行（amber 高亮）
- 右侧：2×2 网格图（Node 0,0 / 0,1 / 1,0 / 1,1），每个格子标注 GPU 编号和矩阵分区范围
  下方 bullet points 弹入：
  - Kernel launch → compiler generates host dispatch
  - Type conversion & alignments → handled automatically
  - Data partitioning → `parallel-by mpi` splits work across ranks

**[中]**
*(seg5-01)* 同一份 CroqTile 源码，编译器自动降级到不同后端的原生 ISA——NVIDIA H800、A100、AMD MI300，甚至自定义加速器。不需要为每种硬件重写代码。

*(seg5-02)* 只需要改一个编译 flag，同一个 kernel 就能跑在完全不同的硬件上。代码不改一行。

*(seg5-03)* 多设备编程也一样简单：在 kernel 外层加一层 `parallel-by mpi`，编译器自动生成数据分区、host dispatch 和跨节点通信。几行样板代码就能把单 GPU kernel 扩展到多节点集群。

**[英]**
*(seg5-01)* One CroqTile source, and the compiler lowers it to each backend's native ISA — NVIDIA H800, A100, AMD MI300, even custom DSAs. No code rewrite for each target.

*(seg5-02)* Just change one compiler flag and the same kernel runs on entirely different hardware. Not a single line of code changes.

*(seg5-03)* Multi-device programming is just as simple: wrap the kernel in a `parallel-by mpi` layer, and the compiler generates data partitioning, host dispatch, and cross-node communication. A few lines of boilerplate scale a single-GPU kernel to a multi-node cluster.

---

### 第 6 段 · 亮点四：天生为 Agentic AI 编程而设计

**⏱ 2:45 – 5:20 | 155 秒 (4650 帧 @ 30fps)**

---

#### 叙事路线

> AI-native 定位 → AI 调优收敛实测（benchmark 数据先行，用结果建立可信度）→ 为什么 CroqTile 特别适合 AI 调优（token 精简 + 单点变更 + compiler guardrail）→ AI 增强层（profiler CLI + Skills）→ 收尾：新范式

#### 语音分段与帧时间（18 cues，6 sub-segments）

| Sub | Cue IDs | 帧范围（Seg内） | 时长 | 内容 |
|-----|---------|----------------|------|------|
| 6A | seg6a-01, seg6a-02 | 0–450f | ~15s | AI-native 引子 |
| 6B | seg6b-01, seg6b-02, seg6b-03 | 450–1200f | ~25s | AI 调优收敛 benchmark |
| 6C | seg6c-01, seg6c-02, seg6c-03 | 1200–1950f | ~25s | Token 精简 + 单点变更 |
| 6D | seg6d-01, seg6d-02, seg6d-03 | 1950–2700f | ~25s | Compiler guardrail vs CUDA |
| 6E | seg6e-01, seg6e-02, seg6e-03 | 2700–3600f | ~30s | Profiler CLI + Skills |
| 6F | seg6f-01, seg6f-02, seg6f-03, seg6f-04 | 3600–4650f | ~35s | 实测结果 + 新范式 |

---

#### 6A · 引子：Born for Agentic AI Programming

**⏱ 2:45 – 3:00 | 15 秒**

**[画面]**
画面由第 5 段平滑过渡。大标题弹入：`Born for Agentic AI Programming`。
下方两个关键词卡片对称出现（spring 弹性）：
- 左：`Superior Context Engineering` — 图标：代码窗口 + 压缩箭头
- 右：`Superior Harness Engineering` — 图标：编译器盾牌 + 检查标记

**[中]**
*(seg6a-01)* CroqTile 从第一天起就为 agentic AI 编程而设计。

*(seg6a-02)* 两个核心优势：极致的上下文工程，和极致的 harness 工程。

**[英]**
*(seg6a-01)* CroqTile was designed for agentic AI programming from day one.

*(seg6a-02)* Two core advantages: superior context engineering, and superior harness engineering.

---

#### 6B · AI 调优收敛对比（Benchmark 数据先行）

**⏱ 3:00 – 3:25 | 25 秒**

**[画面]**

**① matmul 收敛曲线（0–250f）**
屏幕左侧：收敛曲线图（Y 轴 = running-best TFLOPS，X 轴 = iterations）。
六条曲线依次出现：CroqTile 486（mint，最高）、Triton 384（indigo）、TileLang 343（pink）、Helion 318（amber）、CUDA 162（red）、CuTe-DSL 27（purple）。
cuBLAS baseline 虚线 420 TFLOPS。CroqTile 超过 baseline 时曲线发光。
右侧 6 个数据卡片（横向柱状图风格）显示最终 TFLOPS。
底部标注：`cuBLAS baseline: 420 TFLOPS · CroqTile = 115% of vendor`

**② blockscale 切换（250–450f）**
曲线图 crossfade 切换到 blockscale GEMM E4M3 结果：
CroqTile 711（mint）、TileLang 408（pink）、Triton 298（indigo）、Helion 167（amber）。
底部标注：`cuBLAS baseline: 460 TFLOPS · CroqTile = 155% of vendor · 6 iterations only`

**③ SPMM 总结（450–750f）**
曲线图淡出，屏幕居中出现三个大数字卡片：
- `84%` — win rate across 95 shapes
- `+16.7%` — average speedup over cuSPARSELt
- `95` — sparse GEMM shapes tested

**[中]**
*(seg6b-01)* 同一个 AI agent、同一硬件、同一 budget，只有语言不同。CroqTile 在 matmul FP16 16384 的方阵上达到 486 TFLOPS，超过 cuBLAS 的 420。

*(seg6b-02)* 在 blockscale GEMM E4M3 上更加惊人：CroqTile 711 TFLOPS，仅 6 次迭代，vendor library 的 155%。

*(seg6b-03)* 在 95 个 sparse GEMM shape 上，CroqTile AI 调优赢了 84%，平均比 cuSPARSELt 快 16.7%。

**[英]**
*(seg6b-01)* Same AI agent, same hardware, same budget — only the language differs. CroqTile hits 486 TFLOPS on matmul FP16 16384 squared, surpassing cuBLAS at 420.

*(seg6b-02)* Blockscale GEMM E4M3 is even more striking: CroqTile reaches 711 TFLOPS in just 6 iterations — 155% of the vendor library.

*(seg6b-03)* Across 95 sparse GEMM shapes, CroqTile AI tuning wins 84% of cases, averaging 16.7% faster than cuSPARSELt.

---

#### 6C · 为什么 CroqTile 适合 AI 调优：Token 精简 + 单点变更

**⏱ 3:25 – 3:50 | 25 秒**

**[画面]**

**① Token 对比柱状图（0–250f）**
横向柱状图，同一 persistent warp-specialized GEMM 的 token 数对比：
- CroqTile：36 LOC / 303 tokens（mint，最短）
- Triton：80 LOC / 449 tokens（indigo）
- CUDA+CuTe：182 LOC / 1530 tokens（orange）
- CUTLASS：280 LOC / 2350 tokens（red，最长）

下方推论卡片（紫色边框）：
`同样 100 iterations：CroqTile ~70K tokens / CUDA ~350K tokens → CroqTile 可以跑 5× 更多轮次，或用更小模型`

**② 变更站点对比表（250–750f）**
表格逐行弹入：

| AI tuning 操作 | CroqTile | CUDA |
|----------------|----------|------|
| 改 tile size (WARP_M/N) | 1 处 | 5 处 |
| 改 swizzle 模式 | 1 处 | 3 处 |
| 改 pipeline stages | 1 处 | 4 处 |
| 改 data type (f16→f8) | 1 处 | 7 处 |
| 加 warp specialization | 2 处 | 6 处 |

CroqTile 列 mint 高亮，CUDA 列 red 高亮。

**[中]**
*(seg6c-01)* CroqTile 只需要 303 个 token 描述一个 warp-specialized GEMM。Triton 需要 449，CUDA+CuTe 需要 1530，CUTLASS 需要 2350。

*(seg6c-02)* 同样 100 轮迭代，CroqTile 只消耗约 70K token，而 CUDA 要 350K。CroqTile 可以跑 5 倍更多轮次，或用更小的模型。

*(seg6c-03)* 每一个逻辑变更只对应一处代码修改。改 tile size，CroqTile 1 处，CUDA 5 处。改 swizzle，1 处 vs 3 处。

**[英]**
*(seg6c-01)* CroqTile takes just 303 tokens for a warp-specialized GEMM. Triton needs 449, CUDA+CuTe 1,530, CUTLASS 2,350.

*(seg6c-02)* Over 100 iterations, CroqTile consumes only 70K tokens versus 350K for CUDA. That means 5x more iterations, or a smaller model.

*(seg6c-03)* Every logical change maps to one code site. Tile size: CroqTile 1 site, CUDA 5. Swizzle: 1 vs 3.

---

#### 6D · Compiler Message 作为护栏

**⏱ 3:50 – 4:15 | 25 秒**

**[画面]**

**① CUDA vs CroqTile 对比面板（0–500f）**
屏幕左右分栏：
- 左侧（red 调）：`CUDA: runtime 才发现错误`
  - ⚠ Tile 不整除 → **device hang**
  - ⚠ Shared memory 超限 → **silent launch fail**
  - ⚠ Swizzle 不匹配 → **wrong results**
  - ⚠ mbarrier 错误 → **deadlock**
- 右侧（mint 调）：`CroqTile: 编译期完整诊断`
  - ✔ `error: tile M=96 not divisible by WARP_M=64`
  - ✔ `error: smem 49408B exceeds 48KB limit`
  - ✔ `error: swiz<128> requires 128B-aligned`
  - ✔ `error: mma.row requires M%64==0`

**② 数据卡片（500–750f）**
四个卡片横排弹入：
- `353` compile checks（mint）
- `1,319` runtime asserts（mint）
- `3–8s` CroqTile / iteration（mint）
- `30–90s` CUDA / iteration（red）

**[中]**
*(seg6d-01)* CUDA 的错误在 runtime 才暴露：device hang、silent launch fail、wrong results、deadlock。

*(seg6d-02)* CroqTile 在编译期就完整诊断：tile 不整除、shared memory 超限、swizzle 不匹配，全部拦截。

*(seg6d-03)* 353 条编译期检查、1319 条 runtime assert。每轮迭代 CroqTile 只需 3 到 8 秒，CUDA 要 30 到 90 秒。

**[英]**
*(seg6d-01)* CUDA errors only surface at runtime: device hangs, silent launch failures, wrong results, deadlocks.

*(seg6d-02)* CroqTile catches everything at compile time: tile divisibility, shared memory limits, swizzle alignment — all intercepted.

*(seg6d-03)* 353 compile-time checks, 1,319 runtime asserts. Each iteration takes 3–8 seconds with CroqTile versus 30–90 seconds with CUDA.

---

#### 6E · AI 增强层：Profiler CLI + CroqTile Skills

**⏱ 4:15 – 4:45 | 30 秒**

**[画面]**
三层护栏结构图依次从下向上浮现：
- **第 1 层**：Compiler Guardrail（灰色底，已有，dim 状态）
- **第 2 层**：Unified Profiler CLI（mint 色，新浮现）— 图标：ncu + 多 DSA profiler 合并成统一界面，terminal 样式截图
- **第 3 层**：CroqTile Skills（amber 色，新浮现）— 图标：文档 + 模板 + patterns 封装

每层浮现时带 spring 弹性 + glow 效果。

**[中]**
*(seg6e-01)* 除了编译器护栏，CroqTile 还提供两层 AI 增强：统一 profiler CLI 和 CroqTile Skills。

*(seg6e-02)* 统一 profiler CLI 将 NVIDIA ncu 和各种 DSA profiler 的输出整合成一个界面。AI 不再需要理解不同 profiler 的输出格式。

*(seg6e-03)* CroqTile Skills 为 coding agent 预封装语法规则、常用模式和代码模板，让 AI 的第一次尝试就接近最优。

**[英]**
*(seg6e-01)* Beyond compiler guardrails, CroqTile adds two AI enhancement layers: a unified profiler CLI and CroqTile Skills.

*(seg6e-02)* The unified profiler CLI integrates NVIDIA ncu and various DSA profiler outputs into a single interface. AI no longer needs to parse different profiler formats.

*(seg6e-03)* CroqTile Skills pre-packages syntax rules, common patterns, and code templates for coding agents, so the AI's first attempt is near-optimal.

---

#### 6F · 实测结果 · 新工作范式

**⏱ 4:45 – 5:20 | 35 秒**

**[画面]**

**① 复杂代码变更（0–350f，左侧）**
AI agent 界面展示一次非平凡的内核重构：切换 tile size、swizzle、pipeline stages。
CroqTile 内核平滑完成变更，编译通过。标注：`structural change · 1 step · compile pass`。

**② 调优收敛曲线（0–350f，右侧）**
FP8 sparse GEMM 吞吐量逐步爬升：
`671 → 784 → 902 → 1051 → 1127 TFLOPS`
标注：68 次迭代，+67.9%，对齐 vendor library 水位线（虚线）。

**③ 范式对比（350–700f，下方）**
两条工作流示意同时浮现：
- 当前主流：`人工写内核 → AI 辅助调试（下游）`
- CroqTile 新范式：`AI 主动探索 + 优化（上游） → 人工审核确认`

**④ 结语（700–1050f）**
范式图淡出，屏幕居中大字弹入：
`CroqTile has put AI in the driver's seat.`
下方小字淡入：`That's what AI-native truly means.`

**[中]**
*(seg6f-01)* AI agent 在 CroqTile 上自主完成复杂的结构代码变更：改 tile size、swizzle、pipeline stages，都是一步到位。

*(seg6f-02)* AI 在 68 次迭代内将 FP8 sparse GEMM 的吞吐量从 671 提升到 1127 TFLOPS，达到 vendor library 水平。

*(seg6f-03)* 这开启了一个新范式：AI 调优不再是下游兜底，而是上游的主动探索引擎。

*(seg6f-04)* CroqTile 已经把 AI 推上了驾驶位。这就是 AI-native 的真正含义。

**[英]**
*(seg6f-01)* AI agents on CroqTile autonomously make complex structural code changes: tile size, swizzle, pipeline stages — all in one step.

*(seg6f-02)* AI converges in 68 iterations, pushing FP8 sparse GEMM from 671 to 1,127 TFLOPS — matching vendor library performance.

*(seg6f-03)* This enables a new paradigm: AI tuning as an upstream exploration engine, not a downstream safety net.

*(seg6f-04)* CroqTile has put AI in the driver's seat. That's what AI-native truly means.

---

### 第 7 段 · 结语 · CTA

**⏱ 5:20 – 5:30 | 10 秒**

---

**[画面]**
画面收黑，CroqTile logo 居中出现。

底部逐渐浮现：
- 主标题（大字）：**欢迎来到计算编程的新时代**
- 副标题（小字）：你的性能开发效率，值得被重新定义
- CTA 按钮：`开始使用 → lancerlab.github.io/croqtile-tutorial`
- GitHub 角标：`github.com/LancerLab/croqtile`

**[中]**
欢迎来到计算编程的新时代。你的性能开发效率，值得被重新定义。

**[英]**
Welcome to the new era of compute programming. Your kernel development productivity deserves to be redefined.

---

## 时间轴汇总

| 段落 | 时间 | 时长 | 核心内容 |
|------|------|------|---------|
| 0 · 痛点开场 | 0:00–0:15 | 15s | 写一个生产级 GPU kernel 要多久？ |
| 1 · 迭代痛苦 + 解法 | 0:15–1:01 | 46s | 多轮迭代 + 门槛 → CroqTile 登场 |
| 2 · 简单易用 | 1:01–1:48 | 47s | Tensor-view vs buffer+offset / 60% less code |
| 3 · 零成本抽象 | 1:48–2:18 | 30s | LOC 对比 / 471 TFLOPS / 散点图 |
| 4 · 编译时安全 | 2:18–2:45 | 30s | 353 checks / 1319 assertions / 对比 CUDA |
| 5 · 异构计算 | 2:45–3:15 | 30s | Write Once Run Everywhere / parallel-by mpi |
| 6A · AI-native 引子 | 3:15–3:30 | 15s | 上下文工程 + harness 工程 |
| 6B · AI 调优收敛 | 3:30–3:55 | 25s | 486T matmul / 711T blockscale / 84% SPMM |
| 6C · Token 精简 | 3:55–4:20 | 25s | 303 vs 2350 tokens / 单点变更 |
| 6D · Compiler 护栏 | 4:20–4:45 | 25s | CUDA runtime vs CroqTile compile-time / 3-8s |
| 6E · AI 增强层 | 4:45–5:15 | 30s | 统一 profiler CLI / CroqTile Skills |
| 6F · 实测 + 新范式 | 5:15–5:50 | 35s | 671→1127 / 上游 AI 工作流 / driver's seat |
| 7 · CTA | 5:50–6:00 | 10s | Outro + 链接 |
| **合计** | | **~360s** | |

> **注**：第 6 段合计 155 秒，超过其他所有亮点段（2+3+4+5 = 137 秒）之和。

## 关键数据汇总

| 数据 | 数值 | 来源 |
|------|------|------|
| CroqTile Persistent GEMM LOC | 36 行 | paper Table 1 (tab:loc) |
| CUTLASS LOC | 280 行 | paper introduction / slides slide 4 |
| CUDA + CuTe LOC | 182 行 | paper introduction / slides slide 4 |
| Triton LOC | 64 行 | paper Table 1 (tab:loc) |
| 代码量比 CUDA 少 | 40% 等效量 | website BottomCTA |
| Compile-time checks | 353 项 | slides slide 15 |
| Runtime assertions | 1,319 项 | slides slide 15 |
| GEMM FP16 CroqTile | 471.3 TFLOPS | website FeatureZeroCost |
| GEMM FP16 PyTorch | 447.5 TFLOPS | website FeatureZeroCost |
| AI Tune 起始 TFLOPS | 671 | slides slide 20 / paper Table 3 |
| AI Tune 最终 TFLOPS | 1127 | slides slide 20 / paper Table 3 |
| AI Tune 提升幅度 | +67.9% | slides slide 20 |
| AI Tune 迭代次数 | 68 次 | slides "Context Fit" code block |
| Token 密度（CroqTile） | ~500 tokens/kernel | website FeatureAI |
| Token 密度（CUDA+CuTe） | 2000-4000 tokens | paper introduction |
| Compile-time pruning | 消除 30–40% 不可行配置 | paper abstract + Section 5.4 |
| FlashAttention 开发时间 | "months of engineering per kernel family" | paper introduction (引 flashattn_2022) |
| Compile_fail 率（CroqTile） | 3.5%（21 tasks, 1215 iters） | tuning logs 统计 |
| Compile_fail 率（Triton） | 7.5%（4 tasks, 376 iters） | tuning logs 统计 |
| Compile_fail 率（CUDA） | 10.0%（3 tasks, 210 iters） | tuning logs 统计 |
| Compile_fail 率（Helion） | 23.3%（4 tasks, 323 iters） | tuning logs 统计 |
| 收敛速度对比 | 5× faster vs profiler-only (50 vs 250 iterations) | paper Section 6.2 |

## 待确认 / 待补充

- [x] ~~痛点开场中 "FlashAttention 几个月" 的具体引用来源是否需要标注~~ → 已确认：来自 paper introduction 引用 `flashattn_2022`，措辞 "months of engineering per kernel family" 直接引自原文，无需额外标注
- [x] ~~**[待确认] 第 6D 段 pass@1 数据**~~ → **已解决**：经统计 tuning logs（croqtile/triton/cuda/helion）：CroqTile compile_fail 率 **3.5% 最低**（Triton 7.5%、CUDA 10%、Helion 23.3%）。pass@1（95.2%）略低于其他 DSL（均 100%，但样本量小），原因是 CroqTile 尝试更激进的结构性改动，且 runtime assertions 主动捕获了更多 correctness 问题（26% SEGFAULT = verification failed）。**6D 已更新为 compile_fail 率对比 + 5× 收敛加速**，删除 p<0.05 声明。
- [ ] 第 2A 段三个维度的代码对比是否需要调整为更短的示例代码（适配视频展示节奏）
- [ ] 第 3 段性能数据是否要加入 GEMM FP8 数据（262.7 vs 256.9 CUTLASS）
- [ ] 第 6 段 AI Tune 动画需要确认 `results.tsv` 中的具体曲线数据点（paper Figure 4 对应的原始数据）
- [ ] CTA 最终 URL 是否已正式部署（当前引用 lancerlab.github.io/croqtile-tutorial）
