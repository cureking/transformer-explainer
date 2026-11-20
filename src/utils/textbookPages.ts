import { get } from 'svelte/store';
import {
	expandedBlock,
	weightPopover,
	isBoundingBoxActive,
	textbookCurrentPageId,
	isExpandOrCollapseRunning,
	isFetchingModel,
	userId
} from '~/store';
import {
	highlightElements,
	removeHighlightFromElements,
	applyTransformerBoundingHeight,
	resetElementsHeight,
	highlightAttentionPath,
	removeAttentionPathHighlight,
	removeFingerFromElements
} from '~/utils/textbook';
import { drawResidualLine } from './animation';

export interface TextbookPage {
	id: string;
	title: string;
	content?: string;
	component?: any;
	timeoutId?: number;
	on: () => void;
	out: () => void;
	complete?: () => void;
}

const { drawLine, removeLine } = drawResidualLine();

export const textPages: TextbookPage[] = [
	{
		id: 'what-is-transformer',
		title: '什么是 Transformer？',
		content: `<p><strong>Transformer</strong> 是现代 AI 背后的核心架构，ChatGPT 和 Gemini 等模型都由它驱动。它于 2017 年提出，彻底改变了 AI 处理信息的方式。同一套架构既用于在海量数据集上训练，也用于推理生成输出。这里我们使用 GPT-2 (small)，它比新模型更简单，却非常适合用来学习基础知识。</p>
`,
		on: () => {},
		out: () => {}
	},
	{
		id: 'how-transformers-work',
		title: 'Transformer 是如何工作的？',
		content: `<p>Transformer 并不神秘——它通过不断追问一个问题，一步一步地构建文本：</p>
	<blockquote class="question">
		「在这个输入之后，最可能出现的下一个词是什么？」
	</blockquote>
	<p>这里我们探索一个训练好的模型如何生成文本。写下你自己的文本或使用示例，然后点击 <strong>生成</strong> 查看效果。如果模型尚未准备好，可以试试另一个 <strong>示例</strong>。</p>`,
		on: () => {
			highlightElements(['.input-form']);
			if (get(isFetchingModel)) {
				highlightElements(['.input-form .select-button']);
			} else {
				highlightElements(['.input-form .generate-button']);
			}
		},
		out: () => {
			removeHighlightFromElements([
				'.input-form',
				'.input-form .select-button',
				'.input-form .generate-button'
			]);
		},
		complete: () => {
			removeFingerFromElements(['.input-form .select-button', '.input-form .generate-button']);
			if (get(textbookCurrentPageId) === 'how-transformers-work') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'how-transformers-work'
				});
			}
		}
	},
	{
		id: 'transformer-architecture',
		title: 'Transformer 架构',
		content:
			'<p>Transformer 包含三个主要部分：</p><div class="numbered-list"><div class="numbered-item"><span class="number-circle">1</span><div class="item-content"><strong>嵌入（embedding）</strong>把文本转换成数字。</div></div><div class="numbered-item"><span class="number-circle">2</span><div class="item-content"><strong>Transformer 块</strong>用自注意力（self-attention）混合信息，再用多层感知机（MLP）提炼。</div></div><div class="numbered-item"><span class="number-circle">3</span><div class="item-content"><strong>概率（probabilities）</strong>决定每个词元（token）成为下一个词元的可能性。</div></div></div>',
		on: () => {
			const selectors = [
				'.step.embedding',
				'.step.softmax',
				'.transformer-bounding',
				'.transformer-bounding-title'
			];
			highlightElements(selectors);
			applyTransformerBoundingHeight(['.softmax-bounding', '.embedding-bounding']);
		},
		out: () => {
			const selectors = [
				'.step.embedding',
				'.step.softmax',
				'.transformer-bounding',
				'.transformer-bounding-title'
			];
			removeHighlightFromElements(selectors);
			resetElementsHeight(['.softmax-bounding', '.embedding-bounding']);
		}
	},
	{
		id: 'embedding',
		title: '嵌入',
		content: `<p>Transformer 在使用文本之前，会先把文本拆分成更小的单元，并把每个单元表示成一个数字列表（向量）。这个过程称为<strong>嵌入（embedding）</strong>，这个词既可以指这个过程，也可以指得到的向量。</p><p>在本工具中，每个向量都显示为一个矩形，将鼠标悬停在上面即可查看它的维度。</p>`,
		on: () => {
			highlightElements(['.step.embedding .title']);
		},
		out: () => {
			removeHighlightFromElements(['.step.embedding .title']);
		},
		complete: () => {
			removeFingerFromElements(['.step.embedding .title']);
			if (get(textbookCurrentPageId) === 'embedding') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'embedding'
				});
			}
		}
	},
	{
		id: 'token-embedding',
		title: '词元嵌入',
		content: `<p><strong>分词（tokenization）</strong>把输入文本切分成词元（token）——像单词或单词片段这样的小单元。GPT-2 (small) 的词表包含 50,257 个词元，每个词元都有唯一的 ID。</p><p>在<strong>词元嵌入（token embedding）</strong>步骤中，每个词元都会从一张大型查找表中匹配到一个 768 维向量。这些向量在训练过程中学习得到，以尽可能准确地表示每个词元的含义。</p>`,
		on: function () {
			const selectors = [
				'.token-column .column.token-string',
				'.token-column .column.token-embedding'
			];
			if (get(expandedBlock).id !== 'embedding') {
				expandedBlock.set({ id: 'embedding' });
				this.timeoutId = setTimeout(() => {
					highlightElements(selectors);
				}, 500);
			} else {
				highlightElements(selectors);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			const selectors = [
				'.token-column .column.token-string',
				'.token-column .column.token-embedding'
			];
			removeHighlightFromElements(selectors);
			if (get(textbookCurrentPageId) !== 'positional-encoding') expandedBlock.set({ id: null });
		}
	},
	{
		id: 'positional-encoding',
		title: '位置编码',
		content: `<p>在语言中，词的顺序很重要。<strong>位置编码（positional encoding）</strong>为每个词元（token）提供它在序列中的位置信息。</p><p>GPT-2 的做法是把可学习的位置嵌入（positional embedding）加到词元的嵌入上，而更新的模型可能采用其他方法，例如 RoPE：它通过旋转某些向量来编码位置。这些方法的共同目标，都是帮助模型理解文本中的顺序。</p>`,
		on: function () {
			const selectors = [
				'.token-column .column.position-embedding',
				'.token-column .column.symbol'
			];
			if (get(expandedBlock).id !== 'embedding') {
				expandedBlock.set({ id: 'embedding' });
				this.timeoutId = setTimeout(() => {
					highlightElements(selectors);
				}, 500);
			} else {
				highlightElements(selectors);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			const selectors = [
				'.token-column .column.position-embedding',
				'.token-column .column.symbol'
			];
			removeHighlightFromElements(selectors);
			if (get(textbookCurrentPageId) !== 'token-embedding') expandedBlock.set({ id: null });
		}
	},
	{
		id: 'blocks',
		title: '重复的 Transformer 块',
		content: `<p><strong>Transformer 块</strong>是模型中的主要处理单元，包含两个部分：</p><ul><li><strong>多头自注意力（multi-head self-attention）</strong>——让词元（token）之间共享信息</li><li><strong>多层感知机（MLP）</strong>——提炼每个词元的细节</li></ul><p>模型会把许多块堆叠起来，词元的表示在逐层通过时变得更加丰富。GPT-2 (small) 共有 12 个这样的块。</p>`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements([
						'.transformer-bounding',
						'.step.transformer-blocks .guide',
						'.attention > .title',
						'.mlp > .title'
					]);
					highlightElements(['.transformer-bounding-title'], 'textbook-button-highlight');
					isBoundingBoxActive.set(true);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.transformer-bounding',
				'.step.transformer-blocks .guide',
				'.attention > .title',
				'.mlp > .title'
			]);
			removeHighlightFromElements(['.transformer-bounding-title'], 'textbook-button-highlight');
			isBoundingBoxActive.set(false);
		},
		complete: () => {
			removeFingerFromElements(['.transformer-bounding-title']);
			if (get(textbookCurrentPageId) === 'blocks') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'blocks'
				});
			}
		}
	},
	{
		id: 'self-attention',
		title: '多头自注意力',
		content:
			'<p><strong>自注意力（self-attention）</strong>让模型判断输入中的哪些部分与每个词元（token）最相关。这有助于模型捕捉语义和关系，即使两个词相隔很远。</p><p>在<strong>多头（multi-head）</strong>形式下，模型会并行运行多个注意力过程，每个过程关注文本中不同的模式。</p>',
		on: () => {
			highlightElements(['.step.attention']);
		},
		out: () => {
			removeHighlightFromElements(['.step.attention']);
		}
	},
	{
		id: 'qkv',
		title: '查询、键、值',
		content: `
	<p>为了执行自注意力（self-attention），每个词元（token）的嵌入（embedding）都会被转换成
  <span class="highlight">三个新的嵌入</span>——
  <span class="blue">查询（Query）</span>、
  <span class="red">键（Key）</span>和
  <span class="green">值（Value）</span>。
  这一转换通过对每个词元嵌入施加不同的权重（weight）和偏置（bias）来完成。这些参数（权重和偏置）会在训练中得到优化。</p>

<p>创建之后，<span class="blue">查询</span>会与<span class="red">键</span>比较以衡量相关性，再用这种相关性为<span class="green">值</span>加权。</p>
`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['g.path-group.qkv', '.step.qkv .qkv-column']);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['g.path-group.qkv', '.step.qkv .qkv-column']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.step.qkv .qkv-column']);
			if (get(textbookCurrentPageId) === 'qkv') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'qkv'
				});
			}
		}
	},

	{
		id: 'multi-head',
		title: '多头',
		content:
			'<p>在创建 <span class="blue">Q</span>、<span class="red">K</span>、<span class="green">V</span> 嵌入之后，模型会把它们拆分成若干个<strong>头（head）</strong>（GPT-2 small 中有 12 个）。每个头使用自己的一套更小的 <span class="blue">Q</span>/<span class="red">K</span>/<span class="green">V</span>，关注文本中不同的模式——例如语法、语义或长距离关联。</p><p>多个头让模型可以并行学习多种关系，从而获得更丰富的理解。</p>',
		on: () => {
			highlightAttentionPath();
			highlightElements(['.multi-head .head-title']);
		},
		out: () => {
			removeAttentionPathHighlight();
			removeHighlightFromElements(['.multi-head .head-title']);
		},
		complete: () => {
			removeFingerFromElements(['.multi-head .head-title']);
			if (get(textbookCurrentPageId) === 'multi-head') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'multi-head'
				});
			}
		}
	},
	{
		id: 'masked-self-attention',
		title: '掩码自注意力',
		content: `<p>在每个头中，模型会决定每个词元（token）对其他词元的关注程度：</p><ul><li><strong>点积（Dot Product）</strong>——把<span class="blue">查询（Query）</span>/<span class="red">键（Key）</span>向量中对应的数值相乘再求和，得到<span class="purple">注意力分数</span>（attention scores）。</li><li><strong>掩码（Mask）</strong>——遮蔽未来的词元，使它无法提前看到后面的内容。</li><li><strong>Softmax</strong>——把分数转换成概率，每行之和为 1，表示模型对更早词元的关注程度。</li></ul>`,
		on: () => {
			highlightAttentionPath();
			highlightElements(['.attention-matrix.attention-result']);
		},
		out: () => {
			removeAttentionPathHighlight();
			removeHighlightFromElements(['.attention-matrix.attention-result']);
			expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.attention-matrix.attention-result']);
			if (get(textbookCurrentPageId) === 'masked-self-attention') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'masked-self-attention'
				});
			}
		}
	},
	{
		id: 'output-concatenation',
		title: '注意力输出与拼接',
		content:
			'<p>每个头都会<span class="highlight">把它的<span class="purple">注意力分数</span>与<span class="green">值</span>嵌入相乘，得到自己的注意力输出</span>——这是每个词元（token）在考虑上下文之后得到的、经过提炼的表示。</p><p>GPT-2 (small) 有 12 个这样的输出，它们会被拼接（concatenation）成一个与原始维度相同的向量（768 个数值）。</p>',
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['path.to-attention-out.value-to-out', '.attention .column.out']);
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['path.to-attention-out.value-to-out', '.attention .column.out']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.attention .column.out']);
			if (get(textbookCurrentPageId) === 'output-concatenation') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-concatenation'
				});
			}
		}
	},
	{
		id: 'mlp',
		title: '多层感知机（MLP）',
		content:
			'<p>注意力输出会经过<strong>多层感知机（MLP）</strong>来提炼词元（token）的表示。线性层（Linear）利用学习到的权重和偏置改变嵌入的数值和维度，随后由非线性激活函数决定每个数值通过多少。</p><p>激活函数有很多种，GPT-2 使用的是 <strong>GELU</strong>：它让较小的数值部分通过、较大的数值完全通过，从而同时捕捉细微和明显的模式。</p>',
		on: () => {
			highlightElements(['.step.mlp', '.operation-col.activation']);
		},
		out: () => {
			removeHighlightFromElements(['.step.mlp', '.operation-col.activation']);
		}
	},

	{
		id: 'output-logit',
		title: '输出 logits',
		content: `<p>经过所有 Transformer 块之后，最后一个词元（token）的输出嵌入（已融合此前所有词元的上下文信息）会与最后一层中学习到的权重相乘。</p><p>由此得到的 <strong>logits</strong>（未归一化得分）是 50,257 个数值——GPT-2 词表中的每个词元各对应一个——表示每个词元成为下一个词元的可能性有多大。</p>`,
		on: () => {
			highlightElements(['g.path-group.softmax', '.column.final']);
		},
		out: () => {
			removeHighlightFromElements(['g.path-group.softmax', '.column.final']);
			weightPopover.set(null);
		},
		complete: () => {
			removeFingerFromElements(['.column.final']);
			if (get(textbookCurrentPageId) === 'output-logit') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-logit'
				});
			}
		}
	},
	{
		id: 'output-probabilities',
		title: '概率',
		content:
			'<p>logits 只是原始得分。为了便于解读，我们会把它们转换成 0 到 1 之间的<strong>概率（probabilities）</strong>，且所有概率之和为 1。这样就能知道每个词元（token）成为下一个词的可能性。</p><p>我们不必总是挑选概率最高的词元，也可以采用不同的选择策略，在生成文本的安全性与创造性之间取得平衡。</p>',
		on: () => {
			highlightElements(['.step.softmax .title']);
		},
		out: () => {
			removeHighlightFromElements(['.step.softmax .title']);
		},
		complete: () => {
			removeFingerFromElements(['.step.softmax .title']);
			if (get(textbookCurrentPageId) === 'output-probabilities') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'output-probabilities'
				});
			}
		}
	},
	{
		id: 'temperature',
		title: '温度',
		content:
			'<p><strong>温度（temperature）</strong>的作用方式，是在把 logits 转换成概率之前先对其进行缩放。较低的<strong>温度</strong>（例如 0.2）会让大的 logits 更大、小的 logits 更小，从而偏向得分最高的词元，带来更<strong>可预测的选择</strong>；较高的<strong>温度</strong>（例如 1.0 或更高）会拉平差异，让可能性较低的词元（token）更有竞争力，从而带来更<strong>有创造性的输出</strong>。</p>',
		on: function () {
			if (get(expandedBlock).id !== 'softmax') {
				expandedBlock.set({ id: 'softmax' });
				this.timeoutId = setTimeout(() => {
					highlightElements([
						'.formula-step.scaled',
						'.title-box.scaled',
						'.content-box.scaled',
						'.temperature-input'
					]);
				}, 500);
			} else {
				highlightElements([
					'.formula-step.scaled',
					'.title-box.scaled',
					'.content-box.scaled',
					'.temperature-input'
				]);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.formula-step.scaled',
				'.title-box.scaled',
				'.temperature-input',
				'.content-box.scaled'
			]);
			if (!['temperature', 'sampling'].includes(get(textbookCurrentPageId)))
				expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.temperature-input']);
			if (get(textbookCurrentPageId) === 'temperature') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'temperature'
				});
			}
		}
	},
	{
		id: 'sampling',
		title: '采样策略',
		content:
			'<p>最后，我们需要一种策略来挑选下一个词元（token）。常见的有以下几种：贪心解码（greedy decoding）直接选择概率最高的一个；<strong>Top-k</strong> 只保留可能性最大的 k 个词元；<strong>Top-p</strong> 保留总概率至少为 p 的最小集合——提前剔除可能性较低的词元。</p><p>随后 Softmax 会把剩余的 logits 转换成概率，再从允许的集合中随机挑选一个词元。</p>',
		on: function () {
			if (get(expandedBlock).id !== 'softmax') {
				expandedBlock.set({ id: 'softmax' });
				this.timeoutId = setTimeout(() => {
					highlightElements([
						'.formula-step.sampling',
						'.title-box.sampling',
						'.sampling-input',
						'.content-box.sampling'
					]);
				}, 500);
			} else {
				highlightElements([
					'.formula-step.sampling',
					'.title-box.sampling',
					'.sampling-input',
					'.content-box.sampling'
				]);
			}
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements([
				'.formula-step.sampling',
				'.title-box.sampling',
				'.sampling-input',
				'.content-box.sampling'
			]);
			if (!['temperature', 'sampling'].includes(get(textbookCurrentPageId)))
				expandedBlock.set({ id: null });
		},
		complete: () => {
			removeFingerFromElements(['.sampling-input']);
			if (get(textbookCurrentPageId) === 'sampling') {
				window.dataLayer?.push({
					user_id: get(userId),
					event: `textbook-complete`,
					page_id: 'sampling'
				});
			}
		}
	},
	{
		id: 'residual',
		title: '残差连接',
		content: `<p>Transformer 还有一些辅助特性来提升模型性能。例如，<strong>残差连接（residual connection）</strong>会把某一层的输入加到它的输出上，避免信息在通过许多块时逐渐消失。在 GPT-2 中，每个块会使用两次残差连接，从而有效地训练更深的堆叠。</p>`,
		on: function () {
			this.timeoutId = setTimeout(
				() => {
					highlightElements(['.operation-col.residual', '.residual-start']);
					drawLine();
				},
				get(isExpandOrCollapseRunning) ? 500 : 0
			);
		},
		out: function () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			removeHighlightFromElements(['.operation-col.residual', '.residual-start']);
			removeLine();
		}
	},
	{
		id: 'layer-normalization',
		title: '层归一化',
		content: `<p><strong>层归一化（Layer Normalization）</strong>通过调整输入的数值，让它们的均值和方差保持稳定，从而帮助稳定训练与推理。这使模型对初始权重不那么敏感，也能更有效地学习。在 GPT-2 中，它会在自注意力（self-attention）之前、多层感知机（MLP）之前，以及最终输出之前各应用一次。</p>`,
		on: () => {
			highlightElements(['.operation-col.ln']);
		},
		out: () => {
			removeHighlightFromElements(['.operation-col.ln']);
		}
	},
	{
		id: 'dropout',
		title: 'Dropout',
		content: `<p>在训练过程中，<strong>Dropout</strong> 会随机关闭一些数值之间的连接，避免模型对特定模式过拟合。这有助于模型学到泛化性更好的特征。GPT-2 使用了 Dropout，而更新的大语言模型（LLM）常常跳过它：这些模型在海量数据集上训练，过拟合问题没有那么突出。在推理阶段，Dropout 会被关闭。</p>`,
		on: () => {
			highlightElements(['.operation-col.dropout']);
		},
		out: () => {
			removeHighlightFromElements(['.operation-col.dropout']);
		}
	}
	// {
	// 	id: 'final',
	// 	title: `Let's explore!`,
	// 	content: '',
	// 	on: () => {},
	// 	out: () => {}
	// }
];
