$(function(){
  $("#addPlaylist").on("click", function(){

    var input = '<div class="mdl-textfield mdl-js-textfield"> <input id="link" class="mdl-textfield__input" type="text" id="sample1"> <label class="mdl-textfield__label" for="sample1">Text...</label> </div>';
    showDialog({
      title: 'add Playlist',
      text: input,
      negative: {
        title: 'Cancel'
      },
      positive: {
        title: 'add',
        onClick: function() {
          var link = $("#link").val();
          addPlaylist(link, "playlist");
        }
      },
      cancelable: false,
    });
  });
});

function addPlaylist(link, name){
  //<iframe width="100%" height="300" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/13770089&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>
  var correctedLink = link;
  correctedLink = correctedLink.replace("show_comments=true","show_comments=false");
  correctedLink = correctedLink.replace("hide_related=false","hide_related=true");
  correctedLink = correctedLink.replace("show_user=true","show_user=false");
  correctedLink = correctedLink.replace("visual=true","visual=false");
  correctedLink = correctedLink.replace('height="300"','height="100"');
  correctedLink = correctedLink.replace(/height="[0-9]*"/, 'height="100"');
  if(correctedLink.contains(/youtube/)){
  }
  var card = $('<div class="playlistcard mdl-card mdl-color--grey-000 mdl-shadow--2dp mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet mdl-cell--3-col-desktop"></div>');
  card.append(correctedLink);
  if(name){
    card.append('<div class="mdl-card__title mdl-card--expand"></div><div class="mdl-card__actions"><span class="playlistname">'+ name +'</span></div>');
  }
  $("#grid").append(card);
}
