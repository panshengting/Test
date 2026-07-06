/* For Grown-Ups screen: player settings, custom sentence sets and stories,
   and backup export/import. */

(() => {
  let editingSetId = null;
  let editingStoryId = null;

  const $ = (id) => document.getElementById(id);

  /* ---------- Custom item lists ---------- */
  function itemRow(name, detail, onEdit, onDelete) {
    const row = document.createElement("div");
    row.className = "custom-item";
    const label = document.createElement("span");
    label.className = "ci-name";
    label.textContent = name;
    const info = document.createElement("span");
    info.className = "ci-detail";
    info.textContent = detail;
    const edit = document.createElement("button");
    edit.className = "icon-btn";
    edit.textContent = "✏️ Edit";
    edit.addEventListener("click", onEdit);
    const del = document.createElement("button");
    del.className = "icon-btn";
    del.textContent = "🗑 Delete";
    del.addEventListener("click", onDelete);
    row.append(label, info, edit, del);
    return row;
  }

  function renderSets() {
    const box = $("custom-sets");
    box.innerHTML = "";
    if (Content.sets.length === 0) {
      box.innerHTML = `<p class="section-note">No sentence sets yet — add one below.</p>`;
      return;
    }
    Content.sets.forEach((s) => {
      box.appendChild(itemRow(
        s.name,
        `${s.sentences.length} sentence${s.sentences.length === 1 ? "" : "s"}`,
        () => {
          editingSetId = s.id;
          $("set-title").value = s.name;
          $("set-lines").value = s.sentences.join("\n");
          $("set-submit").textContent = "Save Changes";
          $("set-cancel").classList.remove("hidden");
          $("set-title").focus();
        },
        () => {
          if (confirm(`Delete the sentence set "${s.name}"?`)) {
            Content.deleteSet(s.id);
            if (editingSetId === s.id) resetSetForm();
            renderSets();
          }
        }
      ));
    });
  }

  function renderStories() {
    const box = $("custom-stories");
    box.innerHTML = "";
    if (Content.stories.length === 0) {
      box.innerHTML = `<p class="section-note">No stories yet — add one below.</p>`;
      return;
    }
    Content.stories.forEach((s) => {
      box.appendChild(itemRow(
        s.title,
        `${s.text.split(/\s+/).length} words`,
        () => {
          editingStoryId = s.id;
          $("story-title").value = s.title;
          $("story-text").value = s.text;
          $("story-submit").textContent = "Save Changes";
          $("story-cancel").classList.remove("hidden");
          $("story-title").focus();
        },
        () => {
          if (confirm(`Delete the story "${s.title}"?`)) {
            Content.deleteStory(s.id);
            if (editingStoryId === s.id) resetStoryForm();
            renderStories();
          }
        }
      ));
    });
  }

  function resetSetForm() {
    editingSetId = null;
    $("form-set").reset();
    $("set-submit").textContent = "Add Sentence Set";
    $("set-cancel").classList.add("hidden");
  }

  function resetStoryForm() {
    editingStoryId = null;
    $("form-story").reset();
    $("story-submit").textContent = "Add Story";
    $("story-cancel").classList.add("hidden");
  }

  /* ---------- Wire up ---------- */
  function init() {
    /* Settings */
    const nameInput = $("setting-name");
    const calmInput = $("setting-calm");
    nameInput.addEventListener("change", () => {
      App.progress.name = nameInput.value.trim();
      App.save();
    });
    calmInput.addEventListener("change", () => {
      App.progress.calm = calmInput.checked;
      App.save();
      App.applyCalm();
    });

    /* Sentence set form */
    $("form-set").addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = Content.upsertSet({
        id: editingSetId,
        name: $("set-title").value,
        sentences: $("set-lines").value.split("\n"),
      });
      if (ok) { resetSetForm(); renderSets(); }
    });
    $("set-cancel").addEventListener("click", resetSetForm);

    /* Story form */
    $("form-story").addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = Content.upsertStory({
        id: editingStoryId,
        title: $("story-title").value,
        text: $("story-text").value,
      });
      if (ok) { resetStoryForm(); renderStories(); }
    });
    $("story-cancel").addEventListener("click", resetStoryForm);

    /* Backup */
    $("btn-export").addEventListener("click", () => {
      const blob = new Blob([Content.exportJson()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "typing-stars-content.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    $("btn-import").addEventListener("click", () => $("import-file").click());
    $("import-file").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        if (confirm("Load this backup? It will replace the current custom stories and sentence sets.")) {
          Content.importJson(text);
          renderSets();
          renderStories();
        }
      } catch {
        alert("Sorry, that file could not be read as a Typing Stars backup.");
      }
      e.target.value = "";
    });

    App.onEnter("parent", () => {
      nameInput.value = App.progress.name || "";
      calmInput.checked = !!App.progress.calm;
      renderSets();
      renderStories();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
