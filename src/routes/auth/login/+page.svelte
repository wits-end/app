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
					border: 1px solid #aaa;
					width: 30rem;
				}
				button {
					background: white;
					border: 1px solid #aaa;
					padding: 1rem 2rem;
					transition: all 0.2s ease;
					margin-top: 1rem;

					&:hover {
						border: 1px solid #666;
					}
				}
			}
		}
	}
</style>
