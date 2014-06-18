<?php // ==== POST FORMATS ==== //

// == LINKS == //

// Get quotation metadata; assumes WP Post Formats or equivalent is in use
if ( !function_exists( 'pendrell_link_metadata' ) ) : function pendrell_link_metadata( $content ) {

	if ( !has_post_format( 'link' ) )
		return $content;

	global $post;

	$link_url = get_post_meta( get_the_ID(), '_format_link_url', true );

	if ( !empty( $link_url ) ) {
		$content = '<footer class="entry-link"><a href="' . $link_url . '" rel="bookmark">' . $link_url . '</a></footer>' . $content;
	}
	return $content;

} endif;
add_filter( 'the_content', 'pendrell_link_metadata' );



// == QUOTATIONS == //

// Generate markup for quotations; assumes WP Post Formats or equivalent is in use
if ( !function_exists( 'pendrell_quotation_markup' ) ) : function pendrell_quotation_markup( $content ) {

	// Return early if a password is required or this is not a quote or quotation post format post
	if ( post_password_required() || ( !has_post_format( 'quote' ) && !has_post_format( 'quotation' ) ) )
		return $content;

	global $post;

	// Fetch metadata
	$name 	= get_post_meta( $post->ID, '_format_quote_source_name', true );
	$title 	= get_post_meta( $post->ID, '_format_quote_source_title', true );
	$date 	= get_post_meta( $post->ID, '_format_quote_source_date', true );
	$url 		= get_post_meta( $post->ID, '_format_quote_source_url', true );

	// Check to see if we have what we need to build the source
	if ( !empty( $name ) || !empty( $title ) || !empty( $url ) ) {

		$source = array();

		if ( !empty( $name ) ) {
			if ( empty( $title ) && !empty( $url ) ) {
				$source[] = '<a href="' . $url . '">' . $name . '</a>';
			} else {
				$source[] = $name;
			}
		}

		if ( !empty( $title ) ) {
			if ( !empty( $url ) ) {
				$source[] = '<cite><a href="' . $url . '">' . $title . '</a></cite>';
			} else {
				$source[] = '<cite>' . $title . '</cite>';
			}
		}

		// If we only have the URL at least make it look nice
		if ( !empty( $url ) && empty( $name ) && empty( $title ) )
			$source[] = '<a href="' . $url . '">' . parse_url( $url, PHP_URL_HOST ) . '</a>';

		if ( $date )
			$source[] = $date;

		// Concatenate with commas
		$source = implode( ', ', $source );
	} else {
		$source = '';
	}

	// Cite attribute for blockquote element
	if ( !empty( $url ) ) {
		$cite = ' cite="' . $url . '"';
	} else {
		$cite = '';
	}

	// Opening blockquote element
	$before = '<blockquote' . $cite . '>';

	// Source markup
	if ( !empty( $source ) ) {
		$after = '<footer>' . $source . '</footer></blockquote>';
	} else {
		$after = '</blockquote>';
	}

	return $before . $content . $after;

} endif;
add_filter( 'the_content', 'pendrell_quotation_markup' );
