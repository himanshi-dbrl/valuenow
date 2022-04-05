$(".toggle-password").click(function () {

  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});

// Sidebar Navigation

$(".menu__extra--button").click(function () {
  $(".sidebar__nav").addClass("sidebar__nav--active");
  $('body').css({
    'position': 'relative'
  });
  $('.body-shadow').css({
    'z-index': '5',
    'background': 'rgba(0, 0, 0, .5)'
  });
});
$(".sidebar__close, .body-shadow").click(function () {
  $(".sidebar__nav").removeClass("sidebar__nav--active");
  $('.body-shadow').css({
    'z-index': '-1',
    'background': 'rgba(0, 0, 0, 0.0)'
  });
});



// slick Slider
$('.StoriesSlider').slick({
  dots: false,
  prevArrow: $('.prev'),
  nextArrow: $('.next'),
  infinite: false,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});


// Single slick slider
$('.businessSlider').slick({
  dots: true,
  customPaging: function (slider, i) {
    // this example would render "tabs" with titles
    return '<span class="dot"></span>';
  },
  infinite: true,
  prevArrow: $('.prevSlider'),
  nextArrow: $('.nextSlider'),
  speed: 500,
  fade: true,
  cssEase: 'linear'
});
// Active Links

$('#sidebar_main_menu  a').filter(function () {
  return this.href == location.href
}).addClass('active').siblings().removeClass('active');

$('#sidebar_main_menu ul a').click(function () {
  $(this).addClass('active').siblings().removeClass('active')
});


$(document).ready(function () {
  $('input[type="file"]').change(function (e) {
    var fileName = e.target.files[0].name;
    $('.file_name').html(fileName);
  });
});


function readURL(input, input2) {
  var id = input2;
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#' + id)
        .attr('src', e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  } else {

  }
}


// Datepicker
$('.datepicker_input').datepicker({
  autoclose: true,
  format: 'dd-mm-yyyy',
  todayHighlight: true
});

//Chosen
$('.choseSmall').select2({
  selectOnClose: true,
  minimumResultsForSearch: -1
});
$('.choseLarge').select2({
  selectOnClose: true,
});


$('.mob_chat li').click(function () {
  $('.message').css({ 'left': '0' });
});
$('.bg_back').click(function () {
  $('.message').css({ 'left': '100%' });
});


// Dropdown
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  document.getElementById("navDoopdown").classList.toggle("show");
}
function myFunctionDrow() {
  document.getElementById("myDropdown2").classList.toggle("show");
}
function myFunctionLanguage() {
  document.getElementById("myDropdownLanguage").classList.toggle("show");
}
function myFunctionFilter() {
  document.getElementById("myDropdownFilter").classList.toggle("show");
}
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}






// Chat


function add() {
  var xx = document.querySelector("#messageArea").value;
  //alert(xx);
  document.getElementById("chat_s").innerHTML +=
    '<div><div class="coming_msg"><p>' +

    document.querySelector("#messageArea").value +
    '</p>' + '<span class="msg_time">' + '2 min ago' + '</span>' +

    "</div></div>";
  document.querySelector("#messageArea").value = "";

  document.getElementById("chat_s").scrollTop = document.getElementById(
    "chat_s"
  ).scrollHeight;
}
