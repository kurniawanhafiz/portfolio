  const achievementModal = document.getElementById("achievementModal");

  achievementModal.addEventListener("show.bs.modal", function (event) {
    const trigger = event.relatedTarget;

    document.getElementById("achievementModalTitle").textContent =
      trigger.getAttribute("data-title");

    const img = document.getElementById("achievementModalImage");
    img.src = trigger.getAttribute("data-image");
    img.alt = trigger.getAttribute("data-title");
  });
