<script>
	import { onMount, onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { Editor } from '@tiptap/core';
	import { page } from '$app/stores';
	import Underline from '@tiptap/extension-underline';
	import Placeholder from '@tiptap/extension-placeholder';
	import BoldIcon from '$lib/components/icons/bold.svelte';
	import BulletListIcon from '$lib/components/icons/bulletList.svelte';
	import CodeIcon from '$lib/components/icons/code.svelte';
	import ItalicIcon from '$lib/components/icons/italic.svelte';
	import NumberListIcon from '$lib/components/icons/numberList.svelte';
	import RedoIcon from '$lib/components/icons/redo.svelte';
	import StrikethroughIcon from '$lib/components/icons/strikethrough.svelte';
	import UnderlineIcon from '$lib/components/icons/underline.svelte';
	import UndoIcon from '$lib/components/icons/undo.svelte';
	import QuoteIcon from '$lib/components/icons/quote.svelte';
	import TitleIcon from '$lib/components/icons/title.svelte';
	import StarterKit from '@tiptap/starter-kit';
	import Loading from '$lib/components/icons/loading.svelte';

	export let note;

	let element;
	let editor;
	let pending;

	onMount(() => {
		editor = new Editor({
			element: element,
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
		>
			<TitleIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBold().run()}
			class:active={editor.isActive('bold')}
		>
			<BoldIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleUnderline().run()}
			class:active={editor.isActive('underline')}
		>
			<UnderlineIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleItalic().run()}
			class:active={editor.isActive('italic')}
		>
			<ItalicIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleStrike().run()}
			class:active={editor.isActive('strike')}
		>
			<StrikethroughIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBulletList().run()}
			class:active={editor.isActive('bullet-list')}
		>
			<BulletListIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleOrderedList().run()}
			class:active={editor.isActive('number-list')}
		>
			<NumberListIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBlockquote().run()}
			class:active={editor.isActive('blockquote')}
		>
			<QuoteIcon />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleCodeBlock().run()}
			class:active={editor.isActive('code')}
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

<div bind:this={element} />

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
	<input type="hidden" name="articleId" value={note?.articles?.id || ''} />
	<button class="save-button">save</button>
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
	}
	.loading {
		margin-top: 1rem;
	}
</style>
