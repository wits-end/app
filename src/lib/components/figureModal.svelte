<script>
	export let showModal; // boolean

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot />
		<button autofocus on:click={() => dialog.close()}>close</button>
	</div>
</dialog>

<style lang="scss">
	dialog {
		max-width: 85vw;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		position: fixed;
		margin: auto;
		/* transform: translate(-50%, -50%); */
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	:global(figure) {
		display: table;
	}
	:global(figcaption) {
		display: table-caption;
		caption-side: bottom;
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
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
