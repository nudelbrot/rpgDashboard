class Track extends Serializable{
  constructor(){
    super();
    this.name = "";
    this.link = "";
    this.player = null;
    this.tags = [];
    this.key = null;
    this.button = null;
  }

  withName(name){
    this.name = name;
    return this;
  }

  withLink(link){
    this.link = link;
    return this;
  }

  withTags(tags){
    this.tags = tags;
    return this;
  }
  withPlayer(player){
    this.player = player;
    return this;
  }
  
  addTag(tag){
    this.tags.push(tag);
    return this;
  }

  removeTag(tag){
    for(var i in this.tags){
      if (tags[i] == tag){
        this.tags.splice(i,1);
      }
    }
    return this;
  }

  serialize(){
    var obj = {"name": this.name, "link": this.link, "tags": this.tags};
    return JSON.stringify(obj);
  }

  deserialize(str){
    var obj = JSON.parse(str);
    return this.withName(obj.name)
      .withLink(obj.link)
      .withTags(obj.tags);
  }
}
