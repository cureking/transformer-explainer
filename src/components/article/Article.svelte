<script>
	import tailwindConfig from '../../../tailwind.config';
	import resolveConfig from 'tailwindcss/resolveConfig';
	import Katex from '~/utils/Katex.svelte';
</script>

<div id="description">
	<div class="article-section" data-click="article-intro">
		<h1>什么是 Transformer？</h1>

		<p>
			Transformer 是一种神经网络架构，它从根本上改变了人工智能的研究路径。Transformer 最早由 2017
			年那篇奠基性论文<a
				href="https://dl.acm.org/doi/10.5555/3295222.3295349"
				title="ACM Digital Library"
				target="_blank">“Attention is All You Need”</a>（《注意力就是你所需要的一切》）提出，此后成为深度学习模型的首选架构，驱动了 OpenAI 的
			<strong>GPT</strong>、Meta 的 <strong>Llama</strong> 和 Google 的
			<strong>Gemini</strong> 等文本生成式模型。除文本之外，Transformer 还被用于<a
				href="https://huggingface.co/learn/audio-course/en/chapter3/introduction"
				title="Hugging Face"
				target="_blank">音频生成</a
			>、<a
				href="https://huggingface.co/learn/computer-vision-course/unit3/vision-transformers/vision-transformers-for-image-classification"
				title="Hugging Face"
				target="_blank">图像识别</a
			>、<a href="https://elifesciences.org/articles/82819" title="eLife"
				>蛋白质结构预测</a
			>，甚至<a
				href="https://www.deeplearning.ai/the-batch/reinforcement-learning-plus-transformers-equals-efficiency/"
				title="Deep Learning AI"
				target="_blank">游戏对弈</a
			>，展现出它在众多领域中的通用性。
		</p>
		<p>
			从根本上说，文本生成式 Transformer 模型遵循<strong>下一词元预测（next-token prediction）</strong
			>的原理：给定用户输入的文本提示词，在它之后最可能出现的是哪个<em>下一个词元（可以是一个词，也可以是词的一部分）</em>？Transformer
			的核心创新与能力来自自注意力（self-attention）机制：相比之前的架构，它能更有效地处理整个序列并捕捉长距离依赖。
		</p>
		<p>
			GPT-2 系列模型是文本生成式 Transformer 的典型代表。Transformer Explainer 由
			<a href="https://huggingface.co/openai-community/gpt2" title="Hugging Face" target="_blank"
				>GPT-2</a
			>
			(small) 模型驱动，该模型有 1.24 亿参数。它虽然不是最新、最强的 Transformer
			模型，但与当前最先进的模型共享许多相同的架构组件和原理，因此是理解基础知识的理想起点。
		</p>
	</div>

	<div class="article-section" data-click="article-overview">
		<h1>Transformer 架构</h1>

		<p>
			每个文本生成式 Transformer 都由以下<strong>三个关键组件</strong>组成：
		</p>
		<ol>
			<li>
				<strong class="bold-purple">嵌入（Embedding）</strong>：文本输入会被拆分为更小的单元，称为词元（token），它可以是词，也可以是子词。这些词元会被转换成称为嵌入向量的数值向量，用来捕捉词语的语义。
			</li>
			<li>
				<strong class="bold-purple">Transformer 块</strong>是模型的基本构建单元，负责处理和变换输入数据。每个块包括：
				<ul class="">
					<li>
						<strong>注意力（attention）机制</strong>：Transformer
						块的核心组件。它让词元之间能够互相「通信」，捕捉上下文信息以及词与词之间的关系。
					</li>
					<li>
						<strong>多层感知机（MLP）层</strong>：一种前馈网络，独立处理每个词元。注意力层的目标是在词元之间传递信息，而
						MLP 的目标是细化每个词元的表示。
					</li>
				</ul>
			</li>
			<li>
				<strong class="bold-purple">输出概率</strong>：最后的线性层和 Softmax
				层把处理后的嵌入转换为概率，使模型能够预测序列中的下一个词元。
			</li>
		</ol>
	</div>

	<div class="article-section" id="embedding" data-click="article-embedding">
		<h2>嵌入</h2>
		<p>
			假设你想用 Transformer 模型生成文本。你会输入类似这样的提示词：<code
				>“Data visualization empowers users to”</code
			>。这段输入需要转换成模型能够理解和处理的格式。嵌入正是为此而生：它把文本转换成模型可以使用的数值表示。要把提示词转换为嵌入，我们需要：1）对输入进行分词（tokenization），2）获取词元嵌入，3）加入位置信息，最后
			4）把词元编码与位置编码相加，得到最终的嵌入。下面看看每一步具体是怎么做的。
		</p>
		<div class="figure">
			<img src="./article_assets/embedding.png" width="65%" />
		</div>
		<div class="figure-caption">
			图 <span class="attention">1</span>. 展开嵌入层视图，展示输入提示词如何被转换为向量表示。该过程包括<span class="fig-numbering">（1）</span>分词、（2）词元嵌入、（3）位置编码，以及（4）最终嵌入。
		</div>
		<div class="article-subsection">
			<h3>第 1 步：分词</h3>
			<p>
				分词是把输入文本拆解成更小、更易处理的片段（称为词元）的过程。这些词元可以是一个词，也可以是子词。<code
					>"Data"</code
				>
				和 <code>"visualization"</code> 各自对应一个独立的词元，而 <code>"empowers"</code>
				会被拆成两个词元。完整的词表（vocabulary）在训练模型之前就已确定：GPT-2 的词表包含
				<code>50,257</code> 个不同的词元。现在，输入文本已经被拆成带不同
				ID 的词元，接下来就可以从嵌入中得到它们的向量表示。
			</p>
		</div>
		<div class="article-subsection" id="article-token-embedding">
			<h3>第 2 步：词元嵌入</h3>
			<p>
				GPT-2 (small) 把词表中的每个词元表示为一个 768
				维向量；向量的维度取决于具体模型。这些嵌入向量存储在一个形状为
				<code>(50,257, 768)</code> 的矩阵中，包含大约 3900 万个参数！这个庞大的矩阵让模型能够为每个词元赋予语义：在语言中用法或含义相近的词元，在这个高维空间里彼此靠近；而不相似的词元则相距较远。
			</p>
		</div>
		<div class="article-subsection" id="article-positional-embedding">
			<h3>第 3 步：位置编码（Positional Encoding）</h3>
			<p>
				嵌入层还会编码每个词元在输入提示词中位置的信息。不同模型采用不同的位置编码方法。GPT-2
				从头训练自己的位置编码矩阵，并把它直接纳入训练过程。
			</p>

			<!-- <div class="article-subsection-l2">
	<h4>Alternative Positional Encoding Approach <strong class='attention'>[POTENTIALLY COLLAPSIBLE]</strong></h4>
	<p>
	  Other models, like the original Transformer and BERT,
	  use sinusoidal functions for positional encoding.

	  This sinusoidal encoding is deterministic and designed to reflect
	  the absolute as well as the relative position of each token.
	</p>
	<p>
	  Each position in a sequence is assigned a unique mathematical
	  representation using a combination of sine and cosine functions.

	  For a given position, the sine function represents even dimensions,
	  and the cosine function represents odd dimensions within the positional encoding vector.

	  This periodic nature ensures that each position has a consistent encoding,
	  independent of the surrounding context.
	</p>

	<p>
	  Here’s how it works:
	</p>

	<span class='attention'>
	  SINUSOIDAL POSITIONAL ENCODING EQUATION
	</span>

	<ul>
	  <li>
		<strong>Sine Function</strong>: Used for even indices of the embedding vector.
	  </li>
	  <li>
		<strong>Cosine Function</strong>: Used for odd indices of the embedding vector.
	</ul>

	<p>
	  Hover over individual encoding values in the matrix above to
	  see how it's calculated using the sins and cosine functions.
	</p>
  </div> -->
		</div>
		<div class="article-subsection">
			<h3>第 4 步：最终嵌入</h3>
			<p>
				最后，我们把词元编码与位置编码相加，得到最终的嵌入表示。这个组合后的表示既包含词元的语义，也包含它们在输入序列中的位置。
			</p>
		</div>
	</div>

	<div class="article-section" data-click="article-transformer-block">
		<h2>Transformer 块</h2>

		<p>
			Transformer 处理的核心在于 Transformer 块，它由多头自注意力（multi-head self-attention）和多层感知机层组成。大多数模型都包含多个这样的块，它们依次堆叠在一起。词元表示会逐层演变，从第一个块传到最后一个块，使模型逐步构建对每个词元的细致理解。这种分层处理带来了输入的高阶表示。我们正在观察的
			GPT-2 (small) 模型就由 <code>12</code> 个这样的块组成。
		</p>
	</div>

	<div class="article-section" id="self-attention" data-click="article-attention">
		<h3>多头自注意力</h3>
		<p>
			自注意力机制让模型能够捕捉序列中词元之间的关系，因此每个词元的表示都会受到其他词元的影响。多个注意力头让模型可以从不同角度考虑这些关系：例如，一个头可能捕捉短距离的句法联系，另一个头则追踪范围更大的语义上下文。下面我们逐步梳理多头自注意力的计算过程。
		</p>
		<div class="article-subsection-l2">
			<h4>第 1 步：查询（Query）、键（Key）和值（Value）矩阵</h4>

			<div class="figure pt-10">
				<img src="./article_assets/QKV.png" width="80%" />
				<div class="text-xs">
					<Katex
						displayMode
						math={`
		QKV_{ij} = ( \\sum_{d=1}^{768} \\text{Embedding}_{i,d} \\cdot \\text{Weights}_{d,j}) + \\text{Bias}_j
		`}
					/>
				</div>
			</div>
			<div class="figure-caption">
				图 <span class="attention">2</span>. 由原始嵌入计算查询、键和值矩阵。
			</div>

			<p>
				每个词元的嵌入向量都会被转换成三个向量：<span class="q-color">查询（Q）</span>、<span class="k-color">键（K）</span>和<span class="v-color">值（V）</span>。这些向量由输入嵌入矩阵与
				<span class="q-color">Q</span>、<span class="k-color">K</span> 和
				<span class="v-color">V</span> 各自学习到的权重矩阵相乘得到。下面用一个网页搜索的类比，帮助理解这三个矩阵背后的直觉：
			</p>
			<ul>
				<li>
					<strong class="q-color font-medium">查询（Q）</strong>是你在搜索引擎搜索框中输入的搜索文字，也就是你想要<em>「查找更多信息」</em>的那个词元。
				</li>
				<li>
					<strong class="k-color font-medium">键（K）</strong>是搜索结果窗口中每个网页的标题，代表查询可以「关注」的那些候选词元。
				</li>
				<li>
					<strong class="v-color font-medium">值（V）</strong>是网页实际展示的内容。当我们把合适的搜索词（查询）与相关结果（键）匹配起来之后，就希望获取最相关页面的内容（值）。
				</li>
			</ul>
			<p>
				借助这些 QKV 值，模型可以计算注意力得分，由此决定生成预测时每个词元应获得多少关注。
			</p>
		</div>
		<div class="article-subsection-l2">
			<h4>第 2 步：多头拆分</h4>
			<p>
				<span class="q-color">查询</span>、<span class="k-color">键</span>和<span class="v-color">值</span>向量会被拆分成多个头——在 GPT-2 (small) 中拆成
				<code>12</code> 个头。每个头独立处理嵌入的一部分，捕捉不同的句法和语义关系。这种设计便于并行学习多样化的语言特征，从而提升模型的表示能力。
			</p>
		</div>
		<div class="article-subsection-l2">
			<h4>第 3 步：掩码自注意力</h4>
			<p>
				在每个头中，我们进行掩码自注意力计算。该机制让模型在生成序列时既能关注输入中的相关部分，又能避免接触到后面的词元。
			</p>

			<div class="figure">
				<img src="./article_assets/attention.png" width="80%" align="middle" />
			</div>
			<div class="figure-caption">
				图 <span class="attention">3</span>. 使用查询、键和值矩阵计算掩码自注意力。
			</div>

			<ul>
				<li>
					<strong>点积</strong>：<span class="q-color">查询</span>矩阵与<span class="k-color">键</span>矩阵的点积决定了<strong>注意力得分</strong>，得到的是一个方阵，反映所有输入词元之间的关系。
				</li>
				<li>
					<strong>缩放 · 掩码</strong>：先对注意力得分做缩放，再在注意力矩阵的上三角部分加掩码，把这些值设为负无穷，从而阻止模型接触到后面的词元。模型必须学会在不「偷看」未来的前提下预测下一个词元。
				</li>
				<li>
					<strong>Softmax · Dropout</strong>：完成掩码和缩放后，用 Softmax
					运算把注意力得分转换为概率，再视情况用 Dropout 做正则化。矩阵的每一行之和为
					1，表示它左侧每个词元与它的相关程度。
				</li>
			</ul>
		</div>
		<div class="article-subsection-l2">
			<h4>第 4 步：输出与拼接</h4>
			<p>
				模型用掩码自注意力得分乘以<span class="v-color">值</span>矩阵，得到自注意力机制的<span class="purple-color">最终输出</span>。GPT-2 有 <code>12</code>
				个自注意力头，每个头捕捉词元之间不同的关系。这些头的输出会被拼接起来，再经过一次线性投影。
			</p>
		</div>
	</div>

	<div class="article-section" id="article-activation" data-click="article-mlp">
		<h3>MLP：多层感知机</h3>

		<div class="figure">
			<img src="./article_assets/mlp.png" width="70%" align="middle" />
		</div>
		<div class="figure-caption">
			图 <span class="attention">4</span>. 用 MLP
			层把自注意力的表示投影到更高维度，以增强模型的表示能力。
		</div>

		<p>
			在自注意力的多个头捕捉到输入词元之间各种关系之后，拼接后的输出会经过多层感知机（MLP）层，以增强模型的表示能力。MLP
			块由两次线性变换组成，中间夹一个
			<a
				href="https://en.wikipedia.org/wiki/Rectified_linear_unit#Gaussian-error_linear_unit_(GELU)"
				>GeLU</a
			> 激活函数。
		</p>
		<p>
			第一次线性变换把输入的维度扩大四倍，从 <code>768</code>
			扩展到
			<code>3072</code>。这个扩展步骤让模型能把词元表示投影到更高维的空间中，从而捕捉在原维度下可能看不出来的更丰富、更复杂的模式。
		</p>
		<p>
			第二次线性变换再把维度降回原来的 <code>768</code>。这个压缩步骤把表示恢复到便于处理的大小，同时保留扩展步骤中引入的有用非线性变换。
		</p>
		<p>
			与跨词元整合信息的自注意力机制不同，MLP
			独立处理每个词元，只是把每个词元的表示从一个空间映射到另一个空间，从而丰富模型整体的表达能力。
		</p>
	</div>

	<div class="article-section" id="article-prob" data-click="article-prob">
		<h2>输出概率</h2>
		<p>
			输入经过所有 Transformer 块处理后，输出会送入最后的线性层，为词元预测做好准备。这一层把最终的表示投影到一个
			<code>50,257</code>
			维的空间中，词表里的每个词元都有一个对应的值，称为 <code>logit</code>，也就是
			logits（未归一化得分）。任何一个词元都可能成为下一个词，因此这一步让我们可以按各词元成为下一个词的可能性对它们排序。接着我们用
			Softmax 函数把 logits 转换成总和为 1
			的概率分布，这样就可以根据可能性对下一个词元进行采样。
		</p>

		<div class="figure py-5">
			<img src="./article_assets/softmax.png" width="70%" />
		</div>
		<div class="figure-caption">
			图 <span class="attention">5</span>. 词表中的每个词元都会根据模型输出的 logits
			得到一个概率。这些概率决定了每个词元成为序列中下一个词的可能性。
		</div>

		<p id="article-temperature" data-click="article-temperature">
			最后一步是从这个分布中采样，生成下一个词元。<code
				>temperature</code
			>
			这个超参数在此过程中起着关键作用。从数学上看，这个操作非常简单：把模型输出的 logits 除以
			<code>temperature</code>：
		</p>

		<ul>
			<li>
				<code>temperature = 1</code>：用 1 去除 logits 对 Softmax 的输出没有影响。
			</li>
			<li>
				<code>temperature &lt; 1</code>：较低的温度会锐化概率分布，使模型更有把握、更确定，输出也更可预测。
			</li>
			<li>
				<code>temperature &gt; 1</code>：较高的温度会得到更平缓的概率分布，让生成的文本更具随机性——也就是一些人所说的模型<em>「创造力」</em>。
			</li>
		</ul>

		<p id="article-sampling" data-click="article-sampling">
			此外，还可以用 <code>top-k</code>
			和
			<code>top-p</code> 参数进一步控制采样过程：
		</p>
		<ul>
			<li>
				<code>top-k sampling</code>：把候选词元限制为概率最高的前 k 个词元，过滤掉可能性较低的选项。
			</li>
			<li>
				<code>top-p sampling</code>：考虑累积概率超过阈值 p
				的最小词元集合，在保证只由最可能的词元参与的同时仍保留多样性。
			</li>
		</ul>
		<p>
			通过调节 <code>temperature</code>、<code>top-k</code> 和 <code>top-p</code>，你可以在确定性与多样性之间取得平衡，按具体需求调整模型的行为。
		</p>
	</div>

	<div class="article-section" data-click="article-advanced-features">
		<h2>辅助架构特性</h2>

		<p>
			还有一些辅助架构特性可以提升 Transformer
			模型的性能。它们对模型的整体表现很重要，但对于理解架构的核心概念并不那么关键。层归一化（layer
			normalization）、Dropout 和残差连接（residual connection）是 Transformer
			模型的重要组成部分，在训练阶段尤其如此。层归一化可以稳定训练，帮助模型更快收敛。Dropout
			通过随机停用神经元来防止过拟合。残差连接让梯度可以直接流过网络，有助于缓解梯度消失问题。
		</p>
		<div class="article-subsection" id="article-ln">
			<h3>层归一化</h3>

			<p>
				层归一化有助于稳定训练过程并改善收敛。它的做法是在特征维度上对输入做归一化，保证激活值的均值和方差保持一致。这种归一化可以缓解内部协变量偏移带来的问题，让模型学得更有效，并降低对初始权重的敏感度。每个
				Transformer 块中会应用两次层归一化：一次在自注意力机制之前，一次在 MLP 层之前。
			</p>
		</div>
		<div class="article-subsection" id="article-dropout">
			<h3>Dropout</h3>

			<p>
				Dropout
				是一种正则化技术，通过在训练时随机把一部分模型权重置零来防止神经网络过拟合。它促使模型学习更稳健的特征，减少对特定神经元的依赖，从而让网络更好地泛化到新的、未见过的数据。在模型推理（inference）阶段，Dropout
				会被停用。这实际上意味着我们使用了一个由多个已训练子网络组成的集成，因而能获得更好的模型表现。
			</p>
		</div>
		<div class="article-subsection" id="article-residual">
			<h3>残差连接</h3>

			<p>
				残差连接最早于 2015 年在 ResNet
				模型中提出。这一架构创新让训练非常深的神经网络成为可能，从而革新了深度学习。本质上，残差连接是绕过一层或多层的「捷径」，把某一层的输入加到它的输出上。这有助于缓解梯度消失问题，使训练由多个
				Transformer
				块层层堆叠而成的深层网络更容易。在 GPT-2 中，每个 Transformer
				块内会使用两次残差连接：一次在 MLP 之前，一次在 MLP
				之后，以确保梯度更顺畅地流动，并让更早的层在反向传播时获得足够的更新。
			</p>
		</div>
	</div>

	<div class="article-section" data-click="article-interactive-features">
		<h1>交互功能</h1>
		<p>
			Transformer Explainer
			被设计成可交互的形式，让你可以探索 Transformer 的内部工作机制。以下是一些你可以动手尝试的交互功能：
		</p>

		<ul>
			<li>
				<strong>输入你自己的文本序列</strong>，看看模型如何处理它并预测下一个词。你可以探索注意力权重和中间计算过程，了解最终输出概率是如何算出来的。
			</li>
			<li>
				<strong>拖动温度滑块</strong>控制模型预测的随机性。试试改变温度值，看看如何让模型的输出更确定或更有创造力。
			</li>
			<li>
				<strong>选择 Top-k 和 Top-p 采样方法</strong>，调整推理阶段的采样行为。尝试不同的取值，观察概率分布如何变化并影响模型的预测。
			</li>
			<li>
				<strong>与注意力图互动</strong>，看看模型如何关注输入序列中的不同词元。把鼠标悬停在词元上，可以高亮它们的注意力权重，进而探索模型如何捕捉上下文以及词与词之间的关系。
			</li>
		</ul>
	</div>

	<div class="article-section" data-click="article-video">
		<h2>视频教程</h2>
		<div class="video-container">
			<iframe
				src="https://www.youtube.com/embed/ECR4oAwocjs"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			>
			</iframe>
		</div>
	</div>

	<div class="article-section" data-click="article-implementation">
		<h2>Transformer Explainer 是如何实现的？</h2>
		<p>
			Transformer Explainer 内置一个直接在浏览器中运行的实时 GPT-2 (small) 模型。该模型由 Andrej
			Karpathy 的
			<a href="https://github.com/karpathy/nanoGPT" title="Github" target="_blank"
				>nanoGPT 项目</a>中的 PyTorch GPT 实现派生而来，并已转换为
			<a href="https://onnxruntime.ai/" title="ONNX" target="_blank">ONNX Runtime</a>，以便在浏览器中无缝运行。界面用 JavaScript 构建，以
			<a href="https://kit.svelte.dev/" title="Svelte" target="_blank">Svelte</a>
			作为前端框架，并用
			<a href="https://d3js.org/" title="D3" target="_blank">D3.js</a>
			创建动态可视化。数值会随用户输入实时更新。
		</p>
	</div>

	<div class="article-section" data-click="article-credit">
		<h2>Transformer Explainer 是谁开发的？</h2>
		<p>
			Transformer Explainer 由佐治亚理工学院（Georgia Institute of Technology）的

			<a href="https://aereeeee.github.io/" target="_blank">Aeree Cho</a>、<a href="https://www.linkedin.com/in/chaeyeonggracekim/" target="_blank">Grace C. Kim</a>、<a href="https://alexkarpekov.com/" target="_blank">Alexander Karpekov</a>、<a href="https://alechelbling.com/" target="_blank">Alec Helbling</a>、<a href="https://zijie.wang/" target="_blank">Jay Wang</a>、<a href="https://seongmin.xyz/" target="_blank">Seongmin Lee</a>、<a href="https://bhoov.com/" target="_blank">Benjamin Hoover</a> 和
			<a href="https://poloclub.github.io/polochau/" target="_blank">Polo Chau</a>

			开发。
		</p>
	</div>
</div>

<style lang="scss">
	a {
		color: theme('colors.blue.500');

		&:hover {
			color: theme('colors.blue.700');
		}
	}

	.bold-purple {
		color: theme('colors.purple.700');
		font-weight: bold;
	}

	code {
		color: theme('colors.gray.500');
		background-color: theme('colors.gray.50');
		font-family: theme('fontFamily.mono');
	}

	.q-color {
		color: theme('colors.blue.400');
	}

	.k-color {
		color: theme('colors.red.400');
	}

	.v-color {
		color: theme('colors.green.400');
	}

	.purple-color {
		color: theme('colors.purple.500');
	}

	.article-section {
		padding-bottom: 2rem;
	}
	.architecture-section {
		padding-top: 1rem;
	}
	.video-container {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 aspect ratio */
		height: 0;
		overflow: hidden;
		max-width: 100%;
		background: #000;
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	#description {
		padding-bottom: 3rem;
		margin-left: auto;
		margin-right: auto;
		max-width: 78ch;
	}

	#description h1 {
		color: theme('colors.purple.700');
		font-size: 2.2rem;
		font-weight: 300;
		padding-top: 1rem;
	}

	#description h2 {
		// color: #444;
		color: theme('colors.purple.700');
		font-size: 2rem;
		font-weight: 300;
		padding-top: 1rem;
	}

	#description h3 {
		color: theme('colors.gray.700');
		font-size: 1.6rem;
		font-weight: 200;
		padding-top: 1rem;
	}

	#description h4 {
		color: theme('colors.gray.700');
		font-size: 1.6rem;
		font-weight: 200;
		padding-top: 1rem;
	}

	#description p {
		margin: 1rem 0;
	}

	#description p img {
		vertical-align: middle;
	}

	#description .figure-caption {
		font-size: 0.8rem;
		margin-top: 0.5rem;
		text-align: center;
		margin-bottom: 2rem;
	}

	#description ol {
		margin-left: 3rem;
		list-style-type: decimal;
	}

	#description li {
		margin: 0.6rem 0;
	}

	#description p,
	#description div,
	#description li {
		color: theme('colors.gray.600');
		line-height: 1.6;
	}

	#description small {
		font-size: 0.8rem;
	}

	#description ol li img {
		vertical-align: middle;
	}

	#description .video-link {
		color: theme('colors.blue.600');
		cursor: pointer;
		font-weight: normal;
		text-decoration: none;
	}

	#description ul {
		list-style-type: disc;
		margin-left: 2.5rem;
		margin-bottom: 1rem;
	}

	#description a:hover,
	#description .video-link:hover {
		text-decoration: underline;
	}

	.figure,
	.video {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
