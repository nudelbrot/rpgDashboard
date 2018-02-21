class UIController {
  constructor(){
    
  }
  setupClickEvents(){
    self = this;
    $("#loadJSON").on("click", function(){window.system.player.load()});
    $("#saveJSON").on("click", function(){window.system.player.save()});
    $("#fightButton").on("click", function(){window.system.player.fight();});
    $("#openSettings").on("click", function(){self.openSettingsDialog();});
    $("#addPlaylist").on("click", self.openPlaylistDialog);
  }
  openSettingsDialog(){
    var input = '<div>'
      +'<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="shuffleSwitch"> <input type="checkbox" id="shuffleSwitch" class="mdl-switch__input" ' + (window.system.player.getConfig().shuffle? "checked" : "")+'> <span class="mdl-switch__label">Shuffle</span></label>'
      +'<div class="mdl-textfield mdl-js-textfield"><input id="fightPlaylist" class="mdl-textfield__input" type="text" value="'+window.system.player.getConfig().fightPlaylist+'"> <label class="mdl-textfield__label" for="fightPlaylist">link to fight playlist</label></div>'
      +'</div>';
    showDialog({
      title: 'Settings', text: input, negative: { title: 'Cancel' },
      positive: {
        title: 'Save',
        onClick: function() {
          var config = {
            'shuffle': $('#shuffleSwitch').prop("checked"),
            'fightPlaylist': $('#fightPlaylist').val()
          };
          window.system.player.setConfig(config);
          window.system.saveToLocalStorage();
        }
      },
      cancelable: false,
    });
  }
  
  openPlaylistDialog(){
    var input = '<div>'
      +'<div class="mdl-textfield mdl-js-textfield"><input id="name" class="mdl-textfield__input" type="text"> <label class="mdl-textfield__label" for="name">Name</label></div>'
      +'<div class="mdl-textfield mdl-js-textfield"><input id="link" class="mdl-textfield__input" type="text"> <label class="mdl-textfield__label" for="link">http://...</label></div>'
      +'</div>';
    showDialog({
      title: 'add Playlist', text: input, negative: { title: 'Cancel' },
      positive: {
        title: 'add',
        onClick: function() {
          var link = $("#link").val().trim();
          var name = $("#name").val().trim();
          window.system.addPlaylist(link, name);
          window.system.saveToLocalStorage();
        }
      },
      cancelable: false,
    });
  }
}

class System extends Serializable{
  constructor(){
    super();
    this.player = null;
    this.uicontroller = new UIController();
  }

  setup(){
    this.player = new Player();
    this.loadFromLocalStorage();
    this.player.init();
    this.uicontroller.setupClickEvents();
  }

  

  loadFromLocalStorage(){
    if(!localStorage["backup"]){
      localStorage["backup"] = '{"tracks":{}, "config":{"shuffle": true, "fightPlaylist": "https://soundcloud.com/ge3zify/sets/battle"}}';
    }
    this.deserialize(localStorage["backup"]);
  }
  
  saveToLocalStorage(){
    localStorage["backup"] = this.serialize();
  }

  serialize(){
    var config = this.player.config;
    var tracks={};
    Object.keys(this.player.data).forEach(function(a){
      if(a>0){
        tracks[this.player.data[a].name] = this.player.data[a].link;
      }
    }.bind(this));
    return JSON.stringify({"config": config, "tracks": tracks});
  }

  deserialize(str){
    var data = JSON.parse(str);
    this.player.config = data.config;
    Object.keys(data.tracks).forEach(function(a){
      this.addPlaylist(data.tracks[a], a);
    }.bind(this));
  }
  
  removePlaylist(key, card){
    delete this.player.data[key];
    $(card).remove();
    this.saveToLocalStorage();
  }

  addPlaylist(link, name, color){
    var player = window.system.player;
    var track = new Track()
      .withName(name)
      .withLink(link)
      .withPlayer(player.getSCPlayer());
    var key = player.register(track);
    var correctedLink = link;
    if(link.search(/youtube/) > 0){
      console.debug("youtube");
    }else if(link.search(/soundcloud/) > 0){
      console.debug("soundcloud");
    }

    var card = $('<div class="mdl-card mdl-color--grey-000 mdl-shadow--2dp mdl-cell mdl-cell--2-col mdl-cell--3-col-tablet mdl-cell--3-col-desktop"></div>');
    card.append('<div class="mdl-card__title mdl-card--expand">'
      +'<h4>'+ name +'</h4>'
      +'</div>'
      +'<div class="mdl-card__actions mdl-card--border"><div class="playbutton mdl-button mdl-button--icon mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">play_arrow</i></div><div class="nextbutton mdl-button mdl-button--icon mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">skip_next</i></div></div>'
      +'</div>');
    card.find(".playbutton").on("click", function(){
      player.play(key);
    });
    card.find(".nextbutton").on("click", function(){
      player.next();
    });
    var settingsButton = $('<button id="settingsButton'+name+'" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"><i class="material-icons">more_vert</i></button>').css({"position": "absolute", "top": "8px", "right": "8px"});
    var settingsMenu = $('<ul class="mdl-menu mdl-js-menu mdl-menu--bottom-right" for="settingsButton'+name+'"></ul>');
    var editButton = $('<li class="mdl-menu__item" tabindex="-1">Edit</li>');
    var deleteButton = $('<li class="mdl-menu__item" tabindex="-1"><a>Delete</a></li>').on("click", function(){this.removePlaylist(key, card);}.bind(this));
    settingsMenu.append(editButton).append(deleteButton);
    var tags = $('<div class="taglist mdl-cell--hide-phone"></div>');
    for(var tag of track.tags){
      tags.append('<button class="mdl-chip"> <span class="mdl-chip__text">'+tag+'</span></button>');
    }
    card.find("h4").after(settingsButton);
    card.find("h4").after(settingsMenu);
    card.find("h4").after(tags);
    player.data[key].object = card.find("iframe");
    player.data[key].button = card.find(".playbutton");
    player.data[key].card = card;
    $("#grid").append(card);
  }
}

$(function(){
  system = new System();
  system.setup();
  //$.getJSON("init.json", function(data){
  //  Object.keys(data).forEach(function(a){
  //    addPlaylist(data[a], a);
  //  });
  //});

});
