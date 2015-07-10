sayings = new Mongo.Collection('sayings');
EasySecurity.config({ //Throttle all requests.
    general: {
        type: 'throttle',
        ms: 1000 * 5 //5s.
    }
});
Meteor.methods({
    likeIt: function(id) {
        sayings.update({
            _id: id
        }, {
            $inc: {
                likes: 1
            }
        });
    },
    addSaying: function(str) {
        if (str.replace(/ /gi, '').length <= 5) {
            throw new Meteor.Error(503, 'Your "saying" is too short. It must be longer than 5 characters, except spaces.');
        } //Delete all spaces and count the length.
        if (sayings.findOne({
                content: str
            })) {
            throw new Meteor.Error(503, 'Do not submit a existing one.');
        }
        sayings.insert({
            content: str,
            likes: 0
        });
    }
});
if (Meteor.isClient) {
    Template.list.sayings = function() {
        return sayings.find({}, {
            sort: {
                likes: -1
            }
        });
    };
    Template.saying.events({
        'click .likeit': function(e) {
            Meteor.call('likeIt', $(e.target).attr('id'), function(e, t) {
                if (e) {
                    alert(e.reason)
                }
            }); //Last param is a callback function to catch the error and alert. The data was collected by jQuery.
            $('.likeit').text('Wait...'); //Shows a friendly notification to users.
            Meteor.setTimeout(function() {
                $('.likeit').text('Like it!');
            }, 1000 * 5);
        }
    });
    Template.addsaying.events({
        'click .addone': function() {
            Meteor.call('addSaying', $('.addsaying').val(), function(e, t) {
                if (e) {
                    alert(e.reason)
                }
            });
            $('.addone').text('Wait...');
            Meteor.setTimeout(function() {
                $('.addone').text('Add new');
            }, 1000 * 5);
        }
    });
}
