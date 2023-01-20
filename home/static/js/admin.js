// TEMPLATE STRINGS
const sectionTemplate = (section, location) => {
  let { title, body, button, href, imgUrl, id, position, show } = section;
  let template = `<div data-id='${id}' class="card card-zendesk card-${location}" >
      <img src="${imgUrl}" 
          data-img='${imgUrl}'
          class="card-img-top"
          style='object-fit:cover;'
          alt="Sorry! Image not available at this time" 
          onError="this.onerror=null;this.src='${base_url}assets/images/default.svg';">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">
          ${body}
        </p>
        <a
          href="${href}"
          class="btn btn-zendesk-card"
          >
          ${button === "" ? "See" : button}</a>
          </a>
          <input type="hidden" id="hidden_show" class="hidden_show" value=${show}>
          <input type="hidden" id="hidden_position" class="hidden_position" value=${position}>
        <div class='card-zendesk-editpanel mt-3'>
          <button  class='btn btn-info btn-edit' data-section='${location}' data-toggle="modal" data-target="#modalEdit">Edit</button>
          <button  class='btn btn-danger btn-delete' data-section='${location}' data-toggle="modal" data-target="#modalDelete">Delete</button>
        </div>
      </div>
    </div>`;

  return template;
};

const notificationTemplate = (msg, color) => {
  let notificationContainer = document.querySelector(".notification-container");

  notificationContainer.innerHTML = `
  <div class="toast ${color}" role="alert"  aria-live="assertive" aria-atomic="true">
  <div class="toast-body">
    ${msg}
  </div>
</div>
  `;
};
// FETCH
const fetchSections = async () => {
  return await fetch(`${base_url}admin/get_sections`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((sections) => {
      if (sections.status == 200) {
        return sections.data;
      } else {
        return [];
      }
    });
};

const fetchHighlights = async () => {
  return await fetch(`${base_url}admin/get_highlights`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((highlights) => {
      if (highlights.status == 200) {
        return highlights.data;
      } else {
        return [];
      }
    });
};

// --------- CRUD -------------
// CREATE
const createDoc = () => {
  let createButtons = document.querySelectorAll(".btn-createDoc");
  let createForm = document.querySelector("#createForm");

  createButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      createForm.action = `${base_url}admin/${button.dataset.section}/create`;
    });
  });
};

const createForm = async () => {
  let createForm = document.querySelector("#createForm");

  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let formData = await new FormData(createForm);
    let imageUrl = await formData.get("image");
    await formData.delete("imageUpload");

    await dataUrlToFile(imageUrl, "imageCropped.png").then((image) => {
      formData.set("image", image);
    });
    try {
      await fetch(createForm.action, {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          //getSections();
          //getHighlights();
          closeOneModal("closeModalCreate");
          cleanModal("modalCreate");
          displayNotification(result.status, result.message);
        });
    } catch (e) {
      closeOneModal("closeModalCreate");
      displayNotification(
        404,
        "oops, an error occurred please try again later"
      );
    }
  });
};

// READ
const getHighlights = async () => {
  let highlightsList = document.querySelector("#grid-highlights");
  let highlightCounts = document.querySelector("#highlightsCount");

  highlightsList.innerHTML = "";
  fetchHighlights()
    .then(async (highlights) => {
      highlightsList.innerHTML = "";
      await highlights.map(
        (highlight) =>
          (highlightsList.innerHTML += sectionTemplate(highlight, "highlight"))
      );
      await editDoc();
      await deleteDoc();
      await createDoc();
      highlightCounts.innerHTML = highlights.length;
    })
    .catch((err) => {
      highlightsList.innerHTML = "Error al traer los highlights";
    });
};
const getSections = async () => {
  let gridCards = document.querySelector("#grid-cards");
  let sectionCounts = document.querySelector("#sectionsCount");

  gridCards.innerHTML = "";
  fetchSections()
    .then(async (sections) => {
      await sections.map(
        (section) =>
          (gridCards.innerHTML += sectionTemplate(section, "section"))
      );
      await editDoc();
      await deleteDoc();
      await createDoc();
      sectionCounts.innerHTML = sections.length;
    })
    .catch((err) => {
      gridCards.innerHTML = `Error al traer las secciones`;
    });
};

// UPDATE
const editDoc = () => {
  let editButtons = document.querySelectorAll(".btn-edit");
  let editModal = document.querySelector("#modalEdit");
  let modalForm = editModal.querySelector("form");
  let titleInput = modalForm.elements.title;
  let bodyInput = modalForm.elements.body;
  let buttonInput = modalForm.elements.button;
  let hrefInput = modalForm.elements.href;
  let idInput = modalForm.elements.id;
  let positionInput = modalForm.elements.position;
  let showCheckbox = modalForm.elements.show;
  //let imgFileInput = modalForm.elements.imageUpload;

  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let docBody = e.target.parentNode.parentNode;
      let id = docBody.parentNode.dataset.id;
      let title = docBody.querySelector(".card-title").textContent.trim();
      let text = docBody.querySelector(".card-text").textContent.trim();
      let buttonText = docBody
        .querySelector(".btn-zendesk-card")
        .textContent.trim();
      let buttonHref = docBody.querySelector(".btn-zendesk-card").href.trim();
      let position = docBody.querySelector(".hidden_position").value;
      let show = docBody.querySelector(".hidden_show").value;
      //let imgUrl = docBody.parentNode
      //  .querySelector(".card-img-top")
      //  .dataset.img.trim();
      modalForm.action = `${base_url}admin/${button.dataset.section}/edit/${id}`;
      positionInput.value = position;
      idInput.value = id;
      titleInput.value = title;
      bodyInput.value = text;
      buttonInput.value = buttonText;
      hrefInput.value = buttonHref;
      //imgFileInput.file = imgUrl;
      showCheckbox.checked = show == "Y" ? true : false;
    });
  });
};
const editForm = async () => {
  let editForm = document.querySelector("#editForm");

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = await new FormData(editForm);
    let imageUrl = await formData.get("image");
    await formData.delete("imageUploadUpdate");
    if(imageUrl){
      await dataUrlToFile(imageUrl, "imageCropped.png").then((image) => {
        formData.set("image", image);
      });
    }else{
      await formData.delete("image");
    }
    try{
      fetch(editForm.action, {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          //getSections();
          //getHighlights();
          closeOneModal("closeModalEdit");
          cleanModal("modalEdit");
          displayNotification(result.status, result.message);
        });
    } catch (e) {
    }
  });
};

// DELETE
const deleteDoc = () => {
  let deleteButtons = document.querySelectorAll(".btn-delete");
  let deleteForm = document.querySelector("#deleteForm");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let docBody = e.target.parentNode.parentNode;
      let id = docBody.parentNode.dataset.id;
      deleteForm.action = `${base_url}admin/${button.dataset.section}/delete/${id}`;
    });
  });
};
const deleteForm = async () => {
  let deletForm = document.querySelector("#deleteForm");

  deletForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    fetch(deletForm.action, {
      method: "post",
    })
      .then((res) => res.json())
      .then((result) => {
        //getSections();
        //getHighlights();
        closeOneModal("closeModalDelete");
        displayNotification(result.status, result.message);
      });
  });
};

// DOM FUNCTIONALITIES
const sidenavItemsClick = () => {
  let sidenavItems = document.querySelectorAll(".sidenav-item");
  let sections = document.querySelectorAll(".section");
  sidenavItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      sidenavItems.forEach((item) => {
        item.classList.remove("active");
      });
      let section = document.querySelector(`#${item.dataset.section}`);
      sections.forEach((section) => section.classList.add("d-none"));
      section.classList.remove("d-none");
      e.target.classList.add("active");
    });
  });
};

function closeOneModal(modalId) {
  const modalBtnClose = document.querySelector(`#${modalId}`);
  let crop = document.querySelector('.cr-image')
  crop.src = ''
  modalBtnClose.click();
}

function cleanModal(modalId) {
  let modal = document.querySelector(`#${modalId}`);

  let inputs = modal.querySelectorAll("input");
  let textareas = modal.querySelectorAll("textarea");

  inputs.forEach((input) => (input.value = ""));
  textareas.forEach((textarea) => (textarea.value = ""));
  switch (modalId) {
    case "modalCreate":
        var img = document.querySelector("#imageCropped");
        var imgIntup = document.querySelector("#imageCroppedFinish");
        var apply = document.querySelector("#applyCrop");
        break;
    case "modalEdit":
        var img = document.querySelector("#imageCroppedUpdate");
        var imgIntup = document.querySelector("#imageCroppedFinishUpdate");
        var apply = document.querySelector("#applyCropUpdate");
        break;
    default:
        var img = document.querySelector("#imageCropped");
        var imgIntup = document.querySelector("#imageCroppedFinish");
        var apply = document.querySelector("#applyCrop");
      break;
  }
  img.style.display = "none";
  imgIntup.style.display = "none";
  apply.style.display = "none";
}

function displayNotification(status, message) {
  let color;
  switch (status) {
    case 500:
      color = "notification-red";
      break;
    case 200:
      color = "notification-green";
      break;
    default:
      color = "notification-yellow";
      break;
  }
  notificationTemplate(`${message}`, color);
}

function initializeCropForUpdate() {
  var img = document.querySelector("#imageCroppedUpdate");
  var imgIntup = document.querySelector("#imageCroppedFinishUpdate");
  var apply = document.querySelector("#applyCropUpdate");
  img.style.display = "none";
  imgIntup.style.display = "none";
  apply.style.display = "none";
  // Inicializo Croppie
  let image_crop_update = document.querySelector("#imageCroppedUpdate");
  image_crop_update = new Croppie(image_crop_update, {
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
  // Cuando se inserta una imagen o se modifica tamaño, posicion, se guarda en un input:hidden
  $("#imageUploadUpdate").on("change", function () {
    img.style.display = "";
    imgIntup.style.display = "";
    apply.style.display = "";
    var reader = new FileReader();
    reader.onload = function (e) {
      image_crop_update
        .bind({
          url: e.target.result,
        })
        .then(function (blob) {
          image_crop_update
          .result({
            type: "canvas",
            size: "original",
            format: "jpeg",
          })
          .then(function (response) {
            $("#imageCroppedFinishUpdate").val(response);
          });
        });
    };
    reader.readAsDataURL(this.files[0]);
  });

  // Cuando clickea el boton aplicar, se guarda la imagen modificada en el input:hidden
  $("#applyCropUpdate").on("click", function (ev) {
    image_crop_update
      .result({
        type: "canvas",
        size: "original",
        format: "jpeg",
      })
      .then(function (response) {
        $("#imageCroppedFinishUpdate").val(response);
      });
  });
}
function initializeCropForCreate() {
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
}

const dataUrlToFile = async (dataUrl, fileName) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
};

window.onload = async () => {
  await initializeCropForUpdate();
  await initializeCropForCreate();
};

$(".modal").on("hidden.bs.modal", function(){
  cleanModal(this.id);
});