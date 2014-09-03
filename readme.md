# PENDRELL

Pendrell is a minimal yet fully-featured WordPress theme for single author personal blogs. It is designed to be proficient at displaying beautiful, legible type alongside big, bold imagery. Use it for long-form journalism, photo-blogging, and more--but be prepared to dive into the code! Pendrell is something of a hacker theme; there is no options page, theme customizer, or any other bloat, which means you won't find it in the WordPress theme repository. Instead, what you get is a powerful WordPress theme built with the goodness of Sass, Bower, and Gulp. To get the most out of Pendrell you'll also want to install [Ubik](https://github.com/synapticism/ubik), my handy library of WordPress hacks bundled as a plugin.

![Pendrell example screenshot](/pendrell/screenshot.png "Pendrell example screenshot")

You can see Pendrell in action on my blog, [Synapticism](http://synapticism.com).



## FEATURES

* HTML5-compliant markup; clean and efficient CSS3 styling.
* Big, beautiful typesetting for [easy reading](http://ia.net/blog/100e2r/).
* Consistent vertical rhythm (excluding images; that's just too much trouble).
* Full-width view for image and gallery post format posts increases font size and removes sidebar. Great for photo-blogging.
* Improved post format styling and support for asides, images (really just a thin wrapper for attachments), links, quotations, and status updates.
* Google web font support; configure in `functions.php`.
* Built-in contact form page template; no need for a wasteful plugin.
* Automated CSS/JS minification via Gulp build system. This theme is highly optimized.
* Code highlighting via [Prism](http://prismjs.com).
* Optional AJAX page loading.
* Smart context-dependent search form.
* Much, much more...



## INSTALLATION

Drop the 'dist/pendrell' directory into /wp-content/themes/ and activate it via the WordPress admin interface.

### REQUIREMENTS

WordPress 3.9+ and PHP 5.3+.

### CONFIGURATION

This theme has no options page; modify the `functions-config-sample.php` file, renaming it to `functions-config.php`, if you wish to change any of the default settings. Pendrell's settings are meant to be self-explanatory; read the comments for more direction.

### DEVELOPMENT

I develop Pendrell on a local OS X development environment provisioned with Sass, Bower, and Gulp. To get started you'll need to have Sass installed: `gem install sass`. After that, `npm install` should get you up and running. Bower is called using npm's `scripts.postinstall` feature.

To build and watch Pendrell during development: `gulp`.

To create a new Pendrell package for production under `pendrell/dist`: `gulp package`.

Pendrell is written in Sass without Compass. [Normalize.css](https://necolas.github.io/normalize.css/) and [Eric Meyer's reset](http://meyerweb.com/eric/tools/css/reset/) are integrated by default. Pendrell also relies on [Kipple](https://github.com/synapticism/kipple), my zygotic library of Sass hacks.

*Fork this repo to receive updates as development continues.*

### PLUGINS

Pendrell is designed for use with [Ubik](https://github.com/synapticism/ubik), my all-purpose WordPress plugin toolkit. It includes all the theme-agnostic snippets, hacks, and other functionality that would usually be included in a theme (but shouldn't be). You will want to install and configure Ubik to get the most out of Pendrell.

Apart from that I have prepared a list of recommended plugins in [usage.md](/usage.md).



## LICENSE

Copyright 2012-2014 [Alexander Synaptic](http://alexandersynaptic.com). Licensed under the GPLv3: http://www.gnu.org/licenses/gpl.txt

Please link back to [my web site](http://synapticism.com) and/or [this GitHub repository](https://github.com/synapticism/pendrell) if you make use of this theme!
