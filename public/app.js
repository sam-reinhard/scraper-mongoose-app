// Scrape On-click
$(document).on("click", "#scrape-button", function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(){
        location.reload();
    });
});

// Make Comment On-click -- getting back the article object, not the comments
$(document).on("click", "#comment-button", function(){
    var thisId = $(this).attr("data-id");
    console.log("make comment " + thisId );

    $("#comment-modal").attr("data-id", thisId).show();

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(response){
        console.log(response);
    });
});

// Close Comment Modal On-click
$(document).on("click", ".close", function(){
    $("#comment-modal").hide();
});

// Submit Comment On-click -- comments are being saved, but not in the articles database
$(document).on("click", "#comment-submit", function(){
    var thisId = $(this).attr("data-id");
    console.log("Submit comment " + thisId);

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
        $("#comment-title").empty();
        $("#comment-body").empty();
    });

    $("#comment-modal").hide();
});

// Delete Comment On-click