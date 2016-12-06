(function(){
	var app= angular.module('myApp',[]);


	function to_HMS(seconds){
		var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
		var numseconds =(((seconds % 31536000) % 86400) % 3600) % 60;
		numseconds=numseconds.toPrecision(2);
		return numminutes + " minutes " + numseconds + " seconds";
	}
	

	var spotify_url ="https://api.spotify.com/v1/search?type=artist&query="
	
	

	app.controller('MusicController', function($http, $scope, $compile, $sce){
		//console.log($scope.artists);
		var artist = this;
		var artist_data=[];
		var album_data=[];
		var track_data=[];
		
		
		var searchArtist =function(url){

			$http({
        		method:'GET',
        		url: url
        	}).then(function success(response){
        		for(i in response.data.artists.items){
        			artistName=response.data.artists.items[i].name;
					artistId=response.data.artists.items[i].id;
					//artistPic=response.data.artists.items[i].images[1];
					selected=false;

					//create array of objects
					artist_data[i]={"name":artistName,
									"id":artistId,
									//"pic":artistPic,	
									'selected':selected,
								}			
        		}
        		


        	},function error(response){
        		console.log('unsuccessful call');

        	});
		};

		var searchAlbum= function(url){
			

			$http({
        		method:'GET',
        		url: url
        	}).then(function success(response){
					
        			for(i in response.data.items){
        				
        				albumName=response.data.items[i].name;
						albumId=response.data.items[i].id;
						albumPic=response.data.items[i].images[1];

						//create array of objects
						album_data[i]={"name":albumName,
									"id":albumId,
									//"Pic":albumPic,
									"selected":false,	
									}
        			}
        			if (album_data[i+1]){
        				album_data=album_data.slice(i);
        			}
        		
        		//console.log(album_data)
			
        	},function error(response){
        		console.log('unsuccessful call');

        	});
		};
		
		var searchTrack=function(url){	

			$http({
        		method:'GET',
        		url: url
        		
        	}).then(function success(response){

        		for(i in response.data.items){
         			trackName=response.data.items[i].name;
					trackPreview=response.data.items[i].preview_url;
					trackLength=to_HMS(response.data.items[i].duration_ms/1000);

					//create array of objects
					track_data[i]={"name":trackName,
				 					"lenght":trackLength,
									"preview":trackPreview,
									"selected":false,	
					 			}
        		}
        		if (typeof track_data[i+1]!=='undefined'){
        				track_data=track_data.slice(i);
        			}
        		//console.log(track_data)

        	},function error(response){
        		console.log('unsuccessful call');

        	});

		};
      	
      	artist.submit = function(response) {
        	searchUrl=spotify_url+artist.artists;
        	searchArtist(searchUrl);
        	//console.log(artist_data);
        	$scope.artist_data=artist_data; 	
      	};


      	$scope.getAlbum= function(id, response){
      		albumUrl="https://api.spotify.com/v1/artists/"+id+"/albums"
      		//console.log(artist_data);
      		searchAlbum(albumUrl);
      		$scope.album_data=album_data;	
      	}
      	
      	$scope.getTracks=function(id, response){
      		tracksUrl="https://api.spotify.com/v1/albums/"+id+"/tracks";
      		//console.log(tracksUrl);
      		searchTrack(tracksUrl);
      		$scope.track_data=track_data;
      		

      		//$scope.givenUrl =  $sce.trustAsResourceUrl(track_data.preview);
      	};

      	$scope.playPreview= function(clip, response){
      		$scope.clip=$sce.trustAsResourceUrl(clip);
      		console.log(clip);


      	};
		
	});
	
})();