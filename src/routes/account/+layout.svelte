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

<div class="wrapper">
	<div class="menu">
		<nav class="categories">
			<span class="active">Dashboard</span>
			<span>Settings</span>
		</nav>
	</div>

	<slot />
</div>

<style lang="scss">
	.menu {
		border-bottom: 1px solid #ddd;

		.categories {
			padding-bottom: 2rem;

			h2 {
				display: inline-block;
				font-size: 1.2rem;
				font-family: 'Open Sans';
				text-transform: uppercase;
				margin-right: 2rem;
			}
			span {
				font-family: 'Open Sans';
				font-size: 1.2rem;
				font-weight: 500;
				text-transform: uppercase;
				text-decoration: none;
				margin-right: 2rem;
				color: #aaa;

				&.active,
				&:hover {
					color: red;
					cursor: pointer;
				}
			}
			@media screen and (max-width: 600px) {
				display: none;
			}
		}

		@media screen and (max-width: 600px) {
			grid-column: auto;
		}
	}
</style>
