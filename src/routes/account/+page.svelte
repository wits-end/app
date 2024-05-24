<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ notes, supabase, user } = data);
</script>

<h1>{user?.email}</h1>
<p>
	Welcome to Dead Neuron and thank you for registering. This is the account homepage. Here you
	should be able to navigate to all of the pages specific to you.
</p>

<style lang="scss">
</style>
