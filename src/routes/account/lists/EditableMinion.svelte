<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { enhance } from '$app/forms';

	export let listId;
	export let value,
		required = true;

	let form;

	const dispatch = createEventDispatcher();
	let editing = false,
		original;

	onMount(() => {
		original = value;
	});

	function edit() {
		editing = true;
	}

	function focus(element) {
		element.focus();
	}
</script>

{#if editing}
	<form
		action="?/updateListName"
		method="POST"
		bind:this={form}
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			editing = false;

			if (value != original) {
				dispatch('submit', value);
			} else {
				cancel();
			}
		}}
	>
		<input type="hidden" name="listId" value={listId} />
		<input
			name="name"
			on:blur={() => {
				form.requestSubmit();
			}}
			bind:value
			{required}
			use:focus
		/>
	</form>
{:else}
	<div on:click={edit}>
		{value}
	</div>
{/if}

<style>
	input {
		border: none;
		background: none;
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		color: inherit;
		font-weight: inherit;
		text-align: inherit;
		text-transform: inherit;
		box-shadow: none;
	}
</style>
