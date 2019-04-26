// Scrape On-click
$(document).on("click", "#scrape-button", function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(){
        location.reload();
    });
});

// Clear Articles On-click

// Make Comment On-click

// Submit Comment On-click

// Save Article On-click
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