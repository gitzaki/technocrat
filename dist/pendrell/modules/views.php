<?php // ==== VIEWS ==== //

// The views module allows for template parts to be controlled by URL rewrites
// For example, to view a category in gallery mode, navigate to <website.com/category/kittens/gallery>
// By default there are three defined views: gallery, list, and posts (which is just the default view)



// == SETUP == //

// Setup views; add rewrite tags and rules
if ( !function_exists( 'pendrell_view_setup' ) ) : function pendrell_view_setup() {

  global $pendrell_view_names, $pendrell_view_taxonomies;

  // Cycle through each view to add rewrite tags and rules
  if ( !empty( $pendrell_view_names ) ) {

    // Add a default "posts" view to the custom definitions
    $pendrell_view_names[] = _x( 'posts', 'Name of the standard posts view (all lowercase)', 'pendrell' );

    foreach ( $pendrell_view_names as $view ) {
      add_rewrite_tag( '%' . $view . '%', '' ); // Regex is currently blank; if we want to capture: '([^/]+)'

      // Root rewrite rules
      add_rewrite_rule( $view . '/page/?([0-9]{1,})/?$', 'index.php?&' . $view . '=&paged=$matches[1]', 'top' );
      add_rewrite_rule( $view . '/?$', 'index.php?&' . $view . '=', 'top' );

      // Cycle through each taxonomy to apply additional rules
      if ( !empty( $pendrell_view_taxonomies ) ) {
        foreach ( $pendrell_view_taxonomies as $taxonomy ) {

          // Clear existing variables from the last run through the loop
          unset($tax);
          unset($tax_slug);
          unset($tax_var);

          // Fetch the taxonomy object
          $tax = get_taxonomy( $taxonomy );

          // Only proceed if we have a match
          if ( !empty( $tax ) ) {
            $tax_slug = $tax->rewrite['slug'];
            $tax_var = $tax->query_var;

            // Add rewrite rules for taxonomy archives
            if ( !empty( $tax_slug ) && !empty( $tax_var ) ) {
              add_rewrite_rule( $tax_slug . '/(.+?)/' . $view . '/page/?([0-9]{1,})/?$', 'index.php?&' . $tax_var . '=$matches[1]&' . $view . '=&paged=$matches[2]', 'top' );
              add_rewrite_rule( $tax_slug . '/(.+?)/' . $view . '/?$', 'index.php?&' . $tax_var . '=$matches[1]&' . $view . '=', 'top' );
            }
          }
        }
      }
    }
  }
} endif;
add_action( 'init', 'pendrell_view_setup' );



// == PLUMBING == //

// A simple function to get the current view
if ( !function_exists( 'pendrell_get_view' ) ) : function pendrell_get_view() {

  global $wp_query, $pendrell_view_names;

  // Cycle through the views array and test whether the requisite query variable exists
  if ( !empty( $pendrell_view_names ) ) {

    // Add a default "posts" view to the custom definitions
    $pendrell_view_names[] = _x( 'posts', 'Name of the standard posts view (all lowercase)', 'pendrell' );

    foreach ( $pendrell_view_names as $view ) {
      if ( isset( $wp_query->query_vars[ $view ] ) )
         $the_view = $view;
    }
  }

  // Return the view slug if found; false if not
  if ( !empty( $the_view ) )
    return $the_view;
  return false;
} endif;



// Views conditional test; is this a view and, if so, does it match the specified type?
if ( !function_exists( 'pendrell_is_view' ) ) : function pendrell_is_view( $type = '' ) {

  global $wp_query;

  // Only proceed where relevant
  if ( is_main_query() && ( is_archive() || is_home() ) ) {

    $view = pendrell_get_view();

    // Now test the view
    if ( !empty( $view ) ) {
      if ( !empty( $type ) ) {
        if ( $view === $type ) {
          return true; // The current view is the specified type
        } else {
          return false; // The current view is not the specified type
        }
      }
      return true; // This is a view
    }
  }
  return false; // This is not a view
} endif;



// == TEMPLATES & CLASSES == //

// Template selector based on current view
if ( !function_exists( 'pendrell_view_template_part' ) ) : function pendrell_view_template_part( $name ) {

  // Get the current view
  $view = pendrell_get_view();

  // Assign a template name unless the view is empty or not the default 'posts' view
  if ( !empty( $view ) ) {
    if ( $view !== 'posts' )
      $name = $view;
  }

  return $name;
} endif;
add_filter( 'pendrell_template_part', 'pendrell_view_template_part' );



// Add to content class array
if ( !function_exists( 'pendrell_view_body_class' ) ) : function pendrell_view_body_class( $classes ) {

  // Get the current view
  $view = pendrell_get_view();

  // Assign classes unless the view is empty or not the default 'posts' view
  if ( !empty( $view ) ) {
    if ( $view !== 'posts' )
      $classes[] = $view . '-view';
  }

  return $classes;
} endif;
add_filter( 'body_class', 'pendrell_view_body_class' );



// View content class filter; adds classes to the main content element rather than body class (for compatibility with the full-width module)
if ( !function_exists( 'pendrell_view_content_class' ) ) : function pendrell_view_content_class( $classes ) {
  if ( pendrell_is_view( 'gallery' ) )
    $classes[] = 'img-group';
  return $classes;
} endif;
add_filter( 'pendrell_content_class', 'pendrell_view_content_class' );



// == FULL-WIDTH == //

// Force certain views to be full-width
if ( !function_exists( 'pendrell_view_full_width' ) ) : function pendrell_view_full_width( $full_width_test ) {

  // Return immediately if the test has already been passed
  if ( $full_width_test === true )
    return $full_width_test;

  // Test the view
  if ( pendrell_is_view( 'gallery' ) )
    return true;

  // Otherwise return false
  return false;
} endif;
add_filter( 'pendrell_full_width', 'pendrell_view_full_width' );



// == VIEW-SPECIFIC CUSTOMIZATIONS == //

// Modify how many posts per page are displayed for different views; adapted from: http://wordpress.stackexchange.com/questions/21/show-a-different-number-of-posts-per-page-depending-on-context-e-g-homepage
if ( !function_exists( 'pendrell_view_pre_get_posts' ) ) : function pendrell_view_pre_get_posts( $query ) {
  if ( pendrell_is_view( 'gallery' ) ) {
    $query->set( 'ignore_sticky_posts', true );
    $query->set( 'posts_per_page', 18 ); // Best if this is a number divisible by both 2 and 3
  }
} endif;
add_action( 'pre_get_posts', 'pendrell_view_pre_get_posts' );



// == VIEW MAPPING == //

// Assign default views to different taxonomy archives in `functions-config.php`
if ( !function_exists( 'pendrell_view_mapping' ) ) : function pendrell_view_mapping() {

  global $pendrell_view_map;

  // Dual loops to cycle through the default assignments
  if ( !empty( $pendrell_view_map ) && is_array( $pendrell_view_map ) ) {
    foreach ( $pendrell_view_map as $taxonomy => $term_set ) {
      if ( !empty( $term_set ) ) {
        foreach ( $term_set as $term => $view ) {

          // This part is due to yet another WordPress idiosyncrasy: is_tax() doesn't work on categories or tags
          if ( $taxonomy === 'category' ) {
            if ( is_category( $term ) )
              set_query_var( $view, '' );
          } elseif ( $taxonomy === 'tag' ) {
            if ( is_tag( $term ) )
              set_query_var( $view, '' );
          } elseif ( is_tax( $taxonomy, $term ) ) {
            set_query_var( $view, '' );
          }
        }
      }
    }
  }
} endif;
add_action( 'parse_query', 'pendrell_view_mapping' );
