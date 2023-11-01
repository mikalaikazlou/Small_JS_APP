const container_images = document.querySelector(".container_images");
const input_search = document.querySelector("#searchId");
const search_btn = document.querySelector("div.search_btn");
const close_btn = document.querySelector('.close_btn_div');

let api_key = "JhsANdBec-XCcRiPWz98gukkpF-SvqJNlKrEvwNFkYs";


async function getData(keyWord, countOnPage) {
  const responseData = await fetch(`https://api.unsplash.com/search/photos?query=${keyWord}&per_page=${countOnPage}&orientation=landscape&client_id=${api_key}&tag_mode=all`);
  const data = await responseData.json();
  show(data);
}

function show(params) {
  for (const key in params.results) {
    createBlockWithImageElement(params.results[key]);
    console.log(params.results);
  }
}


function createBlockWithImageElement(params) {
  let wrapBlock = document.createElement("div");
  wrapBlock.classList.add("wrap_image");
  wrapBlock.setAttribute('onclick','fullScreen(this)');

  let img = document.createElement("img");
  img.classList.add("gallery-img");
  img.id = params.id;
  img.src = params.urls.regular;
  img.alt = params.alt_description;

  wrapBlock.append(img);
  container_images.append(wrapBlock);
}

function fullScreen(e) {
 e.classList.toggle('full_screen');
}
function clearWindow() {
  document.querySelectorAll(".wrap_image").forEach((e) => {
    e.remove();
  });
}

function setCloseBtnInInput() {
  close_btn.classList.add("active");
}

function fillWindowWithPictures() {
  let query_word = input_search.value;
  clearWindow();
  if (!query_word) {
    query_word = "summer";
  }
  getData(query_word, 40);
}

document.querySelector("input").focus();
getData("spring", 12);


//////////////////////////////
/////////Listners////////////

close_btn.addEventListener('click', function () {
  input_search.value = '';
  close_btn.classList.remove('active');
})

input_search.addEventListener('keyup', (e)=>{
  if (e.key === 'Enter' || e.keyCode === 13) {
    fillWindowWithPictures();
  }
});

document.querySelector('input').addEventListener('keyup', function(){
  if (this.value.length > 0) {
    setCloseBtnInInput();
  }
  else if(this.value.length === 0) {
    close_btn.classList.remove('active');
  }
})
search_btn.addEventListener("click", () => {
  fillWindowWithPictures();
});