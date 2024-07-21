<script></script>

<div class="wrapper">
	<div class="menu">
		<nav class="categories">
			<a href="/account/dashboard" class="active" title="Dashboard">Dashboard</a>
			<a href="/account/lists">Reading Lists</a>
			<a href="/account/settings">Settings</a>
		</nav>
	</div>

	<slot></slot>
</div>

<style lang="scss">
	.menu {
		border-bottom: 1px solid #ddd;
		margin-bottom: 2rem;

		.categories {
			padding-bottom: 2rem;
			a {
				font-family: 'Open Sans';
				font-size: 1.2rem;
				font-weight: 500;
				text-transform: uppercase;
				text-decoration: none;
				margin-right: 2rem;
				color: #aaa;
				background: none;
				border: none;
				display: inline-block;

				&.active,
				&:hover {
					color: #d33682;
					cursor: pointer;
					font-weight: bold;
				}

				&:before {
					display: block;
					content: attr(title);
					font-weight: bold;
					height: 0;
					overflow: hidden;
					visibility: hidden;
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
