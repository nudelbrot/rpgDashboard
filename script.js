class Player{
  constructor(){
    this.data = {};
    this.shuffle = true;
    this.fightPlaylist = '<iframe width="100%" height="300" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/75404410&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>';
    this.active = undefined;
    this.fightID = undefined;
    this.previous = undefined;
  }
  init(){
    this.scplayer = new SCPlayer();
    this.fightID = this.register(this.fightPlaylist, "fight", this.scplayer);
    var obj = $("<div></div>");
    obj.append(this.fightPlaylist);
    $("body").append(obj);
    obj.hide();
    this.data[this.fightID].object = obj.find("iframe");
    this.data[this.fightID].button = $("#fightButton");
  }
  register(data, name, player){
    var key = Object.keys(this.data).length;
    this.data[key] = {"key": key, "data": data, "name": name, "object": undefined, "player": player, "button": undefined};
    return key;
  }

  getData(index){
    return player.data[index];
  }

  setSettings(settings){
    console.debug(settings);
  }

  play(id){
    if(id != undefined && this.data[id]){
      if(this.active == this.fightID){
        this.pause(this.fightID);
        this.pause(this.previous);
        return;
      }
      if(this.active == id){
        this.pause(id);
      }else{
        this.data[id].button.addClass("mdl-button--accent");
        this.pause(this.active);
        this.active = id;
        this.data[id].player.play(id);
      }
    }
  }

  pause(id, reset=true){
    if(id != undefined && this.data[id]){
      this.data[id].button.removeClass("mdl-button--accent");
      if(id != this.fightID){
        this.previous = this.active;
      }
      if(this.active == id){
        this.active = undefined;
      }
      this.data[id].player.pause(id, reset);
    }
  }

  fight(){
    if(this.fightID != this.active){
      this.pause(this.active, false);
      this.play(this.fightID);
      this.data[this.fightID].button.addClass("mdl-button--colored");
    }else{
      this.pause(this.fightID);
      this.play(this.previous);
      this.data[this.fightID].button.removeClass("mdl-button--colored");
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
  pause(id, reset){
    var card = super.getData(id).object[0];
    var widget = SC.Widget(card);
    if(reset){
      widget.seekTo(0);
    }
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

  $("#loadJSON").on("click", function(){player.load()});
  $("#saveJSON").on("click", function(){player.save()});
  $("#fightButton").on("click", function(){player.fight();});
  $("#openSettings").on("click", function(){openSettingsDialog();});
  $("#addPlaylist").on("click", openPlaylistDialog);

    $.getJSON("init.json", function(data){
      Object.keys(data).forEach(function(a){
        addPlaylist(data[a], a);
      });
    });

});

function openSettingsDialog(){
  var input = '<div>'
    +'<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="shuffleSwitch"> <input type="checkbox" id="shuffleSwitch" class="mdl-switch__input" checked> <span class="mdl-switch__label">Shuffle</span></label>'
    +'<div class="mdl-textfield mdl-js-textfield"><input id="fightPlaylist" class="mdl-textfield__input" type="text"> <label class="mdl-textfield__label" for="fightPlaylist">link to fight playlist</label></div>'
    +'</div>';
  showDialog({
    title: 'Settings',
    text: input,
    negative: {
      title: 'Cancel'
    },
    positive: {
      title: 'Save',
      onClick: function() {
        var settings = {'shuffle': $('#shuffleSwitch').prop("checked")};
        player.setSettings(settings);
      }
    },
    cancelable: false,
  });
}

function openPlaylistDialog(){
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
}


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
    player.play(key);
  });
  player.data[key].object = card.find("iframe");
  player.data[key].button = card.find(".playbutton");
  $("#grid").append(card);
}
