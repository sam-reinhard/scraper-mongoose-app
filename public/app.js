$(document).on("click", "#save-button", function(){
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#comment-title").val().trim(),
            body: $("#comment-body").val().trim() 
        }
    })
    .then(function(data){
        console.log(data);
        $("#comments").empty();
    });

    $("#comment-title").val("");
    $("#comment-body").val("");
});