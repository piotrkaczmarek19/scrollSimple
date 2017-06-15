(function () 
{
	this.ScrollSimple = function ()
	{

		var defaults = 
		{
			contentHolder : "section",
			speed : 500,	
			quietTime : 1400,
			currentIndex : 1,
			lastAnimation : 0		
		}
		self = this;
		this.options = defaults;

		Object.prototype.extend = function (obj)
		{
			for (var key in obj)
			{
				this[key] = obj[key];
			}
		} 
		// Check if arguments defined and if it  is the case, merge with defaults
		if (arguments[0] && typeof arguments[0] == "object")
		{
			this.options.extend(arguments[0])
		}

		this.init();

		this.watchResize();

		this.main();

		window.addEventListener('resize', this.watchResize)
	}

	ScrollSimple.prototype.init = function ()
	{
		// Setting up screen height and number of sections
		var scrnHeight = window.innerHeight;
		var nbrSections = document.querySelectorAll("."+self.options.contentHolder).length;
		var speed = self.options.speed / 1000;
		$body = document.querySelector("body");
		$sectionArray = document.querySelectorAll('.'+self.options.contentHolder);
		self.options.extend({screenHeight : scrnHeight, numberSections : nbrSections});

		$body.style.webkitTransition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s"; 
		$body.style.MozTransition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s"; 
		$body.style.msTransition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s";
		$body.style.OTransition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s";
		$body.style.Transition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s";
		$body.style.overflow = "hidden";

		for (var i = 0; i < $sectionArray.length; i++)
		{
			console.log($sectionArray[i])
			$sectionArray[i].style.overflow = "hidden";	
			$sectionArray[i].style.height = "100vh";
		}
		
	}

	ScrollSimple.prototype.watchResize = function ()
	{
		// re-initialize parameters whenever screen is resized
		self.init();
		// Re-position body according to new screen height
		self.moveTo(self.options.currentIndex);
	}	

	ScrollSimple.prototype.main = function ()
	{
		// Mouse scroll listener
		this.scrollMouse();

		// Touch scroll listener
		this.scrollTouch();

		// Keyboard scroll listener
		this.scrollKey();
	}

	ScrollSimple.prototype.scrollMouse = function ()
	{
		// Body for custom scrollig fn, if agent is web browser
		
		window.addEventListener("DOMMouseScroll", function (event)
		{
			// prevent default scrolling 
			event.preventDefault();

			var mode = "scroll";
			// Direction of scrolling
			var delta = event.wheelDelta || -event.detail;
			self.init_scroll(event, delta, mode);
		});
	}

	ScrollSimple.prototype.scrollTouch = function ()
	{
		// Body for custom scrolling fn, if user is on smartphone
				
		window.addEventListener("touchmove", function (event)
		{
			// prevent default scrolling 
			event.preventDefault();
			event.stopImmediatePropagation();
			var mode = "swipe";

			// Computing direction of swipe
			document.addEventListener("touchstart", function (event)
			{
				start_coordinateY = event.originalEvent.touches[0].clientY;
				document.addEventListener('touchend', function (event)
				{
					end_coordinateY = event.originalEvent.changedTouches[0].clientY;
					distance_moved = start_coordinateY - end_coordinateY;

					// failsafe to make sure user is swiping and not just clicking on an el
					if (distance_moved > 40 || distance_moved < -40)
					{
						// delta is -distance moved to reflect swiping mechanic and swipe mode to allow smaller quiet time between scrolls
						var delta = -distance_moved;
						var mode = "swipe";
						this.init_scoll(event, delta, mode)
					}
					else
					{
						el = event.originalEvent.target;
						el.click();
					}
				})
			});
		});
	}

	ScrollSimple.prototype.scrollKey = function (event)
	{
		// Body for custom scrolling fn, if user presses directionnal arrows

		window.addEventListener('keyup', function (event)
		{
			// press up
			if (event.keyCode == 38)
			{
				var delta = 1;
				this.init_scroll(event, delta, "swipe");
			}
			// else if press down
			else if (event.keyCode == 40)
			{
				var delta = -1;
				init_scroll(event, delta, "swipe");
			};
		});
	}

	ScrollSimple.prototype.moveDown = function ()
	{

		// move down one page
		var index = this.options.currentIndex;
		var nbrSections = this.options.numberSections;
		var verticalOffset = this.options.screenHeight * index;
		console.log(this.options.screenHeight)
		//console.log(document.querySelector('body').innerHeight / numberSections);
		//console.log(index);

		if (index == nbrSections)
		{
			// If trigger scroll down event from bottom section, user comes back to first section
			this.translate(0, this.options.speed, 1, 'body');
		    this.options.currentIndex = 1;
		}
		else
		{
			// Normal scrolling
			this.translate(verticalOffset, this.options.speed, -1, 'body');
		    this.options.currentIndex += 1;
		}
	}

	ScrollSimple.prototype.moveUp = function ()
	{
		console.log(this.options.currentIndex);
		// move up one page
		var index = this.options.currentIndex;
		var nbrSections = this.options.numberSections;
		

		if (index == 1)
		{
			// If scroll up from top section, user arrives on last section
			var verticalOffset = this.options.screenHeight * (nbrSections - 1);
			this.translate(verticalOffset, this.options.speed, -1, 'body');
		    this.options.currentIndex = nbrSections;
		}
		else
		{
			// Normal scrolling
			var verticalOffset = -this.options.screenHeight * (index - 2);
			this.translate(verticalOffset, this.options.speed, 1, 'body');
		    this.options.currentIndex -= 1;
		}		
	}

	ScrollSimple.prototype.moveInner = function (offsetY, index)
	{
		var index = this.options.currentIndex,
			speed = this.options.speed / 1000;
		// Scroll locally on current page without changing section if local content overflows
		var $content = document.querySelector('.'+this.options.contentHolder+"-"+index).children;
		for (var i = 0; i < $content.length; i++)
		{
			$content[i].style.webkitTransition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s"; 
			$content[i].style.MozTransition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s"; 
			$content[i].style.msTransition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s";
			$content[i].style.OTransition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s";
			$content[i].style.Transition = "transform cubic-bezier(0.39, 0.575, 0.565, 1) "+speed+"s";
			this.translate( offsetY, this.options.speed, 1, $content[i]);
		}
	}

	ScrollSimple.prototype.moveTo = function (index)
	{
		// Go to specific page, eg when user presses href link
		var offsetY = (index - 1) * this.options.screenHeight;
		this.translate(offsetY, this.options.speed, -1, 'body');
		this.options.currentIndex = index;
	}

	ScrollSimple.prototype.init_scroll = function (event, delta, mode)
	{
		// controll scrolling, disable it for duration of quietTime to avoid user scrolling past what he wants
		var time = new Date().getTime(),
			quietPeriod = (mode === "scroll") ? this.options.quietTime : this.options.quietTime * 0.8;
			index = this.options.currentIndex,
			$currentSection = document.querySelector('.'+this.options.contentHolder+"-"+index),
			number_children = $currentSection.children.length - 1,
			// Added failsafe: in case section has no els, replace last&first child with section (triggers moveUp/Down)
			$lastChild = (number_children > -1) ? $currentSection.children[number_children] : $currentSection,
			$firstChild = (number_children > -1) ? $currentSection.children[0] : $currentSection;
		var overflow;
		// Cancel scroll if currently animating or within quiet period
		if (time - this.options.lastAnimation < quietPeriod)
		{
			event.preventDefault();
			return;
		}

		if (delta < 0)
		{
	   		overflow = this.options.screenHeight - $lastChild.getBoundingClientRect().y - $lastChild.height;
	    	overflow < -30 ? this.moveInner(overflow, index) : this.moveDown();
		}
		else if (delta > 0)
		{
			overflow =  -$firstChild.getBoundingClientRect().y ;
			overflow > 30 ? this.moveInner(0, index) : this.moveUp()		
		}
		this.options.lastAnimation = time;
	}
	ScrollSimple.prototype.translate = function (offsetY, speed, delta, el)
	{
		var dir = (delta > 0) ? 1 : -1; 

		var $el = (toString.call(el) == "[object String]")? document.querySelector(el) : el;
		$el.style.webkitTransform = "translate3d(0,"+dir*offsetY+"px, 0)"; 
		$el.style.MozTransform = "translate3d(0,"+dir*offsetY+"px, 0)"; 
		$el.style.msTransform	= "translate3d(0,"+dir*offsetY+"px, 0)";
		$el.style.OTransform = "translate3d(0,"+dir*offsetY+"px, 0)";
		$el.style.Transform = "translate3d(0,"+dir*offsetY+"px, 0)";	
	}
}());