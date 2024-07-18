<script>
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Bold from './icons/bold.svelte';
	import Code from './icons/code.svelte';
	import Italic from './icons/italic.svelte';
	import Redo from './icons/redo.svelte';
	import Strikethrough from './icons/strikethrough.svelte';
	import Underline from './icons/underline.svelte';
	import Undo from './icons/undo.svelte';
	import StarterKit from '@tiptap/starter-kit';

	let element;
	let editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			content: '<p>Hello World! 🌍️ </p>',
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
		<button>
			<Undo />
		</button>
		<button>
			<Redo />
		</button>
		<button>
			<Bold />
		</button>
		<button>
			<Underline />
		</button>
		<button>
			<Italic />
		</button>
		<button>
			<Strikethrough />
		</button>
		<button>
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

<style lang="scss">
	:global(.tiptap) {
		border: 1px solid #ddd;
		border-top: none;
		padding: 1rem;
	}
	.tools {
		padding: 1rem;
		border: 1px solid #ddd;
		display: flex;
		align-items: center;
		gap: 8px;

		button {
			height: 32px;
			width: 32px;
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
				color: #ddd;
			}
		}
	}
	button.active {
		background: black;
		color: white;
	}
</style>
