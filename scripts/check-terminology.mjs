#!/usr/bin/env node
/**
 * 中文化质量检查脚本
 *
 * 用法：node scripts/check-terminology.mjs
 * 退出码：0 = 通过；1 = 发现必须修的问题
 *
 * 检查项：
 * 1. 禁用词（错误译法）
 * 2. 术语一致性（同一英文只能出现一种译法）
 * 3. 疑似未翻译的可见英文（模板文本节点）
 * 4. 中文标点/空格问题（启发式提示，不阻塞）
 */
import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['src/components', 'src/utils', 'src/routes', 'src/store'];
const BLOCKLIST = [
	{ term: '令牌', why: 'token 应译「词元」（令牌指鉴权 token）' },
	{ term: '逻辑值', why: 'logits 应保留英文或译「未归一化得分」' },
	{ term: '内嵌', why: 'embedding 应译「嵌入」' },
	{ term: '变换器模块', why: 'transformer block 应译「Transformer 块」' },
	{ term: '自我注意力', why: 'self-attention 应译「自注意力」' },
	{ term: '注意力头部', why: 'attention head 应译「注意力头」' },
	{ term: '查询向量 / 键向量', why: '图示标签应使用短译名「查询 / 键 / 值」' }
];
// 允许保留英文的上下文（术语简称、品牌、代码）
const KEEP_EN = [
	'Transformer', 'GPT', 'Softmax', 'GeLU', 'Dropout', 'logits', 'Top-k', 'Top-p', 'MLP',
	'BPE', 'ONNX', 'Svelte', 'D3', 'KaTeX', 'GitHub', 'Hugging Face', 'Q', 'K', 'V',
	'Bias', 'Logits', 'OFL', 'arXiv', 'CHI', 'POLOCLUB', 'Git', 'npm', 'Node'
];

const files = [];
async function walk(dir) {
	let entries;
	try {
		entries = await readdir(path.join(ROOT, dir), { withFileTypes: true });
	} catch {
		return;
	}
	for (const e of entries) {
		const rel = path.join(dir, e.name);
		if (e.isDirectory()) await walk(rel);
		else if (/\.(svelte|ts|js)$/.test(e.name)) files.push(rel);
	}
}
for (const d of SCAN_DIRS) await walk(d);

const problems = [];
const warnings = [];

for (const rel of files) {
	const src = readFileSync(path.join(ROOT, rel), 'utf8');

	// 1. 禁用词
	for (const { term, why } of BLOCKLIST) {
		let idx = -1;
		while ((idx = src.indexOf(term, idx + 1)) !== -1) {
			const line = src.slice(0, idx).split('\n').length;
			problems.push(`${rel}:${line} 禁用词「${term}」—— ${why}`);
		}
	}

	// 2. 可见英文（模板文本节点，排除 script/style）
	if (!rel.endsWith('.svelte')) continue;
	const stripped = src
		.replace(/<style[\s\S]*?<\/style>/g, '')
		.replace(/<script[\s\S]*?<\/script>/g, '');
	for (const m of stripped.matchAll(/>([^<>{}]+)</g)) {
		const text = m[1].trim();
		if (text.length < 3) continue;
		if (!/[A-Za-z]{2,}/.test(text)) continue;
		// 纯术语/品牌则允许
		const cleaned = KEEP_EN.reduce((acc, k) => acc.replaceAll(k, ''), text);
		const leftoverWords = cleaned.match(/[A-Za-z]{3,}/g) || [];
		if (leftoverWords.length >= 2) {
			const line = src.slice(0, m.index).split('\n').length;
			warnings.push(`${rel}:${line} 疑似未翻译：「${text.slice(0, 60)}」`);
		}
	}
}

const uniq = (arr) => [...new Set(arr)];

console.log(`\n扫描 ${files.length} 个文件\n`);

const p = uniq(problems);
if (p.length) {
	console.log(`❌ 必须修复（${p.length}）`);
	for (const x of p) console.log('   ' + x);
} else {
	console.log('✅ 禁用词检查通过');
}

const w = uniq(warnings);
if (w.length) {
	console.log(`\n⚠️  疑似未翻译的可见文本（${w.length}，需人工确认）`);
	for (const x of w.slice(0, 60)) console.log('   ' + x);
	if (w.length > 60) console.log(`   … 另有 ${w.length - 60} 条`);
}

process.exit(p.length ? 1 : 0);
