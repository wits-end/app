<script></script>

<div class="hero">
	<div class="overlay"></div>

	<div class="wrapper">
		<div class="intro">
			<h1>An AI Platform To<br /> Empower Researchers</h1>
			<p>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid, pariatur. Minima dolorem
				explicabo ad nam perferendis pariatur facilis facere dolor, id officia, quam rerum sed,
				tempora doloremque libero quo corporis.
			</p>
			<p>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus dolorum dolores
				deleniti eos doloribus repellendus quidem ducimus minima quisquam repudiandae earum nobis,
				neque reiciendis rerum aut maxime. Dolores, neque nisi?
			</p>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias expedita ad eveniet placeat
				quod. Incidunt, harum! Ea odio nulla ex tempore quasi perferendis, fugiat sequi eligendi id
				earum labore vero.
			</p>
		</div>
	</div>
</div>

<style lang="scss">
	.hero {
		background: url('$lib/assets/anatomical-skull.jpg');
		background-position: right 7% center;
		background-repeat: no-repeat;
		background-size: auto 100%;
		height: 80vh;
		width: 100%;
		position: relative;

		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 0;
			background: white;
			opacity: 0.65;
		}

		.wrapper {
			position: relative;
			z-index: 1;
			top: 50%;
			transform: translateY(-50%);

			.intro {
				margin-left: 2%;

				h1 {
					font-family: 'Open Sans';
					font-size: 6.4rem;
					text-transform: uppercase;
					line-height: 1;
					margin-bottom: 1rem;
					color: black;

					@media screen and (max-width: 600px) {
						font-size: 3.8rem;
					}
				}

				p {
					color: black;
					font-size: 1.8rem;
					font-style: italic;
					max-width: 800px;
					margin-bottom: 2rem;
				}
			}
		}
	}
</style>
