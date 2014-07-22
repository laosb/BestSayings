sayings = new Meteor.Collection('sayings');
Meteor.users.deny({update: function () { return true; }}); //Deny all to keep safe.
Meteor.methods({
    likeIt:function(id){
        if(!Meteor.user()){throw new Meteor.Error(401,'Access Denied. Log in first.');}
        if(Meteor.user().voted>=5){throw new Meteor.Error(401,'Access Denied. You have voted 5 times. Every user can only vote 5 times.');}
        sayings.update({_id:id},{$inc:{likes:1}});
        Meteor.users.update({_id:Meteor.userId()},{$inc:{voted:1}},{upsert:true});
    },
    addSaying:function(str){
        if(str.replace(/ /gi,'').length<=5){
            throw new Meteor.Error(503,'Your "saying" is too short. It must be longer than 5 characters, except spaces.')
        } //Delete all spaces and count the length.
        sayings.insert({content:str,likes:0});
    }
});
if (Meteor.isClient) {
  Template.list.sayings = function (){
      return sayings.find({},{sort:{likes:-1}});
  };
  Template.saying.events({
    'click .likeit': function (e) {
      Meteor.call('likeIt',$(e.target).attr('id'),function(e,t){if(e){alert(e.reason)}});//Last param is a callback function to catch the error and alert. The data was collected by jQuery.
    }
  });
  Template.addsaying.events({
      'click .addone':function(){
          Meteor.call('addSaying',$('.addsaying').val(),function(e,t){if(e){alert(e.reason)}});
      }
  });
}
Accounts.onCreateUser(function(options, user) {
  user.profile = options.profile;
  user.voted = 0;
  return user;
}); 
