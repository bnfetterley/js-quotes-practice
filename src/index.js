// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
fetch('http://localhost:3000/quotes?_embed=likes')
.then(r => r.json())
.then(data => data.forEach(quoteObj =>{
  renderQuote(quoteObj)
}))
const quoteList = document.querySelector("#quote-list")
const renderQuote = quote=>{
  let quoteLi = document.createElement("li")
  quoteLi.className = "quote-card"
  let quoteBlock = document.createElement("blockquote")
  quoteBlock.className = "blockquote"
  let quoteP = document.createElement("p")
  quoteP.className = "mb-0"
  quoteP.innerText = quote.quote
  let quoteFooter = document.createElement("footer")
  quoteFooter.className = "blockquote-footer"
  quoteFooter.innerText = quote.author
  // add br?
  let quoteLikeButton = document.createElement("button")
    quoteLikeButton.className = "btn-success"
    quoteLikeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    let quoteDeleteButton = document.createElement("button")
    quoteDeleteButton.className = "btn-danger"
    quoteDeleteButton.innerText = "delete"
    likePost(quoteLikeButton, quote)
    deletePost(quoteDeleteButton,quote, quoteLi)
  quoteBlock.append(quoteP, quoteFooter, quoteLikeButton, quoteDeleteButton)
  quoteLi.append(quoteBlock)
  quoteList.append(quoteLi)
}
let submitForm = document.querySelector("#new-quote-form")
submitForm.addEventListener("submit", (evt) => {
  evt.preventDefault()
  let quoteInput = document.querySelector("#new-quote")
  quoteInput.name = ("newquote")
  let newQuote = evt.target.newquote.value
  let newAuthor = evt.target.author.value
  fetch("http://localhost:3000/quotes?_embed=likes",{
    method: "POST",
    headers: { "Content-Type":"application/json",
    "Accept":"application/json"},
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor,
      likes: []
    })
  })
  .then(resp=>resp.json())
  .then(newQuotePost=>{
    renderQuote(newQuotePost)
  })
})
function deletePost(quoteDeleteButton,quote, quoteLi){
  quoteDeleteButton.addEventListener('click',(evt)=>{ fetch(`http://localhost:3000/quotes/${quote.id}`,{
    method: "DELETE"
  })
  .then( resp=> resp.json())
  .then(deleteQuote=>{
     quoteLi.remove()
  })
  })
}
function likePost(quoteLikeButton, quote){
  quoteLikeButton.addEventListener("click", (event) => {
    fetch('http://localhost:3000/likes', {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        "quoteId": quote.id,
        "createdAt": Date.now()
      })
    })
    .then(r => r.json())
    .then((newLike) => {
      console.log(quote)
      quote.likes.push(newLike)
      quoteLikeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    })
  })
  