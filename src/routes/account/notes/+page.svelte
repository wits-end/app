<script lang="ts">
	import NotesList from './NotesList.svelte';
	import Tiptap from '$lib/components/tiptap.svelte';

	export let data;

	let { notes, profile, session } = data;

	let selectedNote = notes[0];
</script>

<div class="grid">
	<div class="col editor-view">
		<h1 class="title">{selectedNote.articles.title}</h1>
		<p class="abstract"><strong>Abstract: </strong> {selectedNote.articles.abstract}</p>

		{#key selectedNote.id}
			<Tiptap note={selectedNote} />
		{/key}
	</div>
	<div class="col articles">
		<h3 class="minion">Articles With Saved Notes</h3>
		<NotesList
			data={{ notes, profile, session }}
			on:setSelectedNote={(e) => {
				selectedNote = e.detail.note;
			}}
		/>
	</div>
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: 3fr 1fr;
		grid-gap: 2rem;

		.col {
			padding: 1rem;
			padding-left: 0;
			border-right: 1px solid #ddd;

			&:last-child {
				border: none;
			}
		}

		.editor-view {
			padding-top: 0;

			.title {
				margin-bottom: 1rem;
			}
			.abstract {
				margin-bottom: 2rem;
			}
		}
	}
</style>
