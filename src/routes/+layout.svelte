<style lang="scss">
    header {
      width: 100%;
      background: white;
      margin: 0;

      .wrapper {
        padding-bottom:0;

        .container {
            display: grid;
            grid-template-columns: auto auto;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #ddd;
            padding-bottom:1rem;

            .logo {
                color: black;
                font-size: 0;
                padding: 0.5rem 0;

                img {
                height: auto;
                max-width: 15rem;

                @media screen and (max-width:600px) {
                    max-width:12rem;
                }
                }
            }

            nav {
                font-size:0;
                a {
                color: black;
                text-decoration: none;
                font-weight: 500;
                font-family: "Open Sans";
                margin-left: 3.2rem;
                text-transform: uppercase;
                font-size: 1.2rem;

                @media screen and (max-width: 600px) {
                    margin-left:1.5rem;
                    font-size:0.9rem;
                }

                &.active, &:hover {
                    color: red;
                }
                }
            }
            }
        }
        }

    footer {
      background: #0f0f0f;
      padding: 3.2rem 0;

      .wrapper {
        display: grid;
        grid-template-columns: auto auto auto;
        grid-column-gap: 5rem;
        justify-content: space-around;

        .column {
          h2 {
            color: white;
            font-family: "Open Sans";
            text-transform: uppercase;
            margin-bottom: 1rem;
            font-size: 1.2rem;
          }
          a {
            display: block;
            width: max-content;
            margin-bottom: 1rem;
            color: #aaa;
            font-family: "Open Sans";
            font-size: 1.2rem;
          }
        }
      }
    }
</style>

<script>
    import Logo from '$lib/logo.svelte';
</script>

<header>
    <div class="wrapper">
      <div class="container">
        <!-- <a href="/" class="logo"><img src="/static/logo.svg" /></a> -->
        <Logo />
        <nav>
          <!-- <a href="/about">About</a> -->
          <a href="/architectures">Architectures</a>
          <a href="/gallery">Gallery</a>
          <a href="/notebooks">Notebooks</a>
          <a href="/publications">Publications</a>
          <a href="/shop">Shop</a>
        </nav>
      </div>
    </div>
  </header>


<slot></slot>