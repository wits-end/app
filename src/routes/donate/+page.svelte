<script>
	const priceIds = ['price_1PdICXCfyJF5ohGUmfEZhNe9', 'price_1PdICJCfyJF5ohGUtbrJHC5R'];
</script>

<svelte:head>
	<title>Donate | Dead Neuron</title>
	<meta name="description" content="An AI platform to empower researchers." />
</svelte:head>

<div class="hero">
	<div class="overlay"></div>
	<div class="wrapper">
		<div class="intro">
			<h2>Supporter Memberships</h2>
			<h1>Your Support Helps<br />Empower Researchers</h1>
			<p>
				We rely on people like you to keep Dead Neuron up and running. We believe everyone should
				have access to a free world-class research platform and we're trying to deliver the best
				experience we can for our users. We are a small team, so your support makes a huge
				difference!
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
			<a href="/api/checkout?id={priceIds[0]}">$50/Year</a>
		</div>
		<div class="image">
			<img src="#" alt="" />
		</div>
	</div>
</div>
<div class="faqs">
	<div>
		<h1>Frequently Asked Questions</h1>
		<p>
			Thank you for your interest in supporting Dead Neuron! This website is my passion project and
			I am doing my best to create a dream platform for new and experienced machine learning
			enthusiasts alike. If you run into any issues or have additional questions, please reach out
			to me at tim@deadneuron.com and I will get back to you as soon as possible.
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
				<h2>Is my payment information private and secure?</h2>
				<p>
					We exclusively use Stripe, a trusted industry standard, to manage subscriptions and do not
					store any payment information on our private servers.
				</p>
			</div>
			<div>
				<h2>Does my membership renew automatically?</h2>
				<p>Yes, recurring memberships renew automatically each month or year based on your plan.</p>
			</div>
			<div>
				<h2>Do I get anything for becoming a supporter?</h2>
				<p>
					Not yet. We have some plans to offer merch in the future so stay tuned for that. We will
					offer something special for early supporters to show our appreciation.
				</p>
			</div>
			<div>
				<h2>Why are my premium features not working?</h2>
				<p>
					Premium is activated on a successful invoicing event from Stripe. If there are any issues,
					please contact me at tim@witsend.ai and I will make things right as soon as possible.
				</p>
			</div>
			<div>
				<h2>Will my membership ever increase in cost?</h2>
				<p>Your membership price will be locked in as long as your subscription is sustained.</p>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.hero {
		width: 100%;
		background: url('$lib/assets/carina.jpg');
		background-size: cover;
		background-color: #0f0f0f;
		background-position: center;
		background-repeat: no-repeat;
		position: relative;
		height: 75vh;
		margin: -1rem;
		padding: 1rem;
		box-sizing: content-box;

		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 0;
			background: black;
			opacity: 0.6;
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
					box-shadow: 2px 2px 0px rgba(0, 0, 0, 1);

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
			.image {
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
