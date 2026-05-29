import { createUser, addAttribute } from "../models/user.js";
import notes from "../models/notes.js";
import prompt from "prompt-sync";

const input = prompt();

function getValidatedPassword() {
  while (true) {
    const password = input("Wprowadź hasło administratora: ");

    if (password.length < 8) {
      console.log("Hasło musi mieć co najmniej 8 znaków. Spróbuj ponownie.");
      continue;
    }
    else{
      return password;
    }
  }
}

const adminPassword = getValidatedPassword();

const admin = await createUser("admin", adminPassword);
if (admin != null) {
  addAttribute(admin.id, "is_admin", true);
  console.log("admin / " + adminPassword + " (admin)");
} else {
  console.log("konto admin już istnieje");
}

const student = await createUser("student", "student1");
if (student != null) {
  console.log("student / student1 (student)");
} else {
  console.log("konto student już istnieje");
}

if (admin != null && student != null) {
  notes.addNote("Notatka administratora", admin.id);
  notes.addNote("Notatka studenta", student.id);
}
