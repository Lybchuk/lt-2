// ============================================================
// ВАЖЛИВО: сюди вставте адресу форми з сайту formspree.io
// (як її отримати — написано у файлі README.txt)
// ============================================================
var ADRESA_FORMI = "https://formspree.io/f/ВАШ_ID";


// ---------- Фільтри на головній сторінці ----------
var aktyvnyjTyp = "";

function filterTours() {
  var vyizd = document.getElementById("f-vyizd").value;
  var krajina = document.getElementById("f-krajina").value;
  var misyac = document.getElementById("f-misyac").value;
  var maxCina = Number(document.getElementById("f-cina").value);
  var bezNochi = document.getElementById("f-nichni").checked;
  var typ = aktyvnyjTyp;   // «море», «гори» або «міста» з великої панелі зверху

  document.getElementById("cina-tekst").innerHTML = maxCina;

  var cards = document.getElementsByClassName("card");
  var pokazano = 0;

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var pokazaty = true;

    if (vyizd != "" && card.dataset.vyizd.indexOf(vyizd) == -1) pokazaty = false;
    if (krajina != "" && card.dataset.krajina != krajina) pokazaty = false;
    if (misyac != "" && card.dataset.misyaci.indexOf(misyac) == -1) pokazaty = false;
    if (Number(card.dataset.cina) > maxCina) pokazaty = false;
    if (bezNochi && card.dataset.nich == "tak") pokazaty = false;
    if (typ != "" && (" " + card.dataset.typ + " ").indexOf(" " + typ + " ") == -1) pokazaty = false;

    if (pokazaty) {
      card.style.display = "block";
      pokazano = pokazano + 1;
    } else {
      card.style.display = "none";
    }
  }

  if (pokazano == 0) {
    document.getElementById("nema").style.display = "block";
  } else {
    document.getElementById("nema").style.display = "none";
  }
}


// ---------- Гортання фото стрілками ----------
function gortaty(knopka, napryamok) {
  var strichka = knopka.parentNode.querySelector(".strichka");
  strichka.scrollBy(napryamok * strichka.clientWidth, 0);
}


// ---------- Відправка заявок ----------
function vidpravyty(podiya) {
  podiya.preventDefault();          // не перезавантажувати сторінку
  var forma = podiya.target;

  if (ADRESA_FORMI.indexOf("ВАШ_ID") != -1) {
    alert("Форма ще не підключена. Вставте адресу Formspree у файл script.js");
    return;
  }

  fetch(ADRESA_FORMI, {
    method: "POST",
    body: new FormData(forma),
    headers: { "Accept": "application/json" }
  }).then(function (vidpovid) {
    if (vidpovid.ok) {
      forma.innerHTML = "<p class='gotovo'>Дякуємо! Менеджер зателефонує вам найближчим часом.</p>";
    } else {
      alert("Не вдалося відправити заявку. Зателефонуйте нам, будь ласка.");
    }
  }).catch(function () {
    alert("Не вдалося відправити заявку. Перевірте інтернет і спробуйте ще раз.");
  });
}

var formy = document.getElementsByClassName("zayavka");
for (var i = 0; i < formy.length; i++) {
  formy[i].addEventListener("submit", vidpravyty);
}


// ============================================================
// ШАПКА ТА ВЕРХНІЙ ЕКРАН
// ============================================================
var shapka = document.getElementById("shapka");
var burger = document.getElementById("burger");

// Шапка стає суцільною, коли сторінку прогорнули (тільки на головній)
function onScrollShapka() {
  if (shapka && shapka.dataset.hero) {
    if (window.scrollY > 40) {
      shapka.classList.add("scrolled");
    } else {
      shapka.classList.remove("scrolled");
    }
  }
}
window.addEventListener("scroll", onScrollShapka);
onScrollShapka();

// Меню-гамбургер на телефоні
function perekluchytyMenu(vidkryty) {
  shapka.classList.toggle("menu-open", vidkryty);
  burger.setAttribute("aria-expanded", vidkryty ? "true" : "false");
  burger.setAttribute("aria-label", vidkryty ? "Закрити меню" : "Відкрити меню");
}

if (burger) {
  burger.addEventListener("click", function () {
    perekluchytyMenu(!shapka.classList.contains("menu-open"));
  });

  var posylannya = document.querySelectorAll("#menu a");
  for (var m = 0; m < posylannya.length; m++) {
    posylannya[m].addEventListener("click", function () {
      perekluchytyMenu(false);
    });
  }

  document.addEventListener("keydown", function (podiya) {
    if (podiya.key == "Escape") perekluchytyMenu(false);
  });
}


// ---------- Панель «Море / Гори / Міста» ----------
function tury(n) {
  var ostanni = n % 10, dvi = n % 100;
  if (ostanni == 1 && dvi != 11) return n + " тур";
  if (ostanni >= 2 && ostanni <= 4 && (dvi < 12 || dvi > 14)) return n + " тури";
  return n + " турів";
}

var napryamy = document.getElementsByClassName("napryam");

// Дописуємо кількість турів під кожною кнопкою
for (var k = 0; k < napryamy.length; k++) {
  var typKnopky = napryamy[k].dataset.typ;
  var kartky = document.querySelectorAll('.card[data-typ~="' + typKnopky + '"]');
  var pidpys = napryamy[k].querySelector("small");
  if (kartky.length > 0) {
    pidpys.innerHTML = tury(kartky.length) + ": " + pidpys.innerHTML;
  }

  napryamy[k].addEventListener("click", function () {
    var tut = this.dataset.typ;
    // повторне натискання — прибирає фільтр
    aktyvnyjTyp = (aktyvnyjTyp == tut) ? "" : tut;

    for (var j = 0; j < napryamy.length; j++) {
      napryamy[j].setAttribute("aria-pressed", napryamy[j].dataset.typ == aktyvnyjTyp ? "true" : "false");
    }

    filterTours();
    document.getElementById("filtry").scrollIntoView();
  });
}
