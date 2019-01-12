$(document).ready(function () {

  $("#posts").on("click", function (e) {
    e.preventDefault();
    console.log("Post clicked")
    $.ajax({
      url: "/posts",
      type: "GET",
      dataType: "json",
      success: function (result) {
        console.log(result);
        var data = "";
        $.each(result, function (i, item) {
          data += `
          <div>
          <h1>${item.fields.Posts}</h1>
            <p>${item.fields['Number of Posts']}</p>
          
          </div>
          `
        });
        $(".data").html(data);
      },
      error: function (data) {
        console.log("ERROR DATA: ", data);

      }
    });
  });


})