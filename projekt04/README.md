## Przygotowanie środowiska
1. Uruchom generator sekretów dla środowiska:
```
node utils/generate_env.js
```

2. Skopiuj wygenerowane polecenia i ustaw je w terminalu.

3. Zainstaluj zależności:

```
npm install
```

4. Utwórz konta testowe i przykładowe notatki:

```
node utils/populate_db.js
```

5. Uruchom aplikację:

```
node index.js
```

6. Otwórz przeglądarkę:

```
http://localhost:8000
```

## Konta testowe
- Administrator: 'admin' / hasło użytkownika
- Student: 'student' / 'student1'

## Co robi aplikacja
- Pozwala zarejestrować nowe konto użytkownika
- Umożliwia logowanie i wylogowanie
- Pozwala tworzyć nowe notatki
- Umożliwia edycję i usuwanie notatek
- Każdy użytkownik widzi wszystkie notatki, ale może edytować tylko swoje
- Konto administratora ma dodatkowe uprawnienia: może edytować i usuwać wszystkie notatki

## Technologie
- Node.js + Express
- EJS jako silnik szablonów
- `argon2` do haszowania haseł
- `cookie-parser` i sesje do uwierzytelniania
- `morgan` do logowania żądań


## Funkcjonalności użytkownika
- Rejestracja nowego konta
- Logowanie z przekierowaniem po próbie wejścia na stronę chronioną
- Dodawanie notatek
- Edytowanie i usuwanie notatek, jeśli jesteś właścicielem notatki
- Widok wszystkich notatek na stronie głównej


## Pliki ważne w projekcie
- `index.js` – serwer Express i logika tras
- `models/session.js` – obsługa sesji użytkownika
- `models/user.js` – tworzenie użytkowników i walidacja haseł
- `models/notes.js` – CRUD notatek
- `views/` – szablony EJS
- `public/` – pliki statyczne (CSS)
- `utils/generate_env.js` – generowanie sekretów środowiskowych
- `utils/populate_db.js` – inicjalizacja kont testowych