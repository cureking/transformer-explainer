# Transformer 解释器（中文版）

> 一个交互式可视化工具，帮助你理解 GPT 这类 Transformer 模型的内部工作原理：在浏览器中实时运行 GPT-2，观察 Transformer 的各个组件如何协同工作、预测下一个词元。

[English README](./README.en.md) ｜ [中文术语表](./docs/中文术语表.md)

> **本仓库是 [poloclub/transformer-explainer](https://github.com/poloclub/transformer-explainer) 的非官方中文翻译版。**
> 原项目由 Georgia Institute of Technology 的 POLOCLUB 团队开发，采用 MIT 许可证。界面与文章文案的中文翻译由本仓库维护，代码结构、可视化与模型逻辑保持与上游一致。原项目地址：<https://github.com/poloclub/transformer-explainer>（仅作查询参考）。

## 项目简介

Transformer 解释器（Transformer Explainer）是一个交互式可视化工具，帮助任何人学习 GPT 这类 Transformer 模型的工作原理：

- **实时运行**：浏览器内直接加载 GPT-2（small，1.24 亿参数）的 ONNX 模型，输入自己的文本即可看到真实推理结果
- **全流程可视化**：分词 → 词元嵌入 → 位置编码 → 多头自注意力（查询/键/值）→ MLP → logits → Softmax → 温度与采样
- **20 页教学卡片**：从「什么是 Transformer」一路讲到 Dropout，点击图示旁的小图标即可展开
- **配套长文**：完整的架构讲解与配图，可当作入门读物逐节阅读

## 本地运行

#### 环境要求

- **Node.js ≥ 22.12.0**（项目使用 SvelteKit 2 + Vite 6，低于 22.12 会因 `node:util.styleText` 缺失而构建失败）
- npm ≥ 10

#### 步骤

```bash
git clone https://github.com/cureking/transformer-explainer.git
cd transformer-explainer
npm install
npm run dev
```

浏览器访问 <http://localhost:5173>。

构建静态站点：

```bash
npm run build      # 产物在 build/
npm run preview    # 本地预览构建结果
```

#### 关于模型文件

`static/model-v2/` 下是 GPT-2（small）导出为 ONNX 后切分的 63 个分片，合计约 660MB。数据量较大，**默认不纳入本仓库的 git 版本管理**；首次使用可通过以下任一方式获取：

```bash
# 方式一：从上游仓库获取（仅静态资源，不含历史）
git clone --depth 1 https://github.com/poloclub/transformer-explainer.git /tmp/te-upstream
cp -R /tmp/te-upstream/static/model-v2 ./static/model-v2

# 方式二：使用仓库内脚本自行导出并切分
python src/utils/model/export_to_onnx.py
python src/utils/model/chunk.py
```

浏览器首次访问会下载全部分片并写入 Cache Storage，之后走本地缓存；移动端不加载模型，只使用内置示例数据。

## 中文版说明

### 术语规范

全部中文译名以 [`docs/中文术语表.md`](./docs/中文术语表.md) 为准，例如：

| 英文 | 中文 |
|---|---|
| token | 词元 |
| embedding | 嵌入 |
| self-attention | 自注意力 |
| query / key / value | 查询 / 键 / 值 |
| layer normalization | 层归一化 |
| residual connection | 残差连接 |
| next-token prediction | 下一词元预测 |
| logits / Softmax / GeLU / Dropout | 保留英文 |

### 为什么示例输入是英文？

GPT-2 的分词器基于英文语料训练，中文会被拆成字节级碎片（例如 10 个汉字约等于 23 个词元，且解码后出现乱码），模型无法生成有意义的中文。因此**示例输入保留英文**，这是教学准确性所需；中英文分词差异本身也值得作为知识点单独讲解。

## 已知局限

1. **5 张正文插图内的英文标签尚未替换**：`static/article_assets/` 下的 `embedding.png`、`attention.png`、`QKV.png`、`mlp.png`、`softmax.png` 是把英文界面截图后合成的位图，其中的 `Key / Query / Value / Out / Dot product / Scaling · Mask / Softmax · Dropout / Token / Positional Encoding` 等标签是像素而非文本，无法通过改代码翻译。需要重新绘制或在设计工具中替换文字（约 1–2 人日）。
2. **模型分片不在 git 仓库内**：`static/model-v2/`（约 660MB）被 `.gitignore` 排除，克隆后需按上文「关于模型文件」获取，否则页面会一直停留在「模型下载中」，但仍可用内置示例数据浏览全部可视化。
3. **示例输入保留英文**：原因见上文「为什么示例输入是英文？」。
4. 正文中指向 Hugging Face、YouTube 等站点的原始外链保留未动，国内访问可能需要自备网络条件。

## 部署说明

`npm run build` 产出纯静态站点（`build/`，约 660MB，其中模型占绝大部分）。

- 若托管在 GitHub Pages，由于仓库不含模型分片，需要在构建前把模型放回 `static/model-v2/`（例如在 CI 中从上游仓库拉取），否则线上只能浏览示例数据。
- 站点默认部署在子路径 `/transformer-explainer`（见 `svelte.config.js` 的 `paths.base`）；若部署到独立域名根路径，请把 `base` 改为 `''`。
- 页面已移除 Google Fonts 外链、改用自托管字体；GTM/GA 仅在设置 `VITE_GTM_ID` / `VITE_GA_ID` 环境变量时才会加载。

## 许可与致谢

本项目沿用上游的 [MIT License](./LICENSE)，版权归 Polo Club of Data Science 所有；中文翻译部分的改动同样以 MIT 许可证发布。

原项目作者：

Aeree Cho、Grace C. Kim、Alexander Karpekov、Seongmin Lee、Alec Helbling、Benjamin Hoover、Zijie J. Wang、Minsuk Kahng、Duen Horng Chau（Georgia Institute of Technology）

原论文：

> **Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation and Experimentation**
> Aeree Cho, Grace C. Kim, Alexander Karpekov, Seongmin Lee, Alec Helbling, Benjamin Hoover, Zijie J. Wang, Minsuk Kahng, Duen Horng Chau.
> _Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems._

Logo 字体 Jersey 10 采用 SIL Open Font License 1.1，见 `static/fonts/licenses/OFL.txt`。

> 本项目为非官方翻译版本，与原作者及 Georgia Institute of Technology 无隶属关系。如用于教学或公开发布，请保留上述署名与原项目链接。
