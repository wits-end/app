<div class="sort">
	<h3 class="minion">Sort</h3>
	<div class="options">
		<div class="group">
			<span class="active">Recent</span>
			<span>Featured</span>
			<span>Trending</span>
			<span>For You</span>
		</div>
		<div class="group">
			<span class="active">All Time</span>
			<span>Past 5 Years</span>
			<span>Past Year</span>
			<span>Past Month</span>
		</div>
	</div>
</div>

<style lang="scss">
	.sort {
		padding: 2rem 0;

		.options {
			display: flex;
			.group {
				flex: 0 0 50%;
				span {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: none;
					margin-bottom: 0.2rem;
					color: #aaa;
					display: block;

					&.active,
					&:hover {
						color: red;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>
