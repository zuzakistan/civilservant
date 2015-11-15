/**
 * docgen.js
 *
 * Generates COMMANDS.md.
 */
var dir = require( 'node-dir' );
var extract = require( 'extract-comments' );
var fs = require( 'fs' );


var docs = '';
dir.readFiles( 'modules', {
		match: /.js$/
	}, function ( err, content, next ) {
		if ( err ) {
			throw err;
		}

		var comment = extract.block( content, { first: true } )[0];
		if ( comment ) {
			// only get proper /** docstrings, not /*
			if ( comment.raw.substring( 0, 3 ) === '/**' ) {
					var isPreamble = true;
					comment.lines.forEach( function ( line ) {
						// replace <foo> with _foo_
						line = line.replace( /</g, '_' );
						line = line.replace( />/g, '_' );
						if ( line.match( /^!/ ) ) {
							isPreamble = false;
							docs += '## ' + line + '\n'; } else if ( !isPreamble )  {
							if ( line.match( /^var/ ) ) {
								// hack due to upstream(?) bug
								isPreamble = true;
							} else {
								docs += '   ' + line + '\n';
							}
						}
					} );
				}
			}
		next();
	},
	function () {
		fs.writeFile( 'COMMANDS.md', docs );
	}
);
