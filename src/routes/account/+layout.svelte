<script>
	export let data;
	$: ({ supabase } = data);

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};
</script>

<main>
	<slot />
</main>

<style lang="scss">
	main {
		background: white;
	}
</style>
