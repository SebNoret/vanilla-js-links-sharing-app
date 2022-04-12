import Ajax from "./ajax";

/***************************************************
 *
 * fonction gérant l'affichage de la liste de liens
 *
 *
 ****************************************************/
const App = () => {
  function afficherLien(listeLiens) {
    for (var i = 0; i < listeLiens.length; i++) {
      //création des elements "div" et ajout de la classe css lien
      var paragrapheElmt = document.createElement("div");
      paragrapheElmt.classList.add("lien");

      //création des element "a" et ajout de leur propiétées
      var lienElmt = document.createElement("a");
      lienElmt.classList.add("url");

      lienElmt.href = listeLiens[i].url;
      lienElmt.target = "_blank";
      lienElmt.textContent = listeLiens[i].titre;

      //création de l'élément "span" correspondant à l'url du lien et ajout de la class span
      var urlSpanElmt = document.createElement("span");
      urlSpanElmt.classList.add("span");
      var urlElmt = document.createTextNode(" " + listeLiens[i].url);

      //création de l'élément "span" correspondant à l'auter du lien et ajout de la class span
      var auteurSpanElmt = document.createElement("span");
      auteurSpanElmt.classList.add("author");
      var auteurElmt = document.createTextNode(
        "Ajouté par " + listeLiens[i].auteur
      );

      //création de l'élément "br" à ajouter apprès l'élément span correspondant à l'url
      var brElmt = document.createElement("br");

      //ajout des 2 éléments textNode aux au éléments "span" correspondant
      urlSpanElmt.appendChild(urlElmt);
      auteurSpanElmt.appendChild(auteurElmt);

      //ajout des éléments "span" et br à l'élément "div"
      paragrapheElmt.appendChild(lienElmt);
      paragrapheElmt.appendChild(urlSpanElmt);
      paragrapheElmt.appendChild(brElmt);
      paragrapheElmt.appendChild(auteurSpanElmt);

      //ajout de l'élément "div" à l'élément "body" du document
      contenu.appendChild(paragrapheElmt);
    }
  }

  var titrePage = document.getElementById("titre");
  var contenu = document.getElementById("contenu");
  var ajoutBtn = document.getElementById("ajouterBtn");
  var envoiBtn = document.getElementById("envoyerBtn");
  var formulaire = document.getElementById("formulaire");

  /******************************************************************************
   *
   * constructeur de l'objet Lien (Lien en majuscule pour le distinguer parceque c'est un objet )
   *
   *******************************************************************************/
  var Lien = function (titre, uRl, auteur) {
    //méthode d'ajout de  "http" ou "https" à une url

    this.prefixUrl = function (uRl) {
      var regexHttp = /^http:\/\//;
      var regexHttps = /^https:\/\//;
      if (!regexHttp.test(uRl) && !regexHttps.test(uRl)) {
        uRl = "http://" + uRl;
      }

      return uRl;
    };

    this.titre = titre;
    this.url = this.prefixUrl(uRl);
    this.auteur = auteur;

    //méthode de mise en forme JSON pour l'envoi de requête ajax

    this.donneesLien = function () {
      var donneesLien = {
        titre: this.titre,
        url: this.url,
        auteur: this.auteur,
      };

      return donneesLien;
    };
  };

  /*************************************************************
   *
   * Ensemble de fonctions servant à gérer l'affichage du message
   *
   **************************************************************/

  function afficherMessage(statutEnvoi) {
    var message = document.getElementById("message");

    if (statutEnvoi === true) {
      message.textContent = "Le message a bien été enregistré";
    } else {
      message.textContent =
        "Une erreur s'est produite, impossible d'enregister le message";
      message.style.backgroundColor = "#e74c3c";
      message.style.borderColor = "#c0392b";
    }

    message.style.display = "flex";
    ajoutBtn.disabled = true;
  }

  function supprimerMessage() {
    var message = document.getElementById("message");
    message.style.display = "none";
    ajoutBtn.disabled = false;
  }

  function lancerMessage(statutEnvoi) {
    afficherMessage(statutEnvoi);
    setTimeout(supprimerMessage, 3000);
  }

  /*************************************************************
   *
   * fonction récupérant le titre, l'url et le nom due l'utilisateur qui poste un nouveau lien
   * et envoyant l'objet JSON via la fonction envoyerAjax()
   *
   **************************************************************/

  function ajoutLien() {
    var titreValue = formulaire.elements.titre.value;
    var urlValue = formulaire.elements.url.value;
    var nomValue = formulaire.elements.nom.value;
    var lien = new Lien(titreValue, urlValue, nomValue);

    var donnesLien = lien.donneesLien();

    envoyerAjax(donnesLien);
  }

  /***************************************************************
   *
   * ensemble des EventListener
   *
   *
   ****************************************************************/

  /*******EventListener gérant le clic sur le bouton id"ajouterBtn"*/

  ajoutBtn.addEventListener("mousedown", function (e) {
    var btn = e.target;
    btn.classList.add("bouton-activer");
  });

  ajoutBtn.addEventListener("mouseup", function (e) {
    var btn = e.target;
    btn.style.display = "none";
    var formulaire = document.getElementById("formulaire");
    formulaire.style.display = "inline-block";
    btn.classList.remove("bouton-activer");
    if (
      formulaire.elements.titre.value != "" ||
      formulaire.elements.url.value != "" ||
      formulaire.elements.nom.value != ""
    ) {
      formulaire.elements.titre.value = "";
      formulaire.elements.url.value = "";
      formulaire.elements.nom.value = "";
    }
  });

  //correction du bug graphique
  ajoutBtn.addEventListener("mouseleave", function (e) {
    var btn = e.target;
    btn.classList.remove("bouton-activer");
  });

  /********EventListener gérant le clic sur le bouton id"envoyerBtn"*/

  envoiBtn.addEventListener("mousedown", function (e) {
    var btn = e.target;
    btn.classList.add("bouton-activer");
  });

  envoiBtn.addEventListener("mouseup", function (e) {
    var btn = e.target;
    btn.classList.remove("bouton-activer");
  });
  //correction du bug graphique
  envoiBtn.addEventListener("mouseleave", function (e) {
    var btn = e.target;
    btn.classList.remove("bouton-activer");
  });

  /*******EventListener gérant la soumission du formulaire id"formulaire"*/

  formulaire.addEventListener("submit", function (e) {
    e.preventDefault();

    formulaire.style.display = "none";

    ajoutBtn.style.display = "inline-block";

    ajoutLien();
  });

  /*******EventListener gérant la disparition du formulaire via un clic sur le titre de la page (vide les champs du formaulaire)*/

  titrePage.addEventListener("click", function () {
    if (formulaire.style.display === "inline-block") {
      ajoutBtn.style.display = "inline-block";
      formulaire.style.display = "none";
      formulaire.elements.titre.value = "";
      formulaire.elements.url.value = "";
      formulaire.elements.nom.value = "";
    }
  });

  /*******************************************************
   *
   * fonctions des requêtes ajax
   *
   *
   ********************************************************/

  //affiche la liste des liens
  function afficheAjax() {
    Ajax.ajaxGet(
      "https://oc-jswebsrv.herokuapp.com/api/liens",
      function (reponse) {
        contenu.innerHTML = "";

        let listLiens = JSON.parse(reponse);

        afficherLien(listLiens);
      }
    );
  }

  //poste le lien entré par l'utilisateur sur le serveur et récupère le statut de la requête pour afficher le message correspondant
  function envoyerAjax(donnesLien) {
    Ajax.ajaxPost(
      "https://oc-jswebsrv.herokuapp.com/api/lien",
      donnesLien,
      function (reponse, statut) {
        var statutEnvoi = false;

        if (statut >= 200 && statut < 400) {
          statutEnvoi = true;
        }

        lancerMessage(statutEnvoi);

        setTimeout(afficheAjax, 100);
      },
      true
    );
  }

  /*************************************************************
   *
   * démarrage de l'application
   *
   **************************************************************/

  afficheAjax();

  /*************************************************************
   *
   * envoie de requête ajax pour mettre à jours la liste des lien à intervalles réguliers
   *
   *
   **************************************************************/

  setInterval(afficheAjax, 2000);
};
export default App;
