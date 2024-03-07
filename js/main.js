$(document).ready(function(){
    // display data came from localstorage when refresh the page
    displayData(localStorage.getItem("levelId"));

    let currentMembers = [];


    // some styles for borders and pseudo elements
 if($(".placeholder:last-of-type ul li").length > 1){
    $(".placeholder:last-of-type ul").addClass("padding-t-25");
 }

 $(".placeholder").each(function(){
    if($(this).children("ul").children("li").length > 1){
        $(this).children("ul").addClass("padding-b-25")
    }
 })
  
 $(".placeholder").on("drop" , function(e){
    $("#popup").removeClass('d-none').addClass('d-flex');

})



// Drag & Drop
$(".member").on("dragstart", function() {
    currentMembers.push($(this).clone(true));
});
$(".placeholder").on("dragover" , function(e){
    e.preventDefault();
})




// change on select to determine selectedLevel
$('#mySelect').on('change', function() {
    const selectedLevel = parseInt($(this).val());
    if (this.selectedIndex > 0) {
        selectLevel(selectedLevel);
    }
    this.selectedIndex = 0;
});


// Select level from popup and add member to placeholder
let indexCounter = 0;

function selectLevel(level) {
    const placeholder = $(`#level${level}`);
    const ul = placeholder.find('ul').length ? placeholder.find('ul') : $('<ul></ul>');
    currentMembers.forEach(function(member, index) {
        const text = member.html();
        indexCounter++;
        const newNode = $(`<li><div class="branch" id="node-${indexCounter}">  ${text} <span class='level-text'>Level ${level}</span>  </div></li>`);
        ul.append(newNode);
    });
    placeholder.append(ul);
    if(ul.children().length > 1) {
        ul.addClass("padding-b-25");
        if($(".placeholder:last-of-type ul li").length > 1){
            $(".placeholder:last-of-type ul").addClass("padding-t-25")
        }
        ul.children("li").children(".branch").addClass("branch-after")
    }else{
        ul.removeClass("padding-b-25");
    }
    $("#popup").removeClass('d-flex').addClass('d-none');
    currentMembers.length = 0;
    if ($(".branch").length > 0) {
        $(`#level${level}`).addClass("noPlaceholder");
    }
    saveInLocalstorage(level)
}



// close popup
$(".popup-header .fa-times").on("click" , function(){
  $(".popup").removeClass("d-flex").addClass("d-none");
  currentMembers = [];
})


// Save data in localstorage
function saveInLocalstorage() {
  const members = [] ;
  $(".placeholder").each(function(){
    levelId = $(this).attr("id").replace("level" , "") ; 
    member = $(this).children("ul").html() ;
    if(member){
     members.push({levelId :levelId , member : member })
    }
  })
  localStorage.setItem("members" , JSON.stringify(members))
}



// retrieve data from Localstorage
function displayData() {
    const members = JSON.parse(localStorage.getItem("members"));
    if (members) {
        members.forEach(function(levelData) {
            const levelId = levelData.levelId;
            const memberHtml = levelData.member;
            let ul = document.createElement("ul");
            ul.innerHTML = memberHtml;
            $(`#level${levelId}`).append(ul);
            if ($(`#level${levelId} .branch`).length > 0) {
                $(`#level${levelId}`).addClass("noPlaceholder");
            }
        });
    }
}




// Delete branch using delete key

let thisBranch ;
let levelID ;

$(document).on("click" , ".branch" , function(e){
    e.stopPropagation()
    $(this).toggleClass("branch-focus")
    thisBranch = $(this) ;
    levelID = $(this).parent().parent().parent(".placeholder").attr("id") ;
})

$(document).on("keydown", function(e) {
    if (e.keyCode === 46 ) {
        if(thisBranch){
            if( thisBranch.attr("class").includes("branch") == true){
                thisBranch.parent().remove();
                saveInLocalstorage()
                if($(`#${levelID} .branch`).length == 1){
                    $(`#${levelID} .branch`).addClass("noAfter")
                    $(`#${levelID} ul`).addClass("padding-0")
                }
                if($(`#${levelID} .branch`).length == 0){
                    $(`#${levelID}`).removeClass("noPlaceholder");
                    $(`#${levelID} ul`).addClass("padding-0")
                }
            }
        }else{
            return;
        }
    }
});




})  // End of document ready function
