const systems = [
  { key: "gt", label: "GT" },
  { key: "ecc", label: "ECC" },
  { key: "funcodec", label: "FunCodec" },
  { key: "encodec", label: "EnCodec" },
  { key: "opus", label: "Opus" },
];

const samples = [
  { id: "sample-01", label: "Sample 01" },
  { id: "sample-02", label: "Sample 02" },
  { id: "sample-03", label: "Sample 03" },
  { id: "sample-04", label: "Sample 04" },
  { id: "sample-05", label: "Sample 05" },
];

const audioExtensions = ["wav", "mp3", "flac", "m4a", "ogg"];

const audioHead = document.querySelector("#audio-head");
const audioBody = document.querySelector("#audio-body");

function addCell(row, tag, text, className) {
  const cell = document.createElement(tag);
  cell.textContent = text;
  if (className) {
    cell.className = className;
  }
  row.appendChild(cell);
  return cell;
}

async function findAudioSource(sampleId, systemKey) {
  for (const extension of audioExtensions) {
    const source = `audio/${sampleId}/${systemKey}.${extension}`;

    try {
      const response = await fetch(source, { method: "HEAD" });
      if (response.ok) {
        return source;
      }
    } catch {
      return source;
    }
  }

  return null;
}

function renderPending(cell) {
  const pending = document.createElement("span");
  pending.className = "audio-pending";
  pending.textContent = "Pending";
  cell.replaceChildren(pending);
}

function renderAudio(cell, source, label) {
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.preload = "none";
  audio.src = source;
  audio.setAttribute("aria-label", label);
  audio.addEventListener("error", () => renderPending(cell), { once: true });
  cell.replaceChildren(audio);
}

function renderAudioTable() {
  addCell(audioHead, "th", "Sample", "sample-id");
  systems.forEach((system) => addCell(audioHead, "th", system.label));

  samples.forEach((sample) => {
    const row = document.createElement("tr");
    addCell(row, "td", sample.label, "sample-id");

    systems.forEach(async (system) => {
      const cell = document.createElement("td");
      row.appendChild(cell);
      renderPending(cell);

      const source = await findAudioSource(sample.id, system.key);
      if (source) {
        renderAudio(cell, source, `${sample.label} ${system.label}`);
      }
    });

    audioBody.appendChild(row);
  });
}

renderAudioTable();
