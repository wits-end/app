<main>
	<div class="wrapper">
		<form method="POST" action="?/login">
			<label>
				Email
				<input name="email" type="email" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			<button>Log In</button>
		</form>
	</div>
</main>

<style lang="scss">
	main {
		background: white;
		min-height: 50vh;

		.wrapper {
			margin: 0 auto;
			form {
				label {
					display: block;
				}
				input {
					display: block;
					padding: 0.5rem;
					margin-bottom: 0.5rem;
					width: 30rem;
				}
				button {
					padding: 0.5rem 1rem;
					margin-top: 0.5rem;
					margin-right: 0.5rem;
				}
			}
		}
	}
</style>
