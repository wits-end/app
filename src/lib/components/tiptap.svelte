<script>
	import { onMount, onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { Editor } from '@tiptap/core';
	import { page } from '$app/stores';
	import Underline from '@tiptap/extension-underline';
	import Placeholder from '@tiptap/extension-placeholder';
	import BoldIcon from './icons/bold.svelte';
	import BulletListIcon from './icons/bulletList.svelte';
	import CodeIcon from './icons/code.svelte';
	import ItalicIcon from './icons/italic.svelte';
	import NumberListIcon from './icons/numberList.svelte';
	import RedoIcon from './icons/redo.svelte';
	import StrikethroughIcon from './icons/strikethrough.svelte';
	import UnderlineIcon from './icons/underline.svelte';
	import UndoIcon from './icons/undo.svelte';
	import QuoteIcon from './icons/quote.svelte';
	import TitleIcon from './icons/title.svelte';
	import StarterKit from '@tiptap/starter-kit';
	import Loading from '$lib/components/icons/loading.svelte';

	export let note;
	export let articleId;
	export let isEnabled;

	let element;
	let editor;
	let pending;

	onMount(() => {
		editor = new Editor({
			element: element,
			editable: isEnabled,
			extensions: [
				StarterKit,
				Underline,
				Placeholder.configure({
					placeholder: 'Write your personal notes here...'
				})
			],
			content: note?.content ? JSON.parse(note.content) : '',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

{#if editor}
	<div class="tools">
		<button
			on:click={() => editor.chain().focus().undo().run()}
			class:disabled={!editor.can().undo()}
		>
			<UndoIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().redo().run()}
			class:disabled={!editor.can().redo()}
		>
			<RedoIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			class:active={editor.isActive('title')}
			class:disabled={!isEnabled}
		>
			<TitleIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBold().run()}
			class:active={editor.isActive('bold')}
			class:disabled={!isEnabled}
		>
			<BoldIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleUnderline().run()}
			class:active={editor.isActive('underline')}
			class:disabled={!isEnabled}
		>
			<UnderlineIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleItalic().run()}
			class:active={editor.isActive('italic')}
			class:disabled={!isEnabled}
		>
			<ItalicIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleStrike().run()}
			class:active={editor.isActive('strike')}
			class:disabled={!isEnabled}
		>
			<StrikethroughIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBulletList().run()}
			class:active={editor.isActive('bullet-list')}
			class:disabled={!isEnabled}
		>
			<BulletListIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleOrderedList().run()}
			class:active={editor.isActive('number-list')}
			class:disabled={!isEnabled}
		>
			<NumberListIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBlockquote().run()}
			class:active={editor.isActive('blockquote')}
			class:disabled={!isEnabled}
		>
			<QuoteIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleCodeBlock().run()}
			class:active={editor.isActive('code')}
			class:disabled={!isEnabled}
		>
			<CodeIcon />
		</button>
	</div>
	<!-- <button
		on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button> -->
{/if}

<div bind:this={element} class:disabled={!isEnabled} />

<form
	action="?/saveNotes"
	method="POST"
	use:enhance={({ formData }) => {
		formData.append('content', editor.isEmpty ? '' : JSON.stringify(editor.getJSON()));

		pending = true;

		return async ({ result, update }) => {
			await update();
			pending = false;
		};
	}}
>
	<input type="hidden" name="noteId" value={note?.id || ''} />
	<input type="hidden" name="articleId" value={articleId} />
	<button class="save-button" disabled={!isEnabled} class:disabled={!isEnabled}>save</button>
	{#if pending}
		<div class="loading"><Loading /></div>
	{:else if $page.form?.success}
		<p>Note saved</p>
	{/if}
</form>

<style lang="scss">
	:global(.tiptap) {
		border: 1px solid #ddd;
		border-top: none;
		padding: 1rem;
		min-height: 180px;

		:global(p.is-editor-empty:first-child::before) {
			color: #adb5bd;
			content: attr(data-placeholder);
			float: left;
			height: 0;
			pointer-events: none;
		}

		:global(pre) {
			background: #ddd;
			padding: 0.5rem;

			:global(code) {
				line-height: 1.5;
			}
		}

		:global(blockquote) {
			border-left: 5px solid #ddd;
			padding-left: 1rem;
		}
	}
	:global(.ProseMirror-focused) {
		outline: none;
	}

	:global(.disabled) {
		background: #eee;
	}
	.tools {
		padding: 1rem;
		border: 1px solid #ddd;
		display: flex;
		align-items: center;
		gap: 8px;

		button {
			height: 36px;
			width: 36px;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 8px;
			background: transparent;
			border: none;

			&.active,
			&:hover {
				background: #ddd;
			}

			&.disabled {
				&:hover {
					background: none;
					cursor: default;
				}
				:global(svg) {
					fill: #ddd;
				}
			}
		}
	}
	.save-button {
		margin-top: 1rem;
		background: white;
		border: 1px solid #ddd;
		font-size: 1.4rem;
		color: #999;
		padding: 0.5rem 1rem;
		transition: all 0.2s ease;

		&:hover {
			border: 1px solid #666;
			color: #000;
		}

		&.disabled {
			&:hover {
				background: none;
				cursor: default;
				color: #999;
				border: 1px solid #ddd;
			}
		}
	}
	.loading {
		margin-top: 1rem;
	}
</style>
