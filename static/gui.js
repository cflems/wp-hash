$(function () {
  $('#inphash').click(function (e) {
    let $pass = $('#inppass');
    $pass.val(wp_hash_password($pass.val()));
  });
});
