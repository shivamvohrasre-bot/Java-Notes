<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Note Manager</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <script>
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let currentEditIndex = null;

    const title = document.createElement("h1");
    title.textContent = "Simple JavaScript Note Manager";
    title.className = "text-center text-3xl font-bold text-blue-800 mt-10 mb-6";
    document.body.appendChild(title);

    const mainDiv = document.createElement("div");
    mainDiv.className = "max-w-4xl mx-auto flex border-4 border-black rounded-xl bg-white shadow-lg p-4 gap-4";
    document.body.appendChild(mainDiv);

    const leftDiv = document.createElement("div");
    leftDiv.className = "w-1/2 flex flex-col gap-3 p-4 border-2 border-black rounded-lg bg-gray-50 overflow-y-auto";
    mainDiv.appendChild(leftDiv);

    const rightDiv = document.createElement("div");
    rightDiv.className = "w-1/2 border-2 border-black rounded-lg p-4 overflow-y-auto bg-white";
    mainDiv.appendChild(rightDiv);

    const topButton = createButton("ADD");
    leftDiv.appendChild(topButton);

    const titleInput = createInput("ENTER TITLE");
    const textInput = createInput("ENTER NOTE");
    const submitButton = createButton("ADD NOTE");

    titleInput.classList.add("hidden");
    textInput.classList.add("hidden");
    submitButton.classList.add("hidden");

    leftDiv.appendChild(titleInput);
    leftDiv.appendChild(textInput);
    leftDiv.appendChild(submitButton);

    topButton.onclick = () => {
      titleInput.classList.remove("hidden");
      textInput.classList.remove("hidden");
      submitButton.classList.remove("hidden");
    };

    submitButton.onclick = () => {
      const titleVal = titleInput.value.trim();
      const textVal = textInput.value.trim();

      if (!titleVal || !textVal) return;

      if (currentEditIndex !== null) {
        notes[currentEditIndex] = { Title: titleVal, Text: textVal, id: Date.now() };
        localStorage.setItem("notes", JSON.stringify(notes));
        location.reload();
      } else {
        notes.push({ Title: titleVal, Text: textVal, id: Date.now() });
        localStorage.setItem("notes", JSON.stringify(notes));
        createNoteDiv(textVal, titleVal, notes.length - 1);
      }

      titleInput.value = "";
      textInput.value = "";
      titleInput.classList.add("hidden");
      textInput.classList.add("hidden");
      submitButton.classList.add("hidden");
      currentEditIndex = null;
      submitButton.textContent = "ADD NOTE";
    };

    notes.forEach((note, index) => createNoteDiv(note.Text, note.Title, index));

    function createInput(placeholder) {
      const input = document.createElement("input");
      input.placeholder = placeholder;
      input.className = "border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500";
      return input;
    }

    function createButton(text) {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.className = "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition";
      return btn;
    }

    function createNoteDiv(text, title, index) {
      const noteBox = document.createElement("div");
      noteBox.className = "relative border border-gray-400 rounded-lg p-4 mb-4 bg-blue-50";
      const titleEl = document.createElement("h3");
      titleEl.textContent = title;
      titleEl.className = "font-semibold text-lg text-blue-900 mb-2";
      noteBox.appendChild(titleEl);

      const textDiv = document.createElement("div");
      textDiv.textContent = text.length > 50 ? text.slice(0, 50) + "..." : text;
      textDiv.className = "text-sm text-gray-700 h-16 overflow-hidden";
      noteBox.appendChild(textDiv);

      if (text.length > 50) {
        const readMoreBtn = createSmallButton("...read more");
        readMoreBtn.onclick = () => {
          textDiv.textContent = text;
          readMoreBtn.classList.add("hidden");
        };
        noteBox.appendChild(readMoreBtn);
      }

      const timeEl = document.createElement("div");
      timeEl.className = "absolute bottom-12 right-4 text-xs text-gray-500";
      timeEl.textContent = getTimeAgo(notes[index].id);
      noteBox.appendChild(timeEl);

      const delBtn = createSmallButton("Delete");
      delBtn.classList.add("right-2", "bottom-2");
      delBtn.onclick = () => {
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        location.reload();
      };

      const updateBtn = createSmallButton("Update");
      updateBtn.classList.add("left-2", "bottom-2");
      updateBtn.onclick = () => {
        titleInput.value = title;
        textInput.value = text;
        titleInput.classList.remove("hidden");
        textInput.classList.remove("hidden");
        submitButton.classList.remove("hidden");
        submitButton.textContent = "UPDATE NOTE";
        currentEditIndex = index;
      };

      noteBox.appendChild(delBtn);
      noteBox.appendChild(updateBtn);
      rightDiv.appendChild(noteBox);
    }

    function createSmallButton(text) {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.className = "absolute text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded";
      return btn;
    }

    function getTimeAgo(time) {
      const now = Date.now();
      const diff = now - time;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      if (minutes > 0) return `${minutes}m ago`;
      return `${seconds}s ago`;
    }
  </script>
</body>
</html>