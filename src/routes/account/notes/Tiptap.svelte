<script>
	import { onMount, onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { Editor } from '@tiptap/core';
	import Underline from '@tiptap/extension-underline';
	import Placeholder from '@tiptap/extension-placeholder';
	import Bold from '$lib/components/icons/bold.svelte';
	import BulletList from '$lib/components/icons/bulletList.svelte';
	import Code from '$lib/components/icons/code.svelte';
	import Italic from '$lib/components/icons/italic.svelte';
	import NumberList from '$lib/components/icons/numberList.svelte';
	import Redo from '$lib/components/icons/redo.svelte';
	import Strikethrough from '$lib/components/icons/strikethrough.svelte';
	import Under from '$lib/components/icons/underline.svelte';
	import Undo from '$lib/components/icons/undo.svelte';
	import Quote from '$lib/components/icons/quote.svelte';
	import Title from '$lib/components/icons/title.svelte';
	import StarterKit from '@tiptap/starter-kit';

	export let note;

	let element;
	let editor;

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
			<Undo />
		</button>
		<button
			on:click={() => editor.chain().focus().redo().run()}
			class:disabled={!editor.can().redo()}
		>
			<Redo />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			class:active={editor.isActive('title')}
		>
			<Title />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBold().run()}
			class:active={editor.isActive('bold')}
		>
			<Bold />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleUnderline().run()}
			class:active={editor.isActive('underline')}
		>
			<Under />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleItalic().run()}
			class:active={editor.isActive('italic')}
		>
			<Italic />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleStrike().run()}
			class:active={editor.isActive('strike')}
		>
			<Strikethrough />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBulletList().run()}
			class:active={editor.isActive('bullet-list')}
		>
			<BulletList />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleOrderedList().run()}
			class:active={editor.isActive('number-list')}
		>
			<NumberList />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBlockquote().run()}
			class:active={editor.isActive('blockquote')}
		>
			<Quote />
		</button>
		<button
			on:click={() => editor.chain().focus().toggleCodeBlock().run()}
			class:active={editor.isActive('code')}
		>
			<Code />
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
		formData.append('content', JSON.stringify(editor.getJSON()));

		if (note?.id) {
			formData.append('noteId', note.id);
		}
	}}
>
	<input type="text" name="articleId" value={note?.articles?.id} hidden />
	<button class="save-button">save</button>
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
</style>
