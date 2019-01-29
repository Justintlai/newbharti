$(document).ready(function () {


});

document.querySelector(".btn-close").onclick = function (e) {
  e.preventDefault();
  //hide table
  $("#post-table").DataTable().destroy();
  $("#post-table").addClass("hidden");
  //hide button
  $(".btn-close").addClass("hidden");
  $("#btn-posts").html("View Posts")
  //hide filters
  $("#filters").addClass("hidden");

};


document.getElementById("btn-posts").onclick = function (e) {
  e.preventDefault();
  console.log("Clicked");

  //show table
  $("#post-table").removeClass("hidden");
  $("#filters").removeClass("hidden");
  $(".btn-close").removeClass("hidden");

  $("#post-table").DataTable({
    dom: "<'top'Bfl>rtip",
    ajax: "/posts",
    initComplete: function () {
      $(".filters").empty();
      this.api().columns([0, 1, 2, 8, 9, 10]).every(function (i) {
        var column = this;

        var filterName = $('#post-table').DataTable().column(i).title();

        $(`<div class="filters__wrapper-${i}">
          <label>${filterName}</label>
        </div>`).appendTo(".filters");

        //create the select with event handler on change
        var select = $('<select class="sel sel__${i}"><option value=""></option></select>')
          .appendTo($(`.filters__wrapper-${i}`))
          .on('change', function () {
            var val = $.fn.dataTable.util.escapeRegex(
              $(this).val()
            );
            column
              .search(val, true, false)
              .draw();
          });
        //fill the data in the column
        column.data().unique().sort().each(function (d, j) {
          select.append(`<option class='filters__item' value=${d}>${d}</option>`)
        });
        //remove duplicate entries
        var map = {};
        $("select option").each(function () {
          if (map[this.value] && this.value !== "") {
            $(this).remove()
          }
          map[this.value] = true
        });
      })
    },
    destroy: true,
    autoWidth: true,
    fixedHeader: true,
    paging: true,
    search: {
      smart: false
    },
    responsive: true,
    searching: true,
    scrollX: true,
    scrollCollapse: true,
    buttons: [
      {
        text: 'Reset Filters',
        attr: {
          id: 'reset'
        },
        className: 'uk-button uk-button-secondary btn-reset',
        action: function (e, dt, node, config) {
          e.preventDefault();

          //get all the select dropdowns
          var filters = document.querySelectorAll(".sel");
          //iterate through each one and reset the value
          for (var i = 0; i < filters.length; i++) {
            console.log(filters.val());
            $(`.sel__${i}`).val('');
          }
          //set the back to nothing
          $("#post-table").DataTable().search("").columns().search('').draw();
        }
      }
    ],
    columns: [
      { data: "All Posts", defaultContent: "" },
      { data: "Vacancy Name", defaultContent: "" },
      { data: "Location Lookup", defaultContent: "" },
      { data: "Number of Posts", defaultContent: "" },
      { data: "Total Number Lookup", defaultContent: "" },
      { data: "Salary Range 1", defaultContent: "" },
      { data: "Salary Range 2", defaultContent: "" },
      { data: "Salary (extra info)", defaultContent: "" },
      { data: "Male or Female Lookup", defaultContent: "" },
      { data: "Upper Date Lookup", defaultContent: "" },
      { data: "Lower Date Lookup", defaultContent: "" },
      { data: "Department Lookup", defaultContent: "" },
      { data: "Notification Date Lookup", defaultContent: "" }
    ]
  });


  //change button name
  $("#btn-posts").html("Reload Data");
}