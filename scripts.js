let donnees = JSON.parse(localStorage.getItem("products")) || [];
let trash = JSON.parse(localStorage.getItem("trash")) || []; // Récupérer la corbeille existante ou creer un tableau vide
let newProduct = JSON.parse(localStorage.getItem("newProduct")) || []; // Récupérer le produit existant ou creer un tableau vide


let backPage = document.getElementById("products");
let productList = document.querySelector(".productList");

let trashList = document.querySelector(".trashList");
let trashCount = document.querySelector(".trash-count");

document.addEventListener("DOMContentLoaded", function() {
  trashCount.innerText = trash.length;
});

let modal = document.querySelector(".modal");
let dmodal = document.querySelector(".detail-modal");
let addModal = document.querySelector(".add-modal");
let trashModal = document.querySelector(".trash-modal");


fetch("produits.json") // on va chercher notre fichier json
  .then(function(response) { //then s'execute quand le fichier est trouvé
    if (!response.ok) { // si la reponse n'est pas OK
      throw new Error("Erreur : pas de fichier JSON chargé"); // on affiche l'erreur
    }
    return response.json() // si c'est ok, on transform l'objet en tableau, on charge et on lit le fichier json 
  })

  .then (function(produits){
    if (donnees.length === 0) {
      donnees = produits;
      localStorage.setItem("products", JSON.stringify(donnees));
    }

    displayList();
  })

function displayList(){ // fonction pour montrer la list des produits
  productList.innerHTML = ""; // on clear d'abord

  for (let i = 0; i < donnees.length; i++){ // on parcourt, la classique
    let product = donnees[i]; // on stock dans product

    let rowProduct = document.createElement("tr"); // on cree une row tr dans laquelle on ajoutera le  nos td

    let stockAlert = "";
    if (product.stock > 0){ // condition que si stock > 0 j'ai un rond vert
      stockAlert = `<img src="/imagesProduits/icons/green-circle.png" alt="">`
    } else {
      stockAlert = `<img src="/imagesProduits/icons/red-circle.png" alt="">`
    }

    let rowContent = `
      <td>${product.reference}</td>
      <td>${product.categorie}</td>
      <td>${product.libelle}</td>
      <td>${product.prix}</td>
      <td>${stockAlert}</td>
      <td><button  class="details-btn" onclick="seeDetails('${product.reference}')"></button></td>
      <td><button  class="modifier-btn" onclick="modifier('${product.reference}')"></button></td>
      <td><button class="delet-btn" onclick="deletProduct('${product.reference}')"></button></td>
    `;

    rowProduct.innerHTML = rowContent; //on ajoute le contenu au tr
    productList.appendChild(rowProduct) // on ajoute le tr au tbody
  }
}

function deletProduct(reference){
  // on stock la ligne supprimée dans une variable
  let deletedRow = donnees.find(product => product.reference == reference); // Trouver l'objet unique
  if (deletedRow) {
  trash.push(deletedRow);
  trashCount.innerText = trash.length; // Ajouter directement l'objet
  localStorage.setItem("trash", JSON.stringify(trash)); // Mettre à jour le localStorage
  };

  donnees = donnees.filter(product => product.reference !== reference);// on fait une nouveau tableau sans la ligne à supprimer
  displayList();
  console.log(trash);
}

function modifier(reference){
  modal.classList.remove("dnone");
  backPage.classList.add("blur");

  for (let i = 0; i < donnees.length; i++){
    if (donnees[i].reference === reference){ //si ref dans les donnees = ref de la ligne existante, alors on modifie
      // Ici je vais selct mon champ et le remplire avec mes donnees
      document.getElementById('editReference').value = donnees[i].reference; 
      document.getElementById('editCategorie').value = donnees[i].categorie;
      document.getElementById('editLibelle').value = donnees[i].libelle;
      document.getElementById('editPrix').value = donnees[i].prix;
      document.getElementById('editStock').value = donnees[i].stock;   
    break; 
    }
  }
}

function closeModal(){
  modal.classList.add("dnone");
  dmodal.classList.add("dnone");
  addModal.classList.add("dnone");
  trashModal.classList.add("dnone");

  backPage.classList.remove("blur");

}

function save(reference){ // on va cette fois remplir/ mettre a jour les donnees avec ce qu'il y a dans les champs
  for (let i = 0; i < donnees.length; i++){
    if (donnees[i].reference === reference)
    donnees[i].reference = document.getElementById('editReference').value ;
    donnees[i].categorie = document.getElementById('editCategorie').value;
    donnees[i].libelle = document.getElementById('editLibelle').value ;
    donnees[i].prix = document.getElementById('editPrix').value ;
    donnees[i].stock = document.getElementById('editStock').value;
    break;
  }

  localStorage.setItem("products", JSON.stringify(donnees));
  closeModal();
  displayList();
}

function seeDetails(reference){
  for (let i = 0; i < donnees.length; i++){
    if (donnees[i].reference === reference){
      dmodal.classList.remove("dnone");
      backPage.classList.add("blur");

      let modalReference = document.getElementById("modalReference");
      modalReference.innerText = `${donnees[i].reference}`;

      let modalCategorie = document.getElementById("modalCategorie");
      modalCategorie.innerText = donnees[i].categorie;

      let modalLibelle = document.getElementById("modalLibelle");
      modalLibelle.innerText = donnees[i].libelle;

      let modalDescription = document.getElementById("modalDescription");
      modalDescription.innerText = donnees[i].description;

      let modalPrix = document.getElementById("modalPrix");
      modalPrix.innerText = `${donnees[i].prix} €`;

      let modalStock = document.getElementById("modalStock");
      modalStock.innerText = donnees[i].stock;

      let modalPhoto = document.getElementById("modalPhoto");
      modalPhoto.src = donnees[i].photo; 

      break; // Dès que l'élément est trouvé, on arrête la boucle
    }
  }
}

function addForm(){
  addModal.classList.remove("dnone");
  backPage.classList.add("blur");
}

function addProduct(e){
  e.preventDefault();

  newProduct = {
    reference: document.getElementById("newReference").value,
    categorie: document.getElementById("newCategorie").value,
    libelle: document.getElementById("newLibelle").value,
    description: document.getElementById("newDescription").value,
    prix: parseFloat(document.getElementById("newPrix").value), 
    stock: parseInt(document.getElementById("newStock").value),
  };
  console.log("nouveau produit" + newProduct);
  
  donnees.push(newProduct);
  localStorage.setItem("products", JSON.stringify(donnees));

  closeModal();
  displayList();
}

function openTrash(){ // fonction pour montrer la list des produits
  trashModal.classList.remove("dnone"); // on affiche la modal
  trashList.innerHTML = "";

  for (let i = 0; i < trash.length; i++){ // on parcourt, la classique
    let deletedProducts = trash[i]; // on stock dans product

    let drowProduct = document.createElement("tr"); // on cree une row tr dans laquelle on ajoutera le  nos td

    let stockAlert = "";
    if (deletedProducts.stock > 0){ // condition que si stock > 0 j'ai un rond vert
      stockAlert = `<img src="/imagesProduits/icons/green-circle.png" alt="">`
    } else {
      stockAlert = `<img src="/imagesProduits/icons/red-circle.png" alt="">`
    };

    let rowContent = `
      <td>${deletedProducts.reference}</td>
      <td>${deletedProducts.categorie}</td>
      <td>${deletedProducts.libelle}</td>
      <td>${deletedProducts.prix}</td>
      <td>${stockAlert}</td>
      <td><button  class="details-btn" onclick="seeDetails('${deletedProducts.reference}')"></button></td>
      <td><button  class="restore-btn" onclick="restore('${deletedProducts.reference}')">Restore</button></td>
      <td><button class="delet-btn" onclick="deletTrash('${deletedProducts.reference}')"></button></td>
    `;

    drowProduct.innerHTML = rowContent; //on ajoute le contenu au tr
    trashList.appendChild(drowProduct) // on ajoute le tr au tbody
  }
}

function deletTrash(reference){
  localStorage.removeItem("trash");
  trash = trash.filter(product => product.reference !== reference);// on fait une nouveau tableau sans la ligne à supprimer
  openTrash();
  trashCount.innerText = trash.length;
  console.log(trash);
  if (trash.length === 0) {
    closeModal();
  }
}

function restore(reference) {
  // on cherche le produit dans la corbeille
  let restoredProduct = trash.find(product => product.reference === reference);

  if (restoredProduct) {
    // on l'ajouter à la liste des produits de base
    localStorage.removeItem("trash");
    donnees.push(restoredProduct);

    // on retire le produit de la corbeille
    trash = trash.filter(product => product.reference !== reference);


    displayList();//maj liste
    openTrash(); //maj corbeille

    // si la corbeille est vide , on ferme la modal sinon c'est moche
    if (trash.length === 0) {
      trashModal.classList.add("dnone");
    }
    console.log("Produit restauré :", restoredProduct);
  }
}









