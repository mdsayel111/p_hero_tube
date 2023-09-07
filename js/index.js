async function fetchData(url){
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function sortByviews(){
    let allcontents = [...document.querySelectorAll("#contents > div")];
    for (let i = 0; i < allcontents.length; i++) {
        for (let j = 0; j < allcontents.length - i - 1; j++) {
            if (parseFloat(allcontents[j].querySelector(".views").innerText) < parseFloat(allcontents[j + 1].querySelector(".views").innerText)) {
                // Swap elements
                let temp = allcontents[j].innerHTML;
                allcontents[j].innerHTML = allcontents[j + 1].innerHTML;
                allcontents[j + 1].innerHTML = temp;
            }
        }
    }
}

async function handleOnclick(catagoryId,target){
    await addContents(`https://openapi.programming-hero.com/api/videos/category/${catagoryId}`)
    let catagorys = [...document.getElementsByClassName("catagory")];
    catagorys.forEach(element => {
        element.style.backgroundColor = "#25252526";
    });
    target.style.backgroundColor = "#FF1F3D";
}

function secondTotime(x){
    let hour = Math.floor(x / 3600);
    let minute = Math.floor((x - (hour * 3600)) / 60);
    let time = `${hour} hrs ${minute} min ago`
    if(hour || minute){
        return time;
    }else{
        return "";
    }
}

async function addContents(url){
    let contentsData = await fetchData(url);
    contentsData = contentsData.data;
    let contents = document.getElementById("contents");
    if(contentsData.length !== 0){
        contents.classList.add("grid");
        contents.innerHTML = "";
        contentsData.forEach(element => {
            let content = document.createElement("div");
            content.innerHTML = `
                <div class="card w-full bg-base-100 cursor-pointer bg-white">
                <figure class="relative">
                    <img class="aspect-[3/2]" src="${element.thumbnail}" />
                    <p class="absolute bottom-4 right-4 bg-[#171717] text-white rounded-md px-2 py-1">${secondTotime(element.others.posted_date)}</p>
                </figure>
                <div class="card-details flex">
                <div class="avatar pt-8">
                    <div class="avatar">
                    <div class="w-12 rounded-full">
                        <img src="${element.authors[0].profile_picture}" />
                    </div>
                    </div>
                </div>
                <div class="card-body">
                    <h2 class="card-title">${element.title}</h2>
                    <div class="creator flex items-center justify-start gap-4">
                    <p class="grow-0 text-lg">${element.authors[0].profile_name}</p>
                    <img class="w-4 ${element.authors[0].verified ? "visible" : "invisible"}" src="./image/verify.png" alt="">
                    </div>
                    <p><span class="views">${element.others.views.slice(0,element.others.views.length-1)}</span>K views</p>
                </div>
                </div>
            </div>
            `
            contents.appendChild(content);
        });
    }else{
        contents.innerHTML = ''
        let img = document.createElement("img");
        img.classList = "w-[20%] mx-auto"
        img.src = "./image/Icon.png"
        contents.classList.remove("grid")
        contents.appendChild(img)
    }
}

async function firstTimeLoad(){
    let data = await fetchData('https://openapi.programming-hero.com/api/videos/categories');
    data = data.data;

    // add catagories
    let catagorys = document.getElementById("catagorys");
    data.forEach(element => {
        let div = document.createElement("div");
        div.innerHTML = `
        <button class="btn catagory bg-[#25252526] py-1 rounded-lg min-h-0 leading-normal h-fit" onclick="handleOnclick('${element.category_id}',this)">${element.category}</button>
        `
        let apiContent = document.createElement("div")
        catagorys.appendChild(div);
    });
    let allCatagoryBtn = catagorys.querySelector("button");
    allCatagoryBtn.style.backgroundColor = "#FF1F3D"

    // add contents
    await addContents("https://openapi.programming-hero.com/api/videos/category/1000");
}


firstTimeLoad()