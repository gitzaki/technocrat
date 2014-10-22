<?php
/**
 * @package WordPress
 * @subpackage Pendrell
 * @since Pendrell 0.4
 */

get_header(); ?>

	<section id="primary" class="content-area">
		<?php pendrell_nav_content( 'nav-above' ); ?>
		<main id="main" class="site-main" role="main">
		<?php if ( have_posts() ) {
			while ( have_posts() ) : the_post();
				pendrell_template_part();
			endwhile;
		} else {
			get_template_part( 'content', 'none' );
		} ?>
		</main>
		<?php pendrell_nav_content( 'nav-below' ); ?>
	</section>

<?php pendrell_sidebar(); ?>
<?php get_footer(); ?>