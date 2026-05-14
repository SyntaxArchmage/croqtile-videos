# Vibero 视频脚本提取

## 说明

这不是从原始音轨直接 ASR 得到的逐字稿。

当前环境里有两个客观限制：

- Bilibili 播放器接口返回了空字幕列表，公开字幕轨不可直接提取。
- 页面里暴露出的音频流 URL 可以读到，但实际下载在当前网络环境下超时。

因此，这份文档采用的是高置信近似提取：

- 主要依据：Bilibili 视频正文简介
- 交叉校验：Vibero 官方站首页文案与功能结构
- 视觉校验：之前分析过的 Vibero 视频关键帧和官方演示片段

可把它当成后续脚本设计和动画设计的工作底稿，但不要把它当成官方逐字字幕。

## 结论

- 中文稿：高置信近似稿，语义层面基本可信
- 英文稿：基于中文稿的忠实工作翻译，不代表官方英文旁白原文

## 手动摘取脚本

这一版以你刚刚补充的手动摘取为准，前一版自动整理稿全部作废。

### 中文旁白稿

多到读不完的论文，被撕碎的注意力。我们怎么才能真正消化这么多线性长文本？

AI 总结丢给你一个“一分钟速读”版本，但却牺牲了你思考理解的深度和细节，所以最后知识都没进脑子。

因此，我们创造了 Vibero。

重新分配你的注意力，读得更快，但也更深入。

Vibero 将段落拆解为结构化的要点，像从文本中长出的思维树。

在这里，论文不再是静态的 PDF，它们在一个可交互的画布上。

在这里，你可以读得超快，但又不会错过任何细节。

Vibero 的多语言翻译能够跟随你的注意力，只需要简单地悬停鼠标。

丢掉笨拙的划词翻译吧。

全文总结现在不只是静态的文本，而是能帮助你快速定位核心要点的导航。

点击核心点、点击实验结果，Vibero 会直接带你定位到所有对应的散落段落。

对于那些有开源代码实现的论文，代码和论文不再是割裂的。

你可以边读论文边看代码实现，在一个窗口内同时掌握理论和实践的细节。

你和 AI 的对话现在是双向的，只需选择你的对话并拖拽入文中，对话立刻成为笔记。

有价值的洞察总是隐藏在你们的对话中，把它们带出来吧。

这里 AI 生成的所有内容都是可以二次编辑的，所以你读过的每篇论文，都是你和 Vibero 共同打磨过的数字资产。

欢迎来到 vibe reading 的新时代，你的注意力值得被更好地对待。

### English working translation

Too many papers. Too little attention. How do we actually digest so many long, linear texts?

AI summaries often hand you a one-minute version, but they sacrifice the depth and nuance of understanding. In the end, the knowledge never really makes it into your mind.

So we built Vibero.

Redirect your attention. Read faster, yet deeper.

Vibero breaks paragraphs into structured key points, like a thinking tree growing out of the text.

Here, papers are no longer static PDFs. They live on an interactive canvas.

Here, you can read extremely fast without missing any detail.

Vibero’s multilingual translation follows your attention with a simple hover.

Throw away clumsy word-by-word translation.

The full summary is no longer just static text. It becomes navigation that helps you quickly locate the core ideas.

Click a key point, click an experimental result, and Vibero takes you directly to every related passage.

For papers with open-source implementations, code and paper are no longer separate.

You can read the paper and inspect the code side by side, understanding theory and practice in one window.

Your conversation with AI is now two-way. Select your dialogue and drag it back into the document, and it becomes a note.

The most valuable insights are often hidden in those conversations. Bring them out.

All AI-generated content here is editable, so every paper you read becomes a digital asset co-refined by you and Vibero.

Welcome to the new era of vibe reading. Your attention deserves better care.

## 动画设计锚点

这版脚本可以直接拆成下面 8 个动画段：

1. 注意力被撕碎，论文堆积成压力
2. 一分钟速读版的局限
3. Vibero 作为反转方案登场
4. 段落结构化，长文变思维树
5. 交互画布、悬停翻译、核心点导航
6. 代码与论文协同阅读
7. AI 对话拖拽回文中，变成笔记
8. 可二次编辑的数字资产与结尾 CTA
