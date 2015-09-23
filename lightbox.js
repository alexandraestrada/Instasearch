//LIGHTBOX-MVC

//USE MVC STRUCTURE AND OBJECT ORIENTED JAVASCRIPT TO CREATE INSTAGRAM HASHTAG SEARCH 
//WITH LIGHTBOX VIEW. USER HAS ABILITY TO SEE NEXT IMAGE FROM LIGHTBOX.



//-----------Instantiate a new instance of Jsonp class on 'enter' of hashtag input.------
	document.getElementById("submitVal").onkeypress = function(e) {
	    if(e.which === 13 || e.keyCode === 13) {
	        e.preventDefault();
	        var hashtag = document.getElementById("submitVal").value;

	        //call new instance of Jsonp and call prototype function.
	        var request = new Jsonp(hashtag,'https://api.instagram.com/v1/tags/', 'callbackFunction' );
	        request.apiCall();
	    }
	}


//----------Jsonp Constructor Class-------------------


	var Jsonp = function(hashtag, url, callbackName) {
		//extract hashtag from input, jsonp callback name, and api url
		this.hashtag = hashtag;
		this.callback = callbackName;
		this.url = url;
	}

	//---------Jsonp prototype function: create head script for api call -------
	Jsonp.prototype.apiCall = function() {
		var script = document.createElement('script');
		    script.src = this.url + this.hashtag + '/media/recent?client_id=ba9624f051464cb1a555717ff309d90b&callback=' + this.callback;
		    document.head.appendChild(script);
		    document.head.removeChild(script);

	};


//-----------jsonp callback function---------------------

	
	function callbackFunction(data) {
		//instantiate new hashtag collection and and new hashtag grid view passing callback data 
		var	hashtags = new HashtagCollection(data),
			gridview = new HashtagGridView(hashtags);
	}


//----------Hashtag Model--------------------------------
	var HashtagModel = function(JSON) {
		this.img = JSON.images.standard_resolution.url;
		this.caption = JSON.caption.text;
		this.username = JSON.user.username;
		this.profilepic = JSON.user.profile_picture;
		this.index = JSON.index;
	}
//-----------Hashtag Collection---------------------------
	var HashtagCollection = function(JSON) {
		this.resultsArray = [];
		for (i = 0; i < JSON.data.length; i ++) {
			JSON.data[i].index = i
			this.resultsArray.push(new HashtagModel(JSON.data[i]))

		}
	}

//------------Hashtag Views--------------------------------
	//display hashtag div results in grid layout
	var HashtagGridView = function(hashtags) {
		var gridDiv = document.getElementById('gridviewContainer'),
			hashtags = hashtags.resultsArray;
		if(gridDiv.hasChildNodes()) {
			gridDiv.innerHTML = ''
		}
		for(i=0; i < hashtags.length; i++) {
			var hashtagItem= hashtags[i];
			//call subview to create individual image divs.
			gridDiv.appendChild(new HashtagView(hashtagItem, hashtags))
		}
		return gridDiv;
	}

	//hashtag sub view--individual div containing image
	var HashtagView = function(hashtagItem, hashtags) {
		var hashtagDiv = document.createElement('div'),
			img = document.createElement('img');
		hashtagDiv.className='gridHashItem'; 
		img.className = 'hashtagGridImg';
		img.setAttribute('src', hashtagItem.img);
		hashtagDiv.appendChild(img);

		//Grid Event Listener----trigger lightbox view
		img.addEventListener('click' , function(e) {
			e.preventDefault();

			var lightbox = new LightboxView(hashtagItem, hashtags);
		});
		return hashtagDiv;


	}

//------------Lightbox Views--------------------------------
	//create Lightbox and content container for slide inside lightbox
	var LightboxView = function(hashtagItem, hashtags) {
		var currentPosition = hashtags[hashtagItem.index].index,

			lightbox = document.createElement('div');
			lightbox.id = 'lightbox';
			lightbox.innerHTML = '<div id="arrows"><img id="previous" src="images/prev_arrow.png"/><img id="next" src="images/next_arrow.png"/></div><p id="close">X</p>';
			document.body.appendChild(lightbox);
		arrowDispalyCheck();
			
		var lightboxContainer = document.getElementById('lightbox'),
			lightboxImg = new LightboxImgView(hashtagItem);
			lightboxContainer.appendChild(lightboxImg);

		//--------EVENT LISTENERS FOR LIGHTBOX--------------

		document.getElementById('previous').addEventListener('click', function() {
			currentPosition--
			lightboxContainer.removeChild(lightboxImg);
			lightboxImg = new LightboxImgView(hashtags[hashtagItem.index -= 1]);
			lightboxContainer.appendChild(lightboxImg);
			arrowDispalyCheck();
		})
		document.getElementById('next').addEventListener('click', function() {
			currentPosition ++;
			lightboxContainer.removeChild(lightboxImg);
			lightboxImg = new LightboxImgView(hashtags[hashtagItem.index += 1]);
			lightboxContainer.appendChild(lightboxImg);
			arrowDispalyCheck();
			
		})
		document.getElementById('close').addEventListener('click', function() {
			document.body.removeChild(lightbox);
		})
		function arrowDispalyCheck() {
			if (currentPosition === 0) {
			document.getElementById('previous').style.visibility = 'hidden';
			}
			else if (currentPosition >= 19) {
			document.getElementById('next').style.visibility = 'hidden';
			}
			else {
			document.getElementById('previous').style.visibility = 'visible';
			document.getElementById('next').style.visibility = 'visible';
			}
		}
	}
	//individual lightbox image view-- append new slide to lightbox.
	var LightboxImgView = function(hashtagItem) {
		var slideshow = document.createElement('div'),
			slide = '<div class="slide"><div class="userinfo"><a href="http://www.instagram.com/'+hashtagItem.username+'"><img class="profilepic" src="' + hashtagItem.profilepic +'"/><p class="username">'+hashtagItem.username+'</p></a></div><img src="'+ hashtagItem.img + '"/><p class="caption">'+ hashtagItem.caption +'</p></div>';
			slideshow.className = 'slideshow';
			slideshow.innerHTML += slide;
		
		return slideshow

	}