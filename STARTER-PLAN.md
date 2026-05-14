# croqtile-videos 最小起步方案

## 目标

第一阶段只解决一件事：

- 用 React + Remotion 做出接近 Vibero 的 UI promo 视频骨架。
- 保留代码动画能力，但不要一开始就把算法动画、数学动画、在线编辑器一起做进去。

这意味着第一版的重点不是“做一个通用视频平台”，而是“稳定产出 30 到 60 秒的产品演示短片”。

## 主技术栈

- 主骨架：Next.js + React + Remotion
- 动画层：Remotion 自带 timing API + 少量 Framer Motion
- 代码镜头：Code Hike 模板，必要时补 Shiki
- 镜头组件来源：reactvideoeditor/remotion-templates
- 成品模板参考：SwiftClip
- 录屏素材入口：Remotion Recorder
- 后续规模化渲染参考：github-unwrapped

## 采用顺序

### 1. 主项目先从官方 Next 模板起

最稳的起点是官方 Next.js Remotion 模板，而不是社区编辑器仓库。

原因：

- 你当前最需要的是“能写 React 场景并直接出片”。
- Vibero 风格本质上是 UI 组件状态切换 + 程序化镜头，而不是复杂时间轴交互。
- 官方模板的维护风险最低，后面也容易接 Lambda 渲染。

建议使用官方脚手架先生成到临时目录，再拷进当前空仓库：

```bash
npx create-video@latest --next-pages-dir croqtile-bootstrap
rsync -a croqtile-bootstrap/ /home/albert/workspace/croqtile-videos/ --exclude .git
rm -rf croqtile-bootstrap
```

如果后面确认你想全程走 App Router，再切到对应的 Next 模板也不晚；第一版先追求稳定。

### 2. 第二优先级不是模板整仓照搬，而是拿镜头组件

从 reactvideoeditor/remotion-templates 先挑这几类最有用的效果：

- Spotlight Reveal
- Vignette Pulse
- Push / Slide Wipe
- Zoom Through / Zoom Pulse
- Text Highlight
- Notification Pop

这些效果和 Vibero 片子里的常见镜头语言非常接近，适合直接转成你自己的基础镜头组件。

### 3. 代码动画单独收口，不要混进主 UI 动画层

代码镜头直接借 Code Hike 模板。

第一版只做两种代码镜头：

- snippet reveal
- diff focus

这样足够覆盖“代码解释”和“接口变化展示”两类常见需求，不要先做完整 IDE 模拟器。

### 4. SwiftClip 只拿视觉脚手架，不当主工程

SwiftClip 的价值在于：

- 它已经有 SaaS Promo、Web Promo、Code Reveal、Product Launch 这些接近目标的成品结构。
- 你可以直接抄场景节奏、排版密度、卡片组织方式。

但不要把整个工程当成主仓库基础，因为你还是需要一个更干净、更可控的核心骨架。

### 5. 编辑器和大规模渲染都延后

下面两类仓库先只做参考，不进第一阶段：

- free-react-video-editor：适合以后做在线时间轴编辑器
- github-unwrapped：适合以后做批量渲染、缓存、任务系统

## 第一版目录建议

```text
app/
components/
data/
public/
remotion/
  Root.tsx
  compositions/
    promo/
    code/
  scenes/
    ui/
    overlays/
    camera/
    code/
  theme/
  utils/
```

目录职责：

- app：预览页、调试入口、简单控制面板
- components：普通 React UI 组件，供网页和视频场景复用
- data：字幕、文案、镜头配置、时间轴参数
- public：图片、音频、录屏素材
- remotion/compositions：最终可渲染的完整视频入口
- remotion/scenes：可复用场景切片
- remotion/overlays 和 camera：聚焦框、光斑、镜头推拉、局部遮罩

## 第一版只做 4 个 composition

### 1. Hero Intro

目标：

- 用一个主界面建立产品基调
- 做轻微推镜和局部高亮

### 2. Feature Spotlight

目标：

- 展示一个功能点的状态变化
- 用 spotlight、mask、zoom 做镜头引导

### 3. Code Explain

目标：

- 插入一段简短代码
- 高亮关键行或展示小范围 diff

### 4. Outro CTA

目标：

- 回到完整产品视图
- 用标题、标签、按钮或数据卡做结尾收束

只要这 4 个 composition 出来，项目就已经具备可扩展骨架。

## 第一周实现拆分

### Day 1

- 起官方 Next + Remotion 骨架
- 配好字体、色板、圆角、阴影、背景噪点
- 做一个通用页面容器和一个通用设备壳

### Day 2

- 实现 spotlight overlay
- 实现 vignette / blur edge
- 实现简单 camera pan / zoom
- 跑通 Hero Intro

### Day 3

- 跑通 Feature Spotlight
- 接一个录屏或伪数据驱动的界面状态切换
- 固化两到三个转场组件

### Day 4

- 接 Code Hike 模板能力
- 跑通 Code Explain
- 调整代码镜头与 UI 镜头之间的节奏衔接

### Day 5

- 做 Outro CTA
- 加基础字幕、音乐占位、SFX 占位
- 输出第一条完整样片

## 借鉴策略

不是 fork 一个仓库然后重命名，而是分层借鉴：

- 用官方 Next 模板做主工程
- 从 remotion-templates 拿镜头级效果
- 从 Code Hike 拿代码段动画能力
- 从 SwiftClip 拿成片节奏和场景编排
- 从 Recorder 拿录屏素材入口思路

这样后面工程不会被单个第三方仓库的结构绑死。

## 第一阶段完成标准

满足下面 5 条就算第一阶段完成：

- 可以本地预览和导出 1 条 30 到 60 秒视频
- 至少有 1 个真实 UI 场景和 1 个代码场景
- 已经抽出 3 到 5 个可复用镜头组件
- 所有场景共用一套主题变量和版式规则
- 后续新视频只需要换文案、数据和场景排序，不需要重写底层动画

## 暂时不要做的事

- 不要先做在线时间轴编辑器
- 不要先接多用户、任务队列、素材管理后台
- 不要先做 Motion Canvas 和 Manim 子管线
- 不要先追求“一套系统覆盖所有视频风格”

第一版先把 Vibero 类 UI promo 做稳，再决定要不要扩到算法和数学视频。

## 风险提醒

- reactvideoeditor 的开源编辑器更适合参考交互结构，不适合作为你当前主仓库基础
- SwiftClip 很适合借视觉和结构，但不要把它当成系统边界
- Remotion 本身的商业授权需要单独确认

