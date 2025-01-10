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

    static convertLinks(content) {
        content = content.replace(/https?:\/\/[^\s]+/g, function(url) {
            return `<a href="${url}" target="_blank">${url}</a>`;
        });
    
        content = content.replace(/(^|\s)(#\w+)(?=\s|$)/g, function(match, p1, p2) {
            var a = `searchInput(1);renderNotes();document.querySelector('.search-input').value='tag:${p2.replace("#", "")}';searchNotes();`;
            return `${p1}<span class="tag" onclick=${a}>${p2}</span>`;
        });
    
        return content;
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

    if (searchTerm.startsWith("bookmarks:")) {
        const searchQuery = searchTerm.replace("bookmarks:", "").trim();
        const filteredBookmarkedNotes = notes.filter((note) =>
            note.isBookmarked && note.content.toLowerCase().includes(searchQuery)
        );
        renderNotesList(filteredBookmarkedNotes);
        return;
    }

    if (searchTerm.startsWith("tag:")) {
        const searchQuery = searchTerm.replace("tag:", "").trim();
        const filteredBookmarkedNotes = notes.filter((note) =>
            note.content.toLowerCase().includes("#"+searchQuery)
        );
        renderNotesList(filteredBookmarkedNotes);
        return;
    }

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
        document.getElementById("addNoteInput").style.display = "none";
        document.getElementById("searchNoteInput").style.display = "none";
        document.getElementById("calanderView").style.display = "block";
    } else {
        document.getElementById("calanderView").style.display = "none";
        document.getElementById("addNoteInput").style.display = "block";
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
      <div class="note-content">
        <div class="note-text">
          <span>${NoteManager.convertLinks(note.content)}</span>
        </div>
      </div>
      <div class="note-date">
        <svg class="delete-icon" width="20" height="20" viewBox="0 0 24 24" stroke="#ff0000" stroke-width="2" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7H21M16 7H8C8 6.07003 8 5.60504 8.10222 5.22354C8.37962 4.18827 9.18827 3.37962 10.2235 3.10222C10.605 3 11.07 3 12 3C12.93 3 13.395 3 13.7765 3.10222C14.8117 3.37962 15.6204 4.18827 15.8978 5.22354C16 5.60504 16 6.07003 16 7ZM6 7H18V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V7Z" />
        </svg>
        <svg class="bookmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="${note.isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
          <path d="M13.2 3H10.8C9.11984 3 8.27976 3 7.63803 3.32698C7.07354 3.6146 6.6146 4.07354 6.32698 4.63803C6 5.27976 6 6.11984 6 7.8V17.8C6 18.8299 6 19.3449 6.21264 19.6165C6.39769 19.8528 6.67912 19.9935 6.97921 19.9998C7.32406 20.007 7.73604 19.698 8.56 19.08L9.12 18.66C10.1528 17.8854 10.6692 17.4981 11.2363 17.3488C11.7369 17.2171 12.2631 17.2171 12.7637 17.3488C13.3308 17.4981 13.8472 17.8854 14.88 18.66L15.44 19.08C16.264 19.698 16.6759 20.007 17.0208 19.9998C17.3209 19.9935 17.6023 19.8528 17.7874 19.6165C18 19.3449 18 18.8299 18 17.8V7.8C18 6.11984 18 5.27976 17.673 4.63803C17.3854 4.07354 16.9265 3.6146 16.362 3.32698C15.7202 3 14.8802 3 13.2 3Z"></path>
        </svg>
        <span>${new Date(note.date).toLocaleDateString()}</span>
      </div>
    `;

        noteItem.querySelector(".bookmark-icon").addEventListener("click", () => {
            NoteManager.toggleBookmark(index);
        });

        noteItem.querySelector(".delete-icon").addEventListener("click", () => {
            NoteManager.deleteNote(index);
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
        <div class="note-content">
        <div class="note-text">
          <span>${NoteManager.convertLinks(note.content)}</span>
        </div>
      </div>
      <div class="note-date">
        <svg class="delete-icon" width="20" height="20" viewBox="0 0 24 24" stroke="#ff0000" stroke-width="2" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7H21M16 7H8C8 6.07003 8 5.60504 8.10222 5.22354C8.37962 4.18827 9.18827 3.37962 10.2235 3.10222C10.605 3 11.07 3 12 3C12.93 3 13.395 3 13.7765 3.10222C14.8117 3.37962 15.6204 4.18827 15.8978 5.22354C16 5.60504 16 6.07003 16 7ZM6 7H18V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V7Z" />
        </svg>
        <svg class="bookmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="${note.isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
          <path d="M13.2 3H10.8C9.11984 3 8.27976 3 7.63803 3.32698C7.07354 3.6146 6.6146 4.07354 6.32698 4.63803C6 5.27976 6 6.11984 6 7.8V17.8C6 18.8299 6 19.3449 6.21264 19.6165C6.39769 19.8528 6.67912 19.9935 6.97921 19.9998C7.32406 20.007 7.73604 19.698 8.56 19.08L9.12 18.66C10.1528 17.8854 10.6692 17.4981 11.2363 17.3488C11.7369 17.2171 12.2631 17.2171 12.7637 17.3488C13.3308 17.4981 13.8472 17.8854 14.88 18.66L15.44 19.08C16.264 19.698 16.6759 20.007 17.0208 19.9998C17.3209 19.9935 17.6023 19.8528 17.7874 19.6165C18 19.3449 18 18.8299 18 17.8V7.8C18 6.11984 18 5.27976 17.673 4.63803C17.3854 4.07354 16.9265 3.6146 16.362 3.32698C15.7202 3 14.8802 3 13.2 3Z"></path>
        </svg>
        <span>${new Date(note.date).toLocaleDateString()}</span>
      </div>
      `;

      noteItem.querySelector(".bookmark-icon").addEventListener("click", () => {
        NoteManager.toggleBookmark(index);
    });

    noteItem.querySelector(".delete-icon").addEventListener("click", () => {
        NoteManager.deleteNote(index);
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
      <div class="note-content">
        <div class="note-text">
          <span>${NoteManager.convertLinks(note.content)}</span>
        </div>
      </div>
      <div class="note-date">
        <svg class="delete-icon" width="20" height="20" viewBox="0 0 24 24" stroke="#ff0000" stroke-width="2" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7H21M16 7H8C8 6.07003 8 5.60504 8.10222 5.22354C8.37962 4.18827 9.18827 3.37962 10.2235 3.10222C10.605 3 11.07 3 12 3C12.93 3 13.395 3 13.7765 3.10222C14.8117 3.37962 15.6204 4.18827 15.8978 5.22354C16 5.60504 16 6.07003 16 7ZM6 7H18V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V7Z" />
        </svg>
        <svg class="bookmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="${note.isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
          <path d="M13.2 3H10.8C9.11984 3 8.27976 3 7.63803 3.32698C7.07354 3.6146 6.6146 4.07354 6.32698 4.63803C6 5.27976 6 6.11984 6 7.8V17.8C6 18.8299 6 19.3449 6.21264 19.6165C6.39769 19.8528 6.67912 19.9935 6.97921 19.9998C7.32406 20.007 7.73604 19.698 8.56 19.08L9.12 18.66C10.1528 17.8854 10.6692 17.4981 11.2363 17.3488C11.7369 17.2171 12.2631 17.2171 12.7637 17.3488C13.3308 17.4981 13.8472 17.8854 14.88 18.66L15.44 19.08C16.264 19.698 16.6759 20.007 17.0208 19.9998C17.3209 19.9935 17.6023 19.8528 17.7874 19.6165C18 19.3449 18 18.8299 18 17.8V7.8C18 6.11984 18 5.27976 17.673 4.63803C17.3854 4.07354 16.9265 3.6146 16.362 3.32698C15.7202 3 14.8802 3 13.2 3Z"></path>
        </svg>
        <span>${new Date(note.date).toLocaleDateString()}</span>
      </div>
    `;

    noteItem.querySelector(".bookmark-icon").addEventListener("click", () => {
        NoteManager.toggleBookmark(index);
    });

    noteItem.querySelector(".delete-icon").addEventListener("click", () => {
        NoteManager.deleteNote(index);
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

            const notesCount = this.getNotesCount(day.date);

            if(notesCount > 0) {
                dayElement.innerHTML = `
                <span>${day.date.getDate()}</span>
                <div class="day-notes-count">${notesCount}</div>
            `;
            } else {
                dayElement.innerHTML = `
                <span>${day.date.getDate()}</span>`;
            }
            

            dayElement.addEventListener("click", () => this.showNotesForDay(day.date));
            calendarBody.appendChild(dayElement);
        });
    }

    getMonthDays(startDate, endDate) {
        const days = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            days.push({ date: new Date(date) });
        }
        return days;
    }

    getNotesCount(date) {
        return NoteManager.getNotes().filter(note =>
            new Date(note.date).toLocaleDateString() === date.toLocaleDateString()
        ).length;
    }

    showNotesForDay(date) {
        const notes = NoteManager.getNotes().filter(note =>
            new Date(note.date).toLocaleDateString() === date.toLocaleDateString()
        );
    
        const noteList = document.querySelector(".note-list");
        noteList.innerHTML = ""; // Listeyi temizle
    
        notes.forEach((note, index) => {
            const noteItem = document.createElement("div");
            noteItem.className = "note-item";
    
            // Not içeriğini ve ikonları oluştur
            noteItem.innerHTML = `
                <div class="note-content">
                    <div class="note-text">
                        <span>${NoteManager.convertLinks(note.content)}</span>
                    </div>
                </div>
                <div class="note-date">
                    <svg class="delete-icon" width="20" height="20" viewBox="0 0 24 24" stroke="#ff0000" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 7H21M16 7H8C8 6.07003 8 5.60504 8.10222 5.22354C8.37962 4.18827 9.18827 3.37962 10.2235 3.10222C10.605 3 11.07 3 12 3C12.93 3 13.395 3 13.7765 3.10222C14.8117 3.37962 15.6204 4.18827 15.8978 5.22354C16 5.60504 16 6.07003 16 7ZM6 7H18V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V7Z" />
                    </svg>
                    <svg class="bookmark-icon" width="20" height="20" viewBox="0 0 24 24" fill="${note.isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
                        <path d="M13.2 3H10.8C9.11984 3 8.27976 3 7.63803 3.32698C7.07354 3.6146 6.6146 4.07354 6.32698 4.63803C6 5.27976 6 6.11984 6 7.8V17.8C6 18.8299 6 19.3449 6.21264 19.6165C6.39769 19.8528 6.67912 19.9935 6.97921 19.9998C7.32406 20.007 7.73604 19.698 8.56 19.08L9.12 18.66C10.1528 17.8854 10.6692 17.4981 11.2363 17.3488C11.7369 17.2171 12.2631 17.2171 12.7637 17.3488C13.3308 17.4981 13.8472 17.8854 14.88 18.66L15.44 19.08C16.264 19.698 16.6759 20.007 17.0208 19.9998C17.3209 19.9935 17.6023 19.8528 17.7874 19.6165C18 19.3449 18 18.8299 18 17.8V7.8C18 6.11984 18 5.27976 17.673 4.63803C17.3854 4.07354 16.9265 3.6146 16.362 3.32698C15.7202 3 14.8802 3 13.2 3Z"></path>
                    </svg>
                    <span>${new Date(note.date).toLocaleDateString()}</span>
                </div>
            `;
    
            // Silme işlevi ekle
            const deleteIcon = noteItem.querySelector(".delete-icon");
            deleteIcon.addEventListener("click", () => {
                NoteManager.deleteNote(index);
                this.showNotesForDay(date); // Güncellenen listeyi göster
            });
    
            // Yer işareti işlevi ekle
            const bookmarkIcon = noteItem.querySelector(".bookmark-icon");
            bookmarkIcon.addEventListener("click", () => {
                note.isBookmarked = !note.isBookmarked;
                this.showNotesForDay(date); // Güncellenen listeyi göster
            });
    
            // Listeye ekle
            noteList.appendChild(noteItem);
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

renderNotes();