window.onload = async () => {
  var img = document.querySelector("#imageCropped");
  var imgIntup = document.querySelector("#imageCroppedFinish");
  var apply = document.querySelector("#applyCrop");
  img.style.display = "none";
  imgIntup.style.display = "none";
  apply.style.display = "none";
  // Inicializo Croppie
  let image_crop_create = document.querySelector("#imageCropped");
  image_crop_create = new Croppie(image_crop_create, {
    url: `${base_url}/assets/images/default-crop.png`,
    enableExif: true,
    viewport: {
      width: 305,
      height: 309,
      type: "square",
    },
    boundary: {
      width: 400,
      height: 320,
    },
  });
  // Cuando se inserta una imagen, se guarda en un input:hidden
  $("#imageUpload").on("change", function () {
    img.style.display = "";
    imgIntup.style.display = "";
    apply.style.display = "";
    var reader = new FileReader();
    reader.onload = function (e) {
      image_crop_create
        .bind({
          url: e.target.result,
        })
        .then(function (blob) {
          $("#imageCroppedFinish").val(blob);
        });
    };
    reader.readAsDataURL(this.files[0]);
  });
  // Cuando clickea el boton aplicar, se guarda la imagen modificada en el input:hidden
  $("#applyCrop").on("click", function (ev) {
    image_crop_create
      .result({
        type: "canvas",
        size: "original",
        format: "jpeg",
      })
      .then(function (response) {
        $("#imageCroppedFinish").val(response);
      });
  });
};