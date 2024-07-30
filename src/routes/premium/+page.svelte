<script>
	const priceIds = ['price_1PdICXCfyJF5ohGUmfEZhNe9', 'price_1PdICJCfyJF5ohGUtbrJHC5R'];
</script>

<svelte:head>
	<title>Premium | Wits End</title>
	<meta name="description" content="An AI platform to empower researchers." />
</svelte:head>

<div class="hero">
	<div class="overlay"></div>
	<div class="wrapper">
		<div class="intro">
			<h2>Premium Membership</h2>
			<h1>Exclusive Tools To <br />Empower Researchers</h1>
			<p>
				We rely on support from people like you to keep Wits End up and running. Show your support
				and get access to an improved experience with additional features.
			</p>
			<div class="bullets">
				<ul>
					<li>No ads</li>
					<li>Custom reading lists</li>
					<li>Personalized recommendations</li>
				</ul>
				<ul>
					<li>Editable notebooks</li>
					<li>Theme settings (coming soon...)</li>
					<li>Early access to new features</li>
				</ul>
			</div>
			<a href="/api/checkout?id={priceIds[1]}">$5/month</a>
			<a href="/api/checkout?id={priceIds[0]}">$50/Year (Save 30%)</a>
		</div>
		<div class="video"></div>
	</div>
</div>
<div class="faqs">
	<div>
		<h1>Frequently Asked Questions</h1>
		<p>
			Thank you for your interest in supporting Wits End! This website is a one-man passion project
			and I am doing my best to create a useful platform that researchers will love to explore. If
			you run into any issues or have additional questions, please reach out to me at tim@witsend.ai
			and I will get back to you as soon as possible!
		</p>
		<div class="questions">
			<div>
				<h2>Can I change/cancel my monthly support?</h2>
				<p>
					Yes, you can cancel or change your membership at any time from your account's billing
					page.
				</p>
			</div>
			<div>
				<h2>Can I try premium for free?</h2>
				<p>
					All premium memberships include a free three day trial for new customers. You need a
					credit card to activate but you can cancel at any time within that time frame at no cost.
				</p>
			</div>
			<div>
				<h2>Does my membership renew automatically?</h2>
				<p>Yes, memberships renew automatically each month or year based on your plan.</p>
			</div>
			<div>
				<h2>Is my payment information private and secure?</h2>
				<p>
					We exclusively use Stripe to manage subscriptions and do not store any payment information
					on our private servers. Stripe is an industry standard that we trust.
				</p>
			</div>
			<div>
				<h2>Will my membership ever increase in cost?</h2>
				<p>Your membership price will be locked in as long as your subscription is sustained.</p>
			</div>
			<div>
				<h2>Will premium members get access to new features for free?</h2>
				<p>
					Yes! I have big plans for Wits End and premium members will have access to any and all
					future premium features.
				</p>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	// Break out of parent wrapper for full width backgrounds
	:global(main) {
		padding: 0 !important;
	}

	.hero {
		width: 100%;
		background: url('$lib/assets/carina.jpg');
		background-size: cover;
		background-color: #0f0f0f;
		background-position: center;
		background-repeat: no-repeat;
		position: relative;
		height: 75vh;

		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 0;
			background: black;
			opacity: 0.65;
		}
		.wrapper {
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: center;
			justify-content: center;
			gap: 5rem;
			max-width: 90vw;
			margin: 0 auto;

			position: relative;
			z-index: 1;
			top: 50%;
			transform: translateY(-50%);

			.intro {
				h2 {
					font-family: 'Open Sans';
					font-size: 1.6rem;
					text-transform: uppercase;
					color: #c2c2c2;
					text-shadow: 2px 2px 0px rgba(0, 0, 0, 1);

					@media screen and (max-width: 600px) {
						font-size: 1.4rem;
					}
				}

				h1 {
					font-family: 'Open Sans';
					font-size: 6rem;
					text-transform: uppercase;
					line-height: 1;
					margin-bottom: 1rem;
					color: white;
					text-shadow: 5px 5px 0px rgba(0, 0, 0, 1);
				}

				p {
					color: white;
					font-size: 1.6rem;
					max-width: 800px;
					margin-bottom: 1rem;
					text-shadow: 2px 2px 0px rgba(0, 0, 0, 1);
				}

				a {
					background: #d33682;
					color: white;
					border: none;
					padding: 1rem 2rem;
					margin-right: 1rem;
					font-family: 'Open Sans';
					font-size: 1.4rem;
					font-weight: bold;
					text-transform: uppercase;
					text-decoration: none;
					transition: all 0.2s ease;

					&:hover {
						background-color: #e99ac0;
					}
				}

				.bullets {
					display: flex;
					ul {
						margin-right: 2rem;
						margin-bottom: 3rem;
						li {
							color: white;
							font-size: 1.6rem;
							text-shadow: 2px 2px 0px rgba(0, 0, 0, 1);
						}
					}
				}
			}
			.video {
				height: 40rem;
				background: black;
			}
		}
	}

	.faqs {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		align-items: center;
		background: url('$lib/assets/brain.svg');
		background-position: center left;
		background-size: 45vw;
		background-repeat: no-repeat;
		padding: 14rem;
		padding-right: 8rem;

		div {
			grid-column: 2;

			h1 {
				line-height: 1.2;
				margin-bottom: 1.6rem;
				color: black;

				@media screen and (max-width: 600px) {
					font-size: 3.8rem;
				}
			}

			p {
				color: black;
				font-size: 1.6rem;
				max-width: 800px;
				margin-bottom: 3rem;
			}

			.questions {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				div {
					flex: 0 0 30%;
					h2 {
						font-size: 1.6rem;
						color: #666;
					}
				}
			}

			a {
				background: black;
				color: white;
				border: none;
				padding: 1rem 2rem;
				margin-right: 1rem;
				font-family: 'Open Sans';
				font-size: 1.4rem;
				font-weight: bold;
				text-transform: uppercase;
				text-decoration: none;
				transition: all 0.2s ease;

				&:hover {
					background-color: #666;
				}
			}
		}
	}
</style>
