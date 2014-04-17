<?php // ==== ARCHIVES ==== //

// Generates all-purpose archive titles
function pendrell_archive_title() {
  if ( is_day() ) {
    $title = sprintf( __( 'Daily archives: %s', 'pendrell' ), pendrell_name_wrapper( get_the_date() ) );
  } elseif ( is_month() ) {
    $title = sprintf( __( 'Monthly archives: %s', 'pendrell' ), pendrell_name_wrapper( get_the_date( _x( 'F Y', 'monthly archives date format', 'pendrell' ) ) ) );
  } elseif ( is_year() ) {
    $title = sprintf( __( 'Yearly archives: %s', 'pendrell' ), pendrell_name_wrapper( get_the_date( _x( 'Y', 'yearly archives date format', 'pendrell' ) ) ) );
  } elseif ( is_author() ) {
    $title = sprintf( __( 'Posts by %s', 'pendrell' ), pendrell_name_wrapper( get_the_author() ) );
  } elseif ( is_category() ) {
    $title = sprintf( __( '%s', 'pendrell' ), pendrell_name_wrapper( single_cat_title( '', false ) ) );
  } elseif ( is_post_type_archive() ) {
    $title = sprintf( __( '%s', 'pendrell' ), pendrell_name_wrapper( post_type_archive_title( '', false ) ) );
  } elseif ( is_tag() ) {
    $title = sprintf( __( '%s', 'pendrell' ), pendrell_name_wrapper( single_tag_title( '', false ) ) );
  } elseif ( is_tax() ) {
    if ( is_tax( 'post_format' ) && get_post_format() === 'quote' ) {
      $title = sprintf( __( '%s archives', 'pendrell' ), pendrell_name_wrapper( __( 'Quotation', 'pendrell' ) ) );
    } else {
      $title = sprintf( __( '%s archives', 'pendrell' ), pendrell_name_wrapper( single_term_title( '', false ) ) );
    }
  } else {
    $title = __( 'Archives', 'pendrell' );
  }
  echo apply_filters( 'pendrell_archive_title', $title );
}



// Conditional archive descriptions
function pendrell_archive_description() {

  // Only show descriptions on the first page of results
  if ( !is_paged() ) {

    // Only output archive descriptions for categories, tags, taxonomies, and authors
    if ( is_category() || is_tag() || is_tax() ) {

      $content = '';

      $content = apply_filters( 'pendrell_archive_term_before', $content );

      // Check to see if we have a description for this category, tag, or taxonomy
      $description = term_description();

      // Got something?
      if ( !empty( $description ) ) {
        $content .= '<div class="archive-description">' . do_shortcode( $description ) . '</div>';
      }

      $content = apply_filters( 'pendrell_archive_term_after', $content );

      // Conditional output
      if ( !empty( $content ) ) {
        ?><div class="archive-content"><?php echo $content; ?></div><?php
      }

    } elseif ( is_author() ) {
      if ( get_the_author_meta( 'description' ) ) {
        ?><div class="archive-content">
          <?php pendrell_author_info(); ?>
        </div><?php
      }
    }
  }
}
