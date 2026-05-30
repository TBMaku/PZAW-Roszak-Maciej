# PZAW REVIEW Maciej Roszak przez Szymona Tabisz

## Instalacja i uruchamianie

README jest czytelne, dobrze zformatowane. W części 2 README projektu nie jest opisane ze trzeba wygenerowane polecenia wklejać pojedynczo do terminala co jest troche nieintuicyjne.
Poczatkowo, przy uruchamianiu projektu nie dalo się zalogowac na żadne konto ponieważ wystepowal blad związany z baza danych, który potem został naprawiony.

## UX

Aplikacja prezentuje się dobrze, czcionka jest ładna i przejrzysta.Jedyne uwagi mam do niektórych przyciskow, gdyż uważam ze ich obramowka jest troche za mala przez co dla niektórych uzytkownikow moga się one za bardzo zlewac z tlem.

## Użytkowanie

Aplikacja jest intuicyjna i działa bez zarzutów

## Walidacja i obsługa błędów

Formularze walidują się poprawnie, błędy są obsługiwane prawidłowo, program obsługuje probe nieautoryzowanego przejeścia do prywatnych segmentów użytkowników strony poprzez zmianę URL. Natomiast podczas tworzenia notatki lub jej edycji jeśli wprowadzimy zbyt dlugi ciag znaków to powstaje błąd który nie jest obsłużony, należy ustawić odgórny limit na długość notatki

## Podatność na HTML Injection i SQL injection
podczas moich testów nie wynikało że strona jest podatna na SQL injection natomiast znalazłem podatność na HTML injection.

## Code review

Kod jest łatwy w prześledzeniu, ostatni nagłówek README omawia co dany plik ma za zadanie w projekcie co ułatwia przejrzystość kodu, co również ułatwia wprowadzenie w nim zmian, choć uważam że dodanie komentarzy byłoby mile widziane
