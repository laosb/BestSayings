sayings = new Meteor.Collection('sayings');
Meteor.users.deny({update: function () { return true; }});
Meteor.methods({
    likeIt:function(id){
        if(!Meteor.user()){throw new Meteor.Error(401,'Access Denied. Log in first.');}
        if((Meteor.user().voted==1)||(Meteor.user().voted==undefined)){throw new Meteor.Error(401,'Access Denied. You have voted');}
        sayings.update({_id:id},{$inc:{likes:1}});
        Meteor.users.update({_id:Meteor.userId()},{$set:{voted:1}},{upsert:true});
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
      Meteor.call('likeIt',$(e.target).attr('id'),function(e,t){if(e){alert(e.reason)}});
    }
  });
  Template.addsaying.events({
      'click .addone':function(){
          Meteor.call('addSaying',$('.addsaying').val());
      }
  });
}
Accounts.onCreateUser(function(options, user) {
  user.profile = options.profile;
  user.voted = 0;
  return user;
}); 
