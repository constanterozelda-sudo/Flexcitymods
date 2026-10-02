const mods=[
 {id:1,name:"Super Car Pack",category:"Carros",version:"1.2",icon:"🚗",desc:"Pacote de carros esportivos para sua biblioteca de mods."},
 {id:2,name:"Mega City Map",category:"Mapas",version:"2.0",icon:"🏙️",desc:"Novo mapa urbano para explorar e descobrir."},
 {id:3,name:"Street Outfit Pack",category:"Personagens",version:"1.0",icon:"🧥",desc:"Pacote de roupas urbanas para personalizar seus personagens."},
 {id:4,name:"Neon Racer",category:"Carros",version:"1.5",icon:"🏎️",desc:"Visual neon para deixar seu carro com um estilo diferente."},
 {id:5,name:"Night City",category:"Mapas",version:"1.1",icon:"🌃",desc:"Uma experiência noturna para a cidade."},
 {id:6,name:"Police Pack",category:"Carros",version:"1.0",icon:"🚓",desc:"Pacote temático de veículos policiais."}
];

let favorites=JSON.parse(localStorage.getItem("fc_favorites")||"[]");
let downloads=JSON.parse(localStorage.getItem("fc_downloads")||"[]");
let category="Todos", page="home", current=null;

const $=id=>document.getElementById(id);
const cats=["Todos","Carros","Mapas","Personagens"];

function save(){
 localStorage.setItem("fc_favorites",JSON.stringify(favorites));
 localStorage.setItem("fc_downloads",JSON.stringify(downloads));
}

function renderCategories(){
 $("categories").innerHTML=cats.map(c=>`<button class="cat ${c===category?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("");
}

function visible(){
 const q=$("search").value.trim().toLowerCase();
 let list=mods.filter(m=>(category==="Todos"||m.category===category)&&(!q||m.name.toLowerCase().includes(q)));
 if(page==="favorites") list=mods.filter(m=>favorites.includes(m.id));
 if(page==="downloads") list=mods.filter(m=>downloads.includes(m.id));
 return list;
}

function render(){
 renderCategories();
 let list=visible();
 $("sectionTitle").textContent=page==="favorites"?"Meus favoritos":page==="downloads"?"Downloads":page==="profile"?"Perfil":"Mods em destaque";
 $("count").textContent=page==="profile"?"":`${list.length} ${list.length===1?"mod":"mods"}`;
 if(page==="profile"){
  $("grid").innerHTML=`<div class="empty"><div style="font-size:55px">👤</div><b>FlexCityMods</b><p>Biblioteca pessoal de mods</p><p>${favorites.length} favoritos · ${downloads.length} downloads</p></div>`;
  return;
 }
 $("grid").innerHTML=list.length?list.map(card).join(""):`<div class="empty"><b>Nada por aqui</b><span>Experimente outra categoria ou pesquisa.</span></div>`;
}

function card(m){
 const fav=favorites.includes(m.id);
 return `<article class="card" onclick="openMod(${m.id})">
  <button class="star ${fav?"on":""}" onclick="event.stopPropagation();toggleFav(${m.id})">${fav?"★":"☆"}</button>
  <div class="art">${m.icon}</div><h3>${m.name}</h3><p class="meta">${m.category} · v${m.version}</p>
 </article>`;
}

function setCategory(c){category=c;page="home";document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page==="home"));render();}
function toggleFav(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();render();if(current===id)updateModal();}
function openMod(id){current=id;const m=mods.find(x=>x.id===id);$("modalName").textContent=m.name;$("modalMeta").textContent=`${m.category} · versão ${m.version}`;$("modalDescription").textContent=m.desc;$("modalIcon").textContent=m.icon;updateModal();$("modal").classList.remove("hidden");}
function updateModal(){if(!current)return;$("favoriteModal").textContent=favorites.includes(current)?"★ Remover dos favoritos":"☆ Adicionar aos favoritos";}
$("favoriteModal").onclick=()=>toggleFav(current);
$("downloadModal").onclick=()=>{if(!downloads.includes(current))downloads.push(current);save();$("downloadModal").textContent="✓ Adicionado à biblioteca";setTimeout(()=>{$("downloadModal").textContent="Adicionar à biblioteca"},1200);}
$("closeModal").onclick=()=>$("modal").classList.add("hidden");
$("modal").onclick=e=>{if(e.target.id==="modal")$("modal").classList.add("hidden")};
$("search").oninput=()=>{page="home";render()};
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>{page=n.dataset.page;document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));n.classList.add("active");render()});

let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").hidden=false});
$("installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$("installBtn").hidden=true}};
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
render();
