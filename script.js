const systems = [
  { key: "gt", label: "GT" },
  { key: "ecc500", label: "ECC~500" },
  { key: "ecc800", label: "ECC~800" },
  { key: "bigcodec1040", label: "BigCodec 1040" },
  { key: "mimi560", label: "Mimi 560" },
  { key: "snac980", label: "SNAC 980" },
  { key: "taae400", label: "TAAE 400" },
  { key: "taae700", label: "TAAE 700" },
];

const datasets = [
  {
    id: "LibriTTS_Clean",
    samples: [
      { id: "260_123286_000034_000002", label: "Sample 1" },
      { id: "1089_134686_000009_000004", label: "Sample 2" },
      { id: "1284_1181_000003_000002", label: "Sample 3" },
      { id: "1580_141084_000009_000003", label: "Sample 4" },
      { id: "5639_40744_000000_000000", label: "Sample 5" },
      { id: "5683_32865_000010_000001", label: "Sample 6" },
    ]
  },
  {
    id: "LibriTTS_Other",
    samples: [
      { id: "3005_163389_000015_000008", label: "Sample 1" },
      { id: "3528_168669_000085_000000", label: "Sample 2" },
      { id: "367_130732_000020_000001", label: "Sample 3" },
      { id: "4350_9170_000035_000000", label: "Sample 4" },
      { id: "4852_28312_000001_000004", label: "Sample 5" },
      { id: "5484_24317_000004_000000", label: "Sample 6" },
    ]
  },
  {
    id: "VCTK",
    samples: [
      { id: "p361_023_mic1", label: "Sample 1" },
      { id: "p364_023_mic1", label: "Sample 2" },
      { id: "p374_021_mic1", label: "Sample 3" },
      { id: "p376_023_mic1", label: "Sample 4" },
      { id: "s5_021_mic1", label: "Sample 5" },
      { id: "s5_023_mic1", label: "Sample 6" },
    ]
  },
  {
    id: "AIShell",
    samples: [
      { id: "SSB05440038", label: "Sample 1" },
      { id: "SSB06710228", label: "Sample 2" },
      { id: "SSB07000265", label: "Sample 3" },
      { id: "SSB07170156", label: "Sample 4" },
      { id: "SSB11100032", label: "Sample 5" },
      { id: "SSB18310269", label: "Sample 6" },
    ]
  }
];

const audioExtensions = ["wav", "mp3", "flac", "m4a", "ogg"];

function addCell(row, tag, text, className) {
  const cell = document.createElement(tag);
  cell.textContent = text;
  if (className) {
    cell.className = className;
  }
  row.appendChild(cell);
  return cell;
}

async function findAudioSource(datasetId, sampleId, systemKey) {
  for (const extension of audioExtensions) {
    const source = `audio/${datasetId}/${sampleId}/${systemKey}.${extension}`;

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
  datasets.forEach((dataset) => {
    const table = document.querySelector(`#table-${dataset.id}`);
    if (!table) return;

    const audioHead = table.querySelector(".audio-head");
    const audioBody = table.querySelector(".audio-body");

    addCell(audioHead, "th", "Sample", "sample-id");
    systems.forEach((system) => addCell(audioHead, "th", system.label));

    dataset.samples.forEach((sample) => {
      const row = document.createElement("tr");
      addCell(row, "td", sample.label, "sample-id");

      systems.forEach(async (system) => {
        const cell = document.createElement("td");
        cell.className = "audio-cell";
        row.appendChild(cell);
        renderPending(cell);

        const source = await findAudioSource(dataset.id, sample.id, system.key);
        if (source) {
          renderAudio(cell, source, `${dataset.id} ${sample.label} ${system.label}`);
        }
      });

      audioBody.appendChild(row);
    });
  });
}

renderAudioTable();
