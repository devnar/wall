const d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let month = months[d.getMonth()];

document.querySelector(".header-date").innerHTML = month + " " + d.getDate() + ", " + d.getFullYear();

/***** 

NOTE

******/

class NoteManager {
    static getNotes() {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        return notes.map((note) => ({
            date: note.date || new Date().toISOString(),
            content: note.content || "",
            isBookmarked: note.isBookmarked || false,
        }));
    }

    static saveNotes(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    static addNote(content) {
        const notes = this.getNotes();
        notes.unshift({ date: new Date().toISOString(), content, isBookmarked: false });
        this.saveNotes(notes);
        renderNotes();
    }

    static toggleBookmark(index) {
        const notes = this.getNotes();
        if (notes[index]) {
            notes[index].isBookmarked = !notes[index].isBookmarked;
            this.saveNotes(notes);
            renderNotes();
        }
    }

    static deleteNote(index) {
        const notes = this.getNotes();
        if (notes[index]) {
            notes.splice(index, 1);
            this.saveNotes(notes);
            renderNotes();
        }
    }
}

document.querySelector(".add-button").addEventListener("click", () => {
    const input = document.querySelector(".url-input");
    const content = input.value.trim();
    if (content) {
        NoteManager.addNote(content);
        input.value = "";
    }
});

function searchNotes() {
    const searchTerm = document.querySelector(".search-input").value.toLowerCase();
    const notes = NoteManager.getNotes();
    const filteredNotes = notes.filter((note) =>
        note.content.toLowerCase().includes(searchTerm)
    );

    renderNotesList(filteredNotes);
}

function searchInput(boolean) {
    if (boolean == 1) {
        document.getElementById("addNoteInput").style.display = "none";
        document.getElementById("calanderView").style.display = "none";
        document.getElementById("listView").style.display = "block";
        document.getElementById("searchNoteInput").style.display = "block";
    } else {
        document.getElementById("searchNoteInput").style.display = "none";
        document.getElementById("addNoteInput").style.display = "block";
    }
}

function calendarView(boolean) {
    if (boolean == 1) {
        document.getElementById("listView").style.display = "none";
        document.getElementById("addNoteInput").style.display = "none";
        document.getElementById("searchNoteInput").style.display = "none";
        document.getElementById("calanderView").style.display = "block";
    } else {
        document.getElementById("calanderView").style.display = "none";
        document.getElementById("addNoteInput").style.display = "block";
        document.getElementById("listView").style.display = "block";
    }
}

function renderNotes() {
    const notes = NoteManager.getNotes();
    const noteList = document.querySelector(".note-list");
    noteList.innerHTML = "";

    notes.forEach((note, index) => {
        const noteItem = document.createElement("div");
        noteItem.className = "note-item";

        noteItem.innerHTML = `
      <div class="note-date">
        <svg class="bookmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="${note.isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>${new Date(note.date).toLocaleDateString()}</span>
      </div>
      <div class="note-content">
        <div class="note-text">
          <span>${note.content}</span>
        </div>
      </div>
    `;

        noteItem.querySelector(".bookmark-icon").addEventListener("click", () => {
            NoteManager.toggleBookmark(index);
        });

        noteList.appendChild(noteItem);
    });
}

function renderBookmarkedNotes() {
    const notes = NoteManager.getNotes().filter((note) => note.isBookmarked);
    const noteList = document.querySelector(".note-list");
    noteList.innerHTML = "";

    notes.forEach((note, index) => {
        const noteItem = document.createElement("div");
        noteItem.className = "note-item";

        noteItem.innerHTML = `
        <div class="note-date">
          <svg class="bookmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>${new Date(note.date).toLocaleDateString()}</span>
        </div>
        <div class="note-content">
          <div class="note-text">
            <span>${note.content}</span>
          </div>
        </div>
      `;

        noteItem.querySelector(".bookmark-icon").addEventListener("click", () => {
            const actualIndex = NoteManager.getNotes().findIndex(
                (n) => n.date === note.date && n.content === note.content
            );
            NoteManager.toggleBookmark(actualIndex);
            renderBookmarkedNotes();
        });

        noteList.appendChild(noteItem);
    });
}

function renderNotesList(notes) {
    const noteList = document.querySelector(".note-list");
    noteList.innerHTML = "";

    notes.forEach((note, index) => {
        const noteItem = document.createElement("div");
        noteItem.className = "note-item";

        noteItem.innerHTML = `
      <div class="note-date">
        <svg class="bookmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="${note.isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>${new Date(note.date).toLocaleDateString()}</span>
      </div>
      <div class="note-content">
        <div class="note-text">
          <span>${note.content}</span>
        </div>
      </div>
    `;

        noteItem.querySelector(".bookmark-icon").addEventListener("click", () => {
            NoteManager.toggleBookmark(index);
        });

        noteList.appendChild(noteItem);
    });
}

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    getMonthRange() {
        const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        return { startDate, endDate };
    }

    renderCalendar() {
        const { startDate, endDate } = this.getMonthRange();
        const monthDays = this.getMonthDays(startDate, endDate);

        const calendarBody = document.querySelector(".calendar-body");
        const currentMonthText = document.querySelector(".current-month");
        currentMonthText.textContent = `${startDate.toLocaleString("default", { month: "long" })} ${startDate.getFullYear()}`;

        calendarBody.innerHTML = "";

        monthDays.forEach((day) => {
            const dayElement = document.createElement("div");
            dayElement.className = "calendar-day";
            dayElement.dataset.date = day.date.toISOString().split("T")[0];
            dayElement.innerHTML = `
                <span>${day.date.getDate()}</span>
                <div class="day-notes"></div>
            `;
            calendarBody.appendChild(dayElement);

            this.renderDayNotes(dayElement, day.date);
        });
    }

    getMonthDays(startDate, endDate) {
        const days = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            days.push({ date: new Date(date) });
        }
        return days;
    }

    renderDayNotes(dayElement, date) {
        const notes = NoteManager.getNotes().filter(note =>
            new Date(note.date).toLocaleDateString() === date.toLocaleDateString()
        );

        const notesContainer = dayElement.querySelector(".day-notes");
        notesContainer.innerHTML = "";

        notes.forEach((note) => {
            const noteItem = document.createElement("div");
            noteItem.className = "note-item";
            noteItem.innerHTML = `
                <span>${note.content}</span>
            `;
            notesContainer.appendChild(noteItem);
        });
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }
}

const calendar = new Calendar();

document.querySelector(".next-month").addEventListener("click", () => {calendar.nextMonth();});
document.querySelector(".prev-month").addEventListener("click", () => {calendar.prevMonth();});

document.querySelector(".search-input").addEventListener("input", searchNotes);

// Tüm notları render et
renderNotes();
