const api="http://localhost:3000";

let page=1;

function displayBooks(data){

let html="";

data.forEach(book=>{

html+=`
<div class="book-card">

<h3>${book.title}</h3>

<p><b>Author:</b> ${book.author}</p>

<p><b>Category:</b> ${book.category}</p>

<p class="price">₹${book.price}</p>

<p class="rating">⭐ ${book.rating}</p>

</div>
`;

});

document.getElementById("books").innerHTML=html;

}


function searchBook(){

let title=document.getElementById("search").value;

fetch(api+"/books/search?title="+title)
.then(res=>res.json())
.then(data=>displayBooks(data));

}


function sortPrice(){

fetch(api+"/books/sort/price")
.then(res=>res.json())
.then(data=>displayBooks(data));

}


function sortRating(){

fetch(api+"/books/sort/rating")
.then(res=>res.json())
.then(data=>displayBooks(data));

}


function topBooks(){

fetch(api+"/books/top")
.then(res=>res.json())
.then(data=>displayBooks(data));

}


function nextPage(){

page++;

fetch(api+"/books?page="+page)
.then(res=>res.json())
.then(data=>displayBooks(data));

}