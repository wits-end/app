<div class="sort">
	<h3 class="minion">Sort</h3>
	<div class="options">
		<div class="group">
			<span class="active">Top</span>
			<span>Recent</span>
			<span>Impactful</span>
			<span>Featured</span>
		</div>
		<div class="group">
			<span class="active">All Time</span>
			<span>Past Year</span>
			<span>Past Month</span>
			<span>Past Week</span>
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
