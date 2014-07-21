sayings = new Meteor.Collection('sayings');
Meteor.methods({
    likeIt:function(id){
        sayings.update({_id:id},{$inc:{likes:1}});
    },
    addSaying:function(str){
        sayings.insert({content:str,likes:0});
    }
});
if (Meteor.isClient) {
  Template.list.sayings = function (){
      return sayings.find({},{sort:{likes:-1}});
  };
  Template.saying.events({
    'click .likeit': function (e) {
      Meteor.call('likeIt',$(e.target).attr('id'));
    }
  });
  Template.addsaying.events({
      'click .addone':function(){
          Meteor.call('addSaying',$('.addsaying').val());
      }
  });
}
