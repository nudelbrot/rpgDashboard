class Player{
  constructor(){
    this.data = {};
    this.active = undefined;
    this.fightID = undefined;
    this.previous = undefined;
    this.config = null;
    this.scplayer = null;
  }
  init(){
    this.fightID = this.register(
      new Track()
      .withLink(this.config.fightPlaylist)
      .withName("fight")
      .withPlayer(this.getSCPlayer()));
    this.data[this.fightID].button = $("#fightButton");
  }
  register(track){
    var key = Object.keys(this.data).length;
    this.data[key] = track;//{"key": key, "link": link, "name": name, "object": undefined, "player": player, "button": undefined};
    return key;
  }

  getSCPlayer(){
    if(!this.scplayer){
      this.scplayer = new SCPlayer();
    }
    return this.scplayer;
  }

  getData(index){
    return window.system.player.data[index];
  }

  getConfig(){
    return window.system.player.config;
  }

  setConfig(config){
    this.config = config;
    this.data[0].link = config.fightPlaylist;
  }

  isLegitId(id){
    return id != undefined && this.data[id];
  }

  isFightPlaying(){
    return this.active == this.fightID;
  }

  playIdAndSetActive(id){
    if(this.active == id){
      //pause current
      this.pause(id, false);
      //this.previous = undefined;
    }else{
      //play id and pause old one
      var old = this.active;
      this.pause(old);
      this.active = id;
      console.debug(this.data);
      this.data[id].button.addClass("mdl-button--accent");
      this.data[id].player.play(id);
    }
  }

  play(id){
    if(this.isLegitId(id)){
      if(this.isFightPlaying()){
        this.stop(this.fightID);
        this.stop(this.previous);
      }else{
        this.playIdAndSetActive(id);
      }
    }
  }

  stop(id){
    this.pause(id, true);
  }

  pause(id, reset=true){
    if(this.isLegitId(id)){
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

  next(){
    console.debug("neext");
    this.data[this.active].player.next();
  }

  //TODO FIX THE FOLLOWING
  fight(){
    if(this.isFightPlaying()){
      this.pause(this.fightID, true);
      //this.data[this.fightID].button.removeClass("mdl-button--accent");
      if(this.previous){
        this.play(this.previous);
      }
    }else{
      this.pause(this.active, false);
      this.play(this.fightID);
      this.data[this.fightID].button.addClass("mdl-button--accent");
    }
  }
}

class SCPlayer extends Player{
  constructor(){
    super();
    this.div = $("<div></div>", {"css": {"height": "0px", "width": '0px'}});
    this.iframe = $('<iframe height="100" width="10" id="scplayer" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists"></iframe>');
    this.iframe.hide();
    this.div.append(this.iframe);
    this.widget = SC.Widget(this.iframe[0]);
    $("body").append(this.div);
  }

  play(id){
    var link = this.getData(id).link;
    var shuffle = this.getConfig().shuffle;
    var widget = this.widget;
    this.widget.load(link, {"callback": function(a){
    if(shuffle){
      widget.getSounds(function(sounds){
        var skip = Math.floor(Math.random() * sounds.length);
        widget.skip(skip);
        widget.play();
      });
    }else{
      widget.play();
    }}});
    
  }

  pause(id, reset){
    if(reset){
      this.widget.seekTo(0);
    }
    this.widget.pause();
  }

  next(){
    var widget = this.widget;
    if(super.getConfig().shuffle){
      widget.getSounds(function(sounds){
        var skip = Math.floor(Math.random() * sounds.length);
        widget.skip(skip);
        widget.play();
      });
    }else{
      this.widget.next();
    }
  }
}
