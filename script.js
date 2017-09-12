class Player{
  constructor(){
    this.data = {};
    this.active = undefined;
  }
  init(){
        this.scplayer = new SCPlayer();
  }
  register(data, name, player){
    var key = Object.keys(this.data).length;
    this.data[key] = {"key": key, "data": data, "name": name, "object": undefined, "player": player};
    return key;
  }

  getData(index){
    return player.data[index];
  }

  play(id){
    if(this.data[id]){
      this.active = id;
      this.data[id].player.play(id);
    }

  }
  pause(id){
    if(this.data[id]){
      this.data[id].player.pause(id);
    }
  }

  toggle(id){
    if(this.data[id]){
      this.data[id].player.toggle(id);
    }
  }

  save(){
    var tmp={};
    Object.keys(this.data).forEach(function(a){
      tmp[player.data[a].name] = player.data[a].data;
    });
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(tmp)], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = "playlists.json";
    a.click();
  }
  
  load(){
    var finput;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      finput = $('<input type="file" name="files" title="Load JSON" />');
      finput.on("change", function (a, b) {
        var f, reader;
        f = a.target.files[0];
        if (f.type.match('application/json') || true) {
          reader = new FileReader();
          reader.onload = function (file) {
            var json, parsed;
            json = file.target.result;
            try {
              parsed = JSON.parse(json);
              Object.keys(parsed).forEach(function(a){
                addPlaylist(parsed[a], a);
              });
            } catch (error) {
              alert("parsing error: " + error);
            }
          };
          return reader.readAsText(f);
        } else {
          alert("a JSON file is required");
        }
      });
      return finput.click();
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  }
}

class SCPlayer extends Player{
  constructor(){
    super();
  }

  play(id){
    var card = super.getData(id).object[0];
    var widget = SC.Widget(card);
    widget.play();
  }
  pause(id){
    var card = super.getData(id).object[0];
    var widget = SC.Widget(card);
    widget.seekTo(0);
    widget.pause();
  }

  toggle(id){
    var card = super.getData(id).object[0];
    var widget = SC.Widget(card);
    if((player.active != undefined) && player.active != id){
      widget.seekTo(0);
    }
    player.active = id;
    widget.toggle();
  }
}


$(function(){
  player = new Player();
  player.init();
  $("#addPlaylist").on("click", function(){
    var input = '<div>'
      +'<div class="mdl-textfield mdl-js-textfield"><input id="link" class="mdl-textfield__input" type="text"> <label class="mdl-textfield__label" for="link">Content</label></div>'
      +'<div class="mdl-textfield mdl-js-textfield"><input id="name" class="mdl-textfield__input" type="text"> <label class="mdl-textfield__label" for="name">Name</label></div>'
    +'</div>';
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
          var name = $("#name").val();
          addPlaylist(link, name);
        }
      },
      cancelable: false,
    });
  });

$.getJSON("init.json", function(data){
  Object.keys(data).forEach(function(a){
    addPlaylist(data[a], a);
  });
});

});


function addPlaylist(link, name, color){
  var key = player.register(link, name, player.scplayer);
  var correctedLink = link;
  correctedLink = correctedLink.replace("show_comments=true","show_comments=false");
  correctedLink = correctedLink.replace("hide_related=false","hide_related=true");
  correctedLink = correctedLink.replace("show_user=true","show_user=false");
  correctedLink = correctedLink.replace("visual=true","visual=false");
  correctedLink = correctedLink.replace(/height="[0-9]*"/, 'height="0"');
  if(link.search(/youtube/) > 0){
    console.debug("youtube");
  }else if(link.search(/soundcloud/) > 0){
    console.debug("soundcloud");
  }

  var card = $('<div class="mdl-card mdl-color--grey-000 mdl-shadow--2dp mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet mdl-cell--2-col-desktop"></div>');
  card.append(correctedLink);
  card.append('<div class="mdl-card__title mdl-card--expand">'
    +'<h4>'+ name +'</h4>'
    +'</div>'
    +'<div class="playbutton mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">play_arrow</i></div>'
    +'</div>');
  card.find(".playbutton").on("click", function(){
    if(player.active == undefined){
      player.play(key);
      $(this).addClass("mdl-button--accent");
    }else{
      player.pause(player.active);
      $(".playbutton").removeClass("mdl-button--accent");
      if(player.active != key){
        player.play(key);
        $(this).addClass("mdl-button--accent");
      }else{
        player.active = undefined;
      }
    }
  });
  player.data[key].object = card.find("iframe");
  $("#grid").append(card);
}
