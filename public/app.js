// Scrape On-click
$(document).on("click", "#scrape-button", function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(){
        location.reload();
    });
});

// Make Comment On-click
$(document).on("click", "#comment-button", function(){
    // open up the modal with the corresponding data-id
    var thisId = $(this).attr("data-id");
    console.log("make comment " + thisId );

    var thisModal = $("#comment-modal").attr("data-id", thisId).show();
});

// Close Comment Modal On-click
$(document).on("click", ".close", function(){
    $("#comment-modal").hide();
});


// Submit Comment On-click
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