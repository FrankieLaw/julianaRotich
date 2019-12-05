window.onload = function( ) {
	AppInit( ).navigationList( "nav-sections", "btn-" );
	AppInit( ).navigationList( "toggle-sections", "tg-" );
	AppInit( ).navigationList( "next-section", "next-" );
	AppInit( ).navigationList( "nav-home", "btn-" );
	AppInit( ).navigationToggle( );
	AppInit( ).workSection( );
	AppInit( ).smoothScrolling( );
	AppInit( ).gallery1( "gallery1" );
	AppInit( ).gallery2( );


}

window.onscroll = function( ) {
	var container = document.body;
	var navigation = document.getElementById( "nav-container" );
	var content = document.getElementById( "content" );

	var tempHeight = window.pageYOffset;

	if( tempHeight > 1 ) {
		navigation.setAttribute( "class", "floating-nav" );
		content.setAttribute( "class", "floating-offset" );

	} else {
		navigation.setAttribute( "class", "" );
		content.setAttribute( "class", "" );
	}

	if( tempHeight > 767 && tempHeight < 1500 ||
		tempHeight > 2014 && tempHeight < 3360 ||
		tempHeight > 4120 && tempHeight < 5154 ) {
		CSSUtility.addClass( "nav-container", "dropShadow" );
	}
}


/* ===============================================
	APPLICATION SESSION STATE
	=============================================== */
	var AppSessionState = {
	nav_section : {}		//Holds all the navigation button
}


function AppInit( ) {
	/*\
	|*|	Find all the buttons in the navigation that matches the id "btn-*"
	|*|
	|*|	@navigationId	- Refers to the navigation container.
	|*| @prefix			- id prefix for individual buttons
	\*/
	function navigationList( navigationId, prefix ) {
		var navigationList = document.getElementById( navigationId ).children;
		var list = [];

		//===============================
		// Retrieve All Navigation Tabs
		//===============================
		for( var i = 0; i < navigationList.length; i++ ) {
			if( ( navigationList[ i ].id ).match( prefix ) ) {
				var id = document.getElementById( navigationList[ i ].id ).getAttribute( 'data-s' );
				var section = document.getElementById( id );
				AppSessionState.nav_section[ navigationList[ i ].id ] = id;
			}
		}
	}


	/*\
	|*|	Setup the navigation toggle button.  This button only seen when screen is too small.
	\*/
	function initNavigationToggle( ) {
		var nav_icon = document.getElementById( "nav-bar" );
		var hidden_menu = document.getElementById( "hidden-menu" );
		hidden_menu.style.display = "none";

		if( nav_icon.addEventListener ) {
			nav_icon.addEventListener( 'click', function( ) {
				if( hidden_menu.style.display === "none" ) {
					hidden_menu.style.display = "block";
				} else {
					hidden_menu.style.display = "none";
				}
			} ) ;

		} else {
			nav_icon.attachEvent( "onclick", function( ) {
				if( hidden_menu.style.display === "none" ) {
					hidden_menu.style.display = "block";
				} else {
					hidden_menu.style.display = "none";
				}
			} );
		}		
	}


	/*\
	|*| Section 4 - WORKS
	|*| 	Adding eventListener to board-member, advisor, awards, and fellowships
	|*| 
	\*/
	function initWorkSection( ) {
		var workButton = [ "board-member", "advisor", "award", "fellowship" ];

		for( var i = 0; i < workButton.length; i++ ) {
			var buttons = document.getElementsByName( workButton[ i ] );

			for( var j = 0; j < buttons.length; j++ ) {
				buttons[ j ].children[ 0 ].addEventListener( 'click', function( e ) {
					var info = this.nextElementSibling;

					if( isOpened( info ) ) {
						smoothClose( info );
					} else {
						var height = heightSample( info );
						smoothOpen( info, height );
					}
				});
			}
		}
		

		function heightSample( obj ) {
			var tempClass = obj.getAttribute( "class" );
			var height = 0;

			obj.style.display = "block";
			obj.setAttribute( "class", "test" );
			height = obj.clientHeight;
			obj.setAttribute( "class", tempClass );

			obj.style.height = "0px";
			return height;
		}

		function isOpened( obj ) {
			return obj.getAttribute( "class" ).match( /open-info/ ) ? true : false;
		}


		function smoothOpen( elementObj, openHeight ) {
			var frame = new FrameRegulator( 60, 100 );

			var heightPerSecond = openHeight / frame.getFPS( );
			var newHeight = 0;

			var paddingPerSecond = 10 / frame.getFPS( );		
			var newPad = 0;

			var scrollIntervalId = setInterval( function( ) {
				newPad += paddingPerSecond;
				elementObj.style.paddingTop = Math.ceil( newPad ) + "px";
				elementObj.style.paddingBottom = Math.ceil( newPad ) + "px";

				newHeight += Math.round( heightPerSecond );
				elementObj.style.height = newHeight + "px";

				if( elementObj.style.height.replace( /[a-z]/g, "" ) >= openHeight ) {
					elementObj.setAttribute( "class", "open-info" );
					clearInterval( scrollIntervalId );
				}
			}, frame.calcFPS( ) );
		}

		function smoothClose( elementObj ) {
			var frame = new FrameRegulator( 60, 100 );

			var sampleHeight = elementObj.clientHeight - 20;
			var heightPerSecond = sampleHeight / frame.getFPS( );
			var offHeight = 0;

			var samplePadding = 10;
			var paddingPerSecond = samplePadding / frame.getFPS( );
			var offPadding = 0;

			elementObj.style.overflow = "hidden";

			var scrollIntervalId = setInterval( function( ) {
				offHeight += heightPerSecond;
				elementObj.style.height = ( sampleHeight - Math.round( offHeight ) ) + "px";
				
				offPadding += paddingPerSecond;
				elementObj.style.paddingTop = ( samplePadding - Math.round( offPadding ) ) + "px";
				elementObj.style.paddingBottom = ( samplePadding - Math.round( offPadding ) ) + "px";

				if( elementObj.style.height.replace( /[a-z]/g, "" ) <= 0 ) {
					elementObj.style.height = offHeight + ( offPadding * 2 ) + "px";
					elementObj.style.display = "none";
					elementObj.setAttribute( "class", "more-info" );
					clearInterval( scrollIntervalId );
				}
			}, frame.calcFPS( ) );
		}
	}


	/*\
	|*|	Initialize navigation links smooth scrolling
	\*/
	function initSmoothScrolling( ) {
		var sections = !Object.keys 
		? PolyfillUtility.keys( AppSessionState.nav_section ) 
		: Object.keys( AppSessionState.nav_section );

		for( var i = 0; i < sections.length; i++ ) {
			var button = document.getElementById( sections[ i ] );			

			button.addEventListener( "click", function( e ) {
				var frame = new FrameRegulator( 60, 500 );

				var tempHeight		= window.pageYOffset;
				var targetSection 	= AppSessionState.nav_section[ PolyfillUtility.srcElement( e ).id ];
				var targetHeight	= ScrollUtility.getVerticalSectionOffset( targetSection ) - 80;

				window.scrollTo( 0, tempHeight );	//Reset Height

				var scrollPerSecond = MathUtility.getDiff( tempHeight, targetHeight ) / frame.getFPS( );
				var curScrollPos = tempHeight;

				var scrollIntervalId = setInterval( function( ) {
					if( targetHeight == -80 ) {
						clearInterval( scrollIntervalId );

					} else if( window.pageYOffset < targetHeight ) {
						curScrollPos += Math.round( scrollPerSecond );
						window.scrollTo( 0, curScrollPos );
						
						if( window.pageYOffset >= targetHeight ) {
							window.scrollTo( 0, targetHeight );
							clearInterval( scrollIntervalId );
						}
					} else {
						curScrollPos += Math.round( scrollPerSecond );
						window.scrollTo( 0, curScrollPos );
						
						if( window.pageYOffset <= targetHeight ) {
							window.scrollTo( 0, targetHeight );
							clearInterval( scrollIntervalId );
						}
					}
				}, frame.calcFPS( ) );
			});
		}
	}

	/*\
	|*|	Initialize gallery1 scrolling for section 6
	\*/
	function initGallery1( galleryId ) {
		var galleryBtns = document.querySelector( ".gallery-control-box" ).children;

		for( var i = 0; i < galleryBtns.length; i++ ) {

			if( galleryBtns[ i ].addEventListener ) {
				galleryBtns[ i ].addEventListener( 'click', function( e ) {
					var frame 	= new FrameRegulator( 60, 250 );
					var gallery = document.getElementById( "gallery1" );
					
					var curLeftOffset = TextUtility.removeCSSSubfix( gallery.style.left ) || 0;
					var targetOffset = ( ( PolyfillUtility.srcElement( e ).id ).split( "" ).pop( ) - 1 ) * 0.25 * -5120;

					var diff = Math.abs( MathUtility.getDiff( curLeftOffset, targetOffset ) );
					var diffPerSecond = diff / frame.getFPS( );

					gallery.style.left = curLeftOffset + "px";

					var scrollIntervalId = setInterval( function( ) {
						// ==================================
						// SCROLL GALLERY TO THE LEFT
						//		DECREASE THE LEFT VALUE
						//===================================
						if( curLeftOffset > targetOffset ) {
							gallery.style.left = CSSUtility.decrementProp( gallery.style.left, diffPerSecond );

							var newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

							if( newOffset <= targetOffset ) {
								gallery.style.left = targetOffset + "px";
								clearInterval( scrollIntervalId );
							}

							// ==================================
							// SCROLL GALLERY TO THE RIGHT
							//		INCREASE THE LEFT VALUE
							//===================================
						} else {
							gallery.style.left = CSSUtility.incrementProp( gallery.style.left, diffPerSecond );

							var newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

							if( newOffset >= targetOffset ) {
								gallery.style.left = targetOffset + "px";
								clearInterval( scrollIntervalId );
							}
						}					
					}, frame.calcFPS( ) );
				} );
			} else {
				galleryBtns[ i ].attachEvent( 'onclick', function( e ) {
					var frame 	= new FrameRegulator( 60, 250 );
					var gallery = document.getElementById( "gallery1" );
					
					var curLeftOffset = TextUtility.removeCSSSubfix( gallery.style.left ) || 0;
					var targetOffset = ( ( PolyfillUtility.srcElement( e ).id ).split( "" ).pop( ) - 1 ) * 0.25 * -5120;

					var diff = Math.abs( MathUtility.getDiff( curLeftOffset, targetOffset ) );
					var diffPerSecond = diff / frame.getFPS( );

					gallery.style.left = curLeftOffset + "px";

					var scrollIntervalId = setInterval( function( ) {
						// ==================================
						// SCROLL GALLERY TO THE LEFT
						//		DECREASE THE LEFT VALUE
						//===================================
						if( curLeftOffset > targetOffset ) {
							gallery.style.left = CSSUtility.decrementProp( gallery.style.left, diffPerSecond );

							var newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

							if( newOffset <= targetOffset ) {
								gallery.style.left = targetOffset + "px";
								clearInterval( scrollIntervalId );
							}

							// ==================================
							// SCROLL GALLERY TO THE RIGHT
							//		INCREASE THE LEFT VALUE
							//===================================
						} else {
							gallery.style.left = CSSUtility.incrementProp( gallery.style.left, diffPerSecond );

							var newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

							if( newOffset >= targetOffset ) {
								gallery.style.left = targetOffset + "px";
								clearInterval( scrollIntervalId );
							}
						}					
					}, frame.calcFPS( ) );
				} );
			}
		}
	}

	/*\
	|*|	Initialize gallery2 scrolling for section 7
	\*/
	function initGallery2( ) {
		var galleryBtns = document.querySelector( ".gallery2-control" ).children;

		for( var i = 0; i < galleryBtns.length; i++ ) {
			if( galleryBtns[ i ].addEventListener ) {
				galleryBtns[ i ].addEventListener( 'click', function( e ) {
					var frame 	= new FrameRegulator( 60, 250 );
					var gallery = document.getElementById( "gallery2" );

					var curLeftOffset = TextUtility.removeCSSSubfix( gallery.style.left ) || 0;
					var targetOffset = ( ( PolyfillUtility.srcElement( e ).id ).split( "" ).pop( ) - 1 ) * 0.25 * -4300;

					var diff = Math.abs( MathUtility.getDiff( curLeftOffset, targetOffset ) );
					var diffPerSecond = diff / frame.getFPS( );

					gallery.style.left = curLeftOffset + "px";

					var scrollIntervalId = setInterval( function( ) {
						// ==================================
						// SCROLL GALLERY TO THE LEFT
						//		DECREASE THE LEFT VALUE
						//===================================
						if( curLeftOffset > targetOffset ) {
							gallery.style.left = CSSUtility.decrementProp( gallery.style.left, diffPerSecond );

							var newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

							if( newOffset <= targetOffset ) {
								gallery.style.left = targetOffset + "px";
								clearInterval( scrollIntervalId );
							}

							// ==================================
							// SCROLL GALLERY TO THE RIGHT
							//		INCREASE THE LEFT VALUE
							//===================================
						} else {
							gallery.style.left = CSSUtility.incrementProp( gallery.style.left, diffPerSecond );

							var newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

							if( newOffset >= targetOffset ) {
								gallery.style.left = targetOffset + "px";
								clearInterval( scrollIntervalId );
							}
						}					
					}, frame.calcFPS( ) );
				} );
			} else {
				galleryBtns[ i ].attachEvent( 'click', function( e ) {
					var frame 	= new FrameRegulator( 60, 250 );
					var gallery = document.getElementById( "gallery2" );

					var curLeftOffset = TextUtility.removeCSSSubfix( gallery.style.left ) || 0;
					var targetOffset = ( ( PolyfillUtility.srcElement( e ).id ).split( "" ).pop( ) - 1 ) * 0.25 * -4300;

					var diff = Math.abs( MathUtility.getDiff( curLeftOffset, targetOffset ) );
					var diffPerSecond = diff / frame.getFPS( );

					gallery.style.left = curLeftOffset + "px";

					var scrollIntervalId = setInterval( function( ) {
						// ==================================
						// SCROLL GALLERY TO THE LEFT
						//		DECREASE THE LEFT VALUE
						//===================================
						if( curLeftOffset > targetOffset ) {
							gallery.style.left = CSSUtility.decrementProp( gallery.style.left, diffPerSecond );

							var newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

							if( newOffset <= targetOffset ) {
								gallery.style.left = targetOffset + "px";
								clearInterval( scrollIntervalId );
							}

							// ==================================
							// SCROLL GALLERY TO THE RIGHT
							//		INCREASE THE LEFT VALUE
							//===================================
						} else {
							gallery.style.left = CSSUtility.incrementProp( gallery.style.left, diffPerSecond );

							var newOffset = TextUtility.removeCSSSubfix( gallery.style.left );

							if( newOffset >= targetOffset ) {
								gallery.style.left = targetOffset + "px";
								clearInterval( scrollIntervalId );
							}
						}					
					}, frame.calcFPS( ) );
				} );
			}
		}
	}


	var initAPI = {
		navigationList : navigationList,
		navigationToggle : initNavigationToggle,
		workSection : initWorkSection,
		smoothScrolling : initSmoothScrolling,
		gallery1 : initGallery1,
		gallery2 : initGallery2
	};

	return initAPI;
}



/* ===============================================
	Init Section 1
	=============================================== */
	function initSection1( ) {
		var section = document.getElementById( "section1" );
		section.style.width = window.innerWidth + "px";
		section.style.height = (window.innerWidth / wRatio * hRatio) + "px";
	}



/* ===============================================
	Utility Methods
	=============================================== */
	var ratio  = MathUtil( ).GCD( screen.width, screen.height );
	var wRatio = screen.width / ratio;
	var hRatio = screen.height / ratio;





/*\
|*|	Math Utility Library	
\*/
function MathUtil( ) {
	function calcGCD( a, b ) {
		return b == 0 ? a : calcGCD( b, a % b ); 
	}

	function getDiff( a, b ) {
		return b - a;
	}

	return mathAPI = {
		GCD : calcGCD,
		getDiff : getDiff
	};
}
var MathUtility = new MathUtil( );



/*\
|*|	============================================
|*|	Scroll Utility Library
|*|	============================================ \*/
function ScrollUtil( ) {

	/*\	================================================================================
	|*|	getVerticalSectionOffset
	|*| 	Used for "Smooth Scrolling".  
	|*|		This effect is used in a single page website, where the user clicks on the
	|*|		navigation link, and it will smoothly scroll to the section instead of
	|*|		instantly jump to the id anchor.
	|*|	
	|*|		REQUIRE : DEFINITION RESTRUCTURE
	|*|			SAMPLING - WHEN YOU WANT TO FIND OUT A RESULT BEFORE HAND.
	|*|				EXAMPLE - YOU WANT TO KNOW THE OFFSET HEIGHT FOR THE SMOOTH SCROLLING
	|*|			
	|*|		
	|*| 	@containerID	- The container id that is responsible for the scrolling
	|*|						  The container id is used to reset the scrolling to the top
	|*|		@targetID		- The id anchor you wish to scroll towards.
	|*|
	|*|	return	- It returns a numeric value. The value is the offset scroll height
	|*|			  From top to the id anchor.
	|*|	============================================================================= */
	function getVerticalSectionOffset( targetID ) {
		document.getElementById( targetID ).scrollIntoView( );
		
		return window.pageYOffset;
	}

	return scrollAPI = {
		getVerticalSectionOffset : getVerticalSectionOffset
	};
}
var ScrollUtility = new ScrollUtil( );



/*\	============================================
|*|	FRAME REGULATOR OBJECT
|*|		For animation purposes, this does not only applies to graphics, but also for 
|*|		animating transition effects that CSS cannot accomplish.
|*|
|*| HOW TO USE:
|*|		var newFrame = new FrameRegulator( fps, duration );
|*|		@fps 	  - The frames per second used by the animation
|*|		@duration - How many seconds or how long the animation last.
|*|	============================================ \*/
function FrameRegulator( fps, duration ) {
	function privateField( ) {
		this._fps;
		this._duration;
	}

	privateField._fps = fps;
	privateField._duration = duration;

	this.calcFPS = function( ) {
		return privateField._fps / privateField._duration;
	}

	this.getFPS = function( ) {
		return privateField._fps;
	}

	return FrameAPI = {
		calcFPS : this.calcFPS,
		getFPS : this.getFPS
	};
}



/*\	============================================
|*|	TEXT UTILITY OBJECT
|*|		FOR TEXT MANIPULATION PURPOSES
|*|	============================================ \*/
function TextUtil( ) {
	this.removeCSSSubfix = function( targetProperty ) {
		return targetProperty.replace( /[a-z]/g, "" );
	}

	return TextUtilAPI = {
		removeCSSSubfix : this.removeCSSSubfix
	};
}
var TextUtility = new TextUtil( );



/*\	============================================
|*|	CSS UTILITY
|*|		FOR CSS MANIPULATION PURPOSES
|*|	============================================ \*/
function CSSUtil( ) {
	this.incrementProp = function( targetProperty, value ) {
		var newValue = parseFloat( TextUtility.removeCSSSubfix( targetProperty ) ) + value;
		return newValue + "px";
	}

	this.decrementProp = function( targetProperty, value ) {
		var newValue = parseFloat( TextUtility.removeCSSSubfix( targetProperty ) ) - value;
		return newValue  + "px";
	}

	this.removeClass = function( targetId, className ) {
		var element 	= document.getElementById( targetId );
		var classList	= PolyfillUtility.from( element.classList );

		classList = classList.filter( function( ) {
			return ( e === className ) ? false : true;
		});

		element.setAttribute( "class", classList.join( " " ) );
	}

	this.addClass = function( targetId, className ) {
		var element 	= document.getElementById( targetId );
		var classList	= PolyfillUtility.from( element.classList );
		classList.push( className );

		element.setAttribute( "class", classList.join( " " ) );
	}

	return CSSUtilAPI = {
		incrementProp : this.incrementProp,
		decrementProp : this.decrementProp,
		removeClass : this.removeClass,
		addClass : this.addClass
	};
}
var CSSUtility = new CSSUtil( );



/*\	============================================
|*|	BROWSER UTILITY
|*|		FOR BROWSER DETECTION PURPOSES
|*|	============================================ \*/
function BrowserUtil( ) {
	var browserList = [ "MSIE", "Trident" ];

	this.getBrowserInfo = function( ) {
		for( var i = 0; i < browserList.length; i++ ) {
			var vendor = new RegExp( browserList[i] );
			if( ( window.navigator.userAgent ).match( vendor ) ) {
				return "IE";
			}
		}
		return false;
	}

	return BrowserUtilAPI = {
		getBrowserInfo : this.getBrowserInfo
	};
}
var BrowserUtility = new BrowserUtil( );


/*\	============================================
|*|	POLYFILL UTILITY
|*|		IMITATE ADVANCE FEATURE IN OLDER BROWSER
|*|	============================================ \*/
function PolyfillUtil( ) {
	this.keys = function( obj ) {
		var keys = [];

		for( var i in obj ) {
			if( obj.hasOwnProperty(i) ) {
				keys.push( i );
			}
		}
		return keys;
	}

	this.from = function( obj ) {
		var from = [];

		for( var i = 0; i < obj.length; i++ )
			from.push( obj[ i ] );

		return from;
	}

	this.srcElement = function( obj ) {
		return obj.srcElement ? obj.srcElement : obj.target;
	}

	return {
		keys : this.keys,
		from : this.from,
		srcElement : this.srcElement
	};
}
var PolyfillUtility = new PolyfillUtil( );