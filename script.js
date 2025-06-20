let applicants = JSON.parse(localStorage.getItem("applicants")) || [];
let editingId = null;

const container = document.querySelector(".applicant-container");
const modal = document.getElementById("applicant-modal");
const form = document.getElementById("applicant-form");
const addBtn = document.getElementById("add-applicant-btn");
const cancelBtn = document.getElementById("cancel-btn");
const exportPdfBtn = document.getElementById("export-pdf");

addBtn.onclick = () => openModal();
cancelBtn.onclick = () => closeModal();
form.onsubmit = saveApplicant;

document.addEventListener("DOMContentLoaded", () => {
  renderApplicants();
});

if (exportPdfBtn) {
  exportPdfBtn.onclick = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Interview Applicants", 10, 10);
    let y = 20;

    applicants.forEach((a, i) => {
      doc.setFontSize(12);
      doc.text(`${i + 1}. Name: ${a.name}`, 10, y);
      y += 6;
      doc.text(`   Position: ${a.position}`, 10, y);
      y += 6;
      doc.text(`   Stage: ${a.stage}`, 10, y);
      y += 6;
      doc.text(`   Date: ${a.date}`, 10, y);
      y += 6;
      doc.text(`   Notes: ${a.notes}`, 10, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("interview_applicants.pdf");
  };
}

function openModal(data = {}) {
  modal.classList.add("active");
  form.reset();
  editingId = data.id || null;
  document.getElementById("modal-title").textContent = editingId ? "Edit Applicant" : "Add New Applicant";
  if (editingId) {
    form.name.value = data.name;
    form.position.value = data.position;
    form.stage.value = data.stage;
    form.date.value = data.date;
    form.notes.value = data.notes;
    document.getElementById("applicant-id").value = data.id;
  }
}

function closeModal() {
  modal.classList.remove("active");
  editingId = null;
}

function saveApplicant(e) {
  e.preventDefault();
  const applicant = {
    id: editingId || Date.now(),
    name: form.name.value,
    position: form.position.value,
    stage: form.stage.value,
    date: form.date.value,
    notes: form.notes.value,
  };

  if (editingId) {
    const index = applicants.findIndex((a) => a.id === editingId);
    applicants[index] = applicant;
  } else {
    applicants.push(applicant);
  }
  localStorage.setItem("applicants", JSON.stringify(applicants));
  closeModal();
  renderApplicants();
}

function deleteApplicant(id) {
  applicants = applicants.filter((a) => a.id !== id);
  localStorage.setItem("applicants", JSON.stringify(applicants));
  renderApplicants();
}

function renderApplicants() {
  container.innerHTML = "";
  applicants.forEach((a) => {
    const card = document.createElement("div");
    card.className = "applicant-card";
    card.innerHTML = `
      <h3>${a.name}</h3>
      <p><strong>Position:</strong> ${a.position}</p>
      <p><strong>Stage:</strong> ${a.stage}</p>
      <p><strong>Date:</strong> ${a.date}</p>
      <p><strong>Notes:</strong> ${a.notes}</p>
      <div class="actions">
        <button class="edit" onclick='openModal(${JSON.stringify(a)})'>Edit</button>
        <button class="delete" onclick='deleteApplicant(${a.id})'>Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}
