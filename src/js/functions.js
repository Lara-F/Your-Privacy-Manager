$(document).ready(
    function () {
        $("#privateProfileOption").click(function () {
            $("#storyFollFoll").show()            
            $("#storyFollFollLabel").show()
            $("#storyFollYFoll").show()
            $("#storyFollYFollLabel").show()
            $("#commentSection").hide()
            $("#storyYFoll").hide()
            $("#storyYFoll").removeAttr('checked')
            $("#storyYFollLabel").hide()
            $("#storyYFollLabel").removeAttr('checked')
            $("#storyFoll").hide()
            $("#storyFoll").removeAttr('checked')
            $("#storyFollLabel").hide()
            $("#commPf").removeAttr('checked')
            $("#commPff").removeAttr('checked')
            $("#commEv").removeAttr('checked')
            $("#commFol").attr('checked', true)

        });
        $("#publicProfileOption").click(function () {
            $("#storyFollFoll").hide()             
            $("#storyFollFoll").removeAttr('checked')
            $("#storyFollFollLabel").hide() 
            $("#storyFollYFoll").hide()             
            $("#storyFollYFoll").removeAttr('checked')
            $("#storyFollYFollLabel").hide()
            $("#storyYFoll").show()
            $("#storyYFollLabel").show()
            $("#storyFoll").show()
            $("#storyFollLabel").show()
            $("#commentSection").show()
            $("#commPf").removeAttr('checked')
            $("#commPff").removeAttr('checked')
            $("#commEv").removeAttr('checked')
            $("#commFol").removeAttr('checked')
        });
    }
);