class JSLoader {

  constructor(){
    this.queue = [];
  }

  enqueue(link, onLoaded){
    this.queue.push({"link": link, "data": null, "onLoaded": onLoaded});
    return this;
  }

  load(){
    var self = this;
    for(let index in this.queue){
      $.getScript(this.queue[index].link, function(){self.loaded(self.queue[index])});
    }
  }

  isLoadingComplete(){
    for(var element of this.queue){
      if(element.data == null){
        return false;
      }
    }
    return true;
  }

  callOnLoaded(){
    for(var element of this.queue){
      if(element.onLoaded){
        element.onLoaded(element.data);
      }
    }
  }

  loaded(element){
    if(this.isLoadingComplete()){
      this.callOnLoaded();
    }
  }

}

