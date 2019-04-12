/* Components
1. form input: for product makers to submit their products and pay $
2. storage: Google sheets to save product submissions
3. displayer: home page to display submitted products (manually adding from Google)
4. custom url: DONE
5. url click tracking: DONE

Display steps:
1. form submission -> Google Sheets
2. manually create div myself 
3. user needs to sign up/sign in to click on any div
4. once signed in, user sees auto generated 

Plan:
Friday: choose URL
Saturday/Sunday: form input, storage & display
Monday: bug fixes
Tuesday: launch plan & launch

*/

// Smooth scroll on anchors and links


$('a[href^="#"]').click(function () {
    $('html, body').animate({
        scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top
    }, 500);

    return false;
});

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});

// Displaying the actual products

let products = [{
    id: 001,
    name: "Tribe of Five",
    shortDesc: "Level up your life",
    longDesc: "No matter what goal you want to work on, there are tons of like-minded people starting out just like you. Let's work together to get better.",
    imageURL: "https://s3.eu-west-2.amazonaws.com/productplace/img/tribeoffive.gif",
    website: "https://www.tribefive.me/",
    team: {
        team1: "",
        team2: ""
    }
},{
    id: 002,
    name: "SalesWolf",
    shortDesc: "More confidence, more sales",
    longDesc: "SalesWolf is the easiest way to master every sales call. We provide a platform for you to create, edit, manage and organise your sales scripts and objection responses, so you have the confidence to close more deals.",
    imageURL: "https://s3.eu-west-2.amazonaws.com/productplace/img/saleswolf.png",
    website: "https://saleswolf.io/"
},{
    id: 003,
    name: "Sheet2Site",
    shortDesc: "Generate a website from Google Sheets",
    longDesc: "",
    imageURL: "https://ph-files.imgix.net/d9a7132b-4ed9-438e-90a0-08320d83d2c2?auto=format&auto=compress&codec=mozjpeg&cs=strip",
    website: "https://www.sheet2site.com"
},{
    id: 004,
    name: "CryptoTwittos",
    shortDesc: "Own Twitter accounts, on the blockchain",
    longDesc: "",
    imageURL: "https://ph-files.imgix.net/fec869c9-4ec9-4398-a3c2-d5fc9dff75ca?auto=format&auto=compress&codec=mozjpeg&cs=strip",
    website: "https://cryptotwittos.com/?ref=producthunt"
},{
    id: 005,
    name: "ValuesFit",
    shortDesc: "Organize and track your job search",
    longDesc: "",
    imageURL: "https://ph-files.imgix.net/221f5140-796e-4782-8bfe-1b7fff8b6ca5?auto=format&auto=compress&codec=mozjpeg&cs=strip",
    website: "https://valuesfit.com/"
},{
    id: 006,
    name: "Paste with Frames",
    shortDesc: "Smart, beautiful, interactive mockups📱",
    longDesc: "",
    imageURL: "https://ph-files.imgix.net/1ef8c3af-6e4b-43d3-b7fb-942f62afbdd0?auto=format&auto=compress&codec=mozjpeg&cs=strip",
    website: "http://www.pasteapp.com"
},{
    id: 007,
    name: "DomainWatch",
    shortDesc: "Get notified when a domain becomes available",
    longDesc: "",
    imageURL: "https://ph-files.imgix.net/89abf0fb-5326-4507-ab92-fc4bdc83c5bc?auto=format&auto=compress&codec=mozjpeg&cs=strip",
    website: "https://domainwatch.me/"
},{
    id: 008,
    name: "ThreadRadar",
    shortDesc: "Get alerted when someone mentions a keyword you care about",
    longDesc: "",
    imageURL: "https://ph-files.imgix.net/cff32722-7c85-414c-8abe-ab0250ad8e8f?auto=format&auto=compress&codec=mozjpeg&cs=strip",
    website: "https://threadradar.com/"
},{
    id: 009,
    name: "MAKE Book",
    shortDesc: "Learn to bootstrap profitable startups ...",
    longDesc: "",
    imageURL: "https://ph-files.imgix.net/0981ac70-a509-42d1-ae88-3ca918c3673c?auto=format&auto=compress&codec=mozjpeg&cs=strip",
    website: "https://makebook.io/"
}]

// USER AUTHENTICATION

let loggedIn = false;

// Check if user has signed in our out

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        
        loggedIn = true;

        // User is signed in.
        console.log(`i'm signed in`)

        $(`#navSignInBtn`).hide();
        $(`#navSignOutBtn`).show();
        $('#userModal').modal('hide');

        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        if (user != null) {
            name = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                            // this value to authenticate with your backend server, if
                            // you have one. Use User.getToken() instead.
            
            let usersRef = firebase.database().ref().child('users/');

            firebase.database().ref(`users/`).once("value", snapshot => {
                const usersSnapshot = snapshot.val();
                if (usersSnapshot[uid] != undefined){
                    console.log(`user exists!`);
                } else {
                    console.log("adding new user to db...");
                    usersRef.child(uid).set({
                        email: email,
                        links: {
                            "links": "test"
                        }
                    })  
                }
             });

        } 

        // ...
    } else {
        // User is signed out.
        
        loggedIn = false;
        $("#navSignInBtn").show();
        console.log(`user not signed in`)
    }
  });

// Sign in flow

$(`#navSignInBtn`).click(function(){
    $('#userModal').modal('show');
    $(`#loginDialog`).show();
    $(`#signupDialog`).hide();
})

$('#showSignInBtn').click(function(){ 
    $(`#loginDialog`).show();
    $(`#signupDialog`).hide();; 
    return false; 
});


// Actual sign in authentication

$(`#signInBtn`).click(function(){

    let email = $("#loginEmail").val();
    let password = $("#loginPassword").val();
    
    if(email != "" && password != "") {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
            $("#loginError").text(error.message);
            $("#loginBtn").show();
            $("#loginEmail").val("");
            $("#loginPassword").val("");
            
        });
    } else {
        $(`#loginError`).text('You need to enter some details to log in 😉')
    }

})

// Sign up authentication

$(`#showSignUpBtn`).click(function(){
    $(`#loginDialog`).hide();
    $(`#signupDialog`).show();
})

$(`#signUpBtn`).click(function(){

    var email = $("#signupEmail").val();
    var password = $("#signupPassword").val();

    if(email != "" && password != "") {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {

            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorMessage);
            $(`#signupError`).text(error.message);
            // ...
        });
    } else {
        $(`#signupError`).text('You need to enter some details to sign up 😉')
    }

      $("#signupEmail").val("");
      $("#signupPassword").val("");
})

$(`#navSignOutBtn`).click(function(){

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        $(`#navSignInBtn`).show();
        $(`#navSignOutBtn`).hide();
    }).catch(function(error) {
        // An error happened.
        
        console.log(error);
    })
})

// PRODUCT DISPLAY SECTION

// Populating products section with products and modals

$( document ).ready(function(){
    products.map(function(item,i){
        $(`.prodlist`).append(
            `<div class="col-md-4">
                <div class="card mb-4 box-shadow" data-toggle="modal" data-target="#modal${products[i].id}">
                    <img class="card-img-top" src="${products[i].imageURL}" alt="${products[i].name}">
                    <div class="card-body">
                        <p class="card-text">${products[i].shortDesc}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                            </div>
                            <small class="text-muted">${products[i].name}</small>
                        </div>
                    </div>
                </div>
            </div>`
        );

        // Modals for the products
        $(`.modals`).append(
            `<div class="modal fade" id="modal${products[i].id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">You've selected ${products[i].name}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <img class="card-img-modal" src="${products[i].imageURL}" alt="${products[i].name}">
                            <div class="row">
                                <div class="col-sm">
                                    <h4>About the product</h4>
                                    <p>${products[i].longDesc}</p>
                                </div>

                                <div class="col-sm">
                                    <h4>How this works</h4>
                                    <p>Simply get your unique URL, embed ${products[i].name}'s details on your site and start generating extra revenue</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <h5>Team info</h5>
                                    <div class="alert alert-light" role="alert">
                                        
                                    </div>    
                                </div>
                                <div class="col-sm">
                                    <h5>Example</h5>
                                    <div class="alert alert-danger" role="alert">
                                        ${products[i].shortDesc}. <a href="#" class="alert-link">Click here to</a> read more. Sponsored.
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" id="getURLBtn${products[i].id}" onclick="getProduct(this.id)">Get unique URL</button>
                        </div>
                    </div>
                </div>
            </div>`
        );
    })
})

// This will be the choice user made when they picked a product to display
// ie change to getElementById...pick box, find original url within that box and run the 
// On click they will be generated their own unique url for this product

let chosenProduct = "";

function getProduct(id){
    if (loggedIn===true) {
        let currentId = `00${id.match(/\d+/)[0]}`;
        currentId = parseInt(currentId);
        let currentProduct = products.filter(function(i){
            return (i.id === currentId)
        })
        chosenProduct = currentProduct[0];
        createURL(currentProduct[0])
    } else {
        $(`.modal`).modal('hide');
        $('#userModal').modal('show'); 
        $(`#loginDialog`).hide();
        $(`#signupDialog`).show();
        console.log("not logged in");
    }

}

function createURL(product){
    let random = Math.floor(Math.random()*99999);

    $.ajax({
        url: `https://api.rebrandly.com/v1/links`,
        type: "post",
        data: JSON.stringify({
            "destination" : product.website
            , "domain": { "fullName": "rebrand.ly" }
        , "slashtag": `produplace${random}`
        , "title": product.name
        }),
        headers: {
        "Content-Type": "application/json",
        "apikey": "a8859dcabda44016962f282da9b40a96"
        },
        dataType: "json",
        success: returnURL
    });

}

// After user clicked and has been generated unique URL, this gets saved

function returnURL(link, textStatus,xhr) {

    let user = firebase.auth().currentUser;
    let uid = user.uid;
    let linksRef = firebase.database().ref().child(`users/${uid}/links`);
    linksRef.once("value",snapshot => {
        let linksSnapshot = snapshot.val();
        let valueExists = false;
        let existingURL, existingID, existingClicks;
        for (let key in linksSnapshot) {
            if (linksSnapshot[key].productName === link.title) {
                existingID = linksSnapshot[key].linkID;
                valueExists = true;
                break;
            } else {
                valueExists = false;
            }
        }
        if (valueExists === true) {

            $.ajax({
                dataType: "json",
                url: `https://api.rebrandly.com/v1/links/${existingID}`,
                data: {
                    "apikey": "a8859dcabda44016962f282da9b40a96"
                },
                success: function (data) {
                    console.log(data);
                    existingURL = data.shortUrl;
                    existingClicks = data.clicks;
                    $(`#modal${chosenProduct.id} .modal-body`).html(
                        `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Woo!</strong> Just add the below <strong>unique link</strong> and <strong>summary</strong> to somewhere visible on your website!
                            <br>${chosenProduct.shortDesc}. <a href="http://${existingURL}" target="_blank" >Find out more</a>.
                            <br><br>Clicks so far: <strong>${existingClicks} clicks</strong>. Want to check back? No worries, just head to your dashboard!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                    );
                }
            })
            console.log("found in DB");
        } else {
            console.log("not found in DB and adding...");
            $(`#modal${chosenProduct.id} .modal-body`).html(
                `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Woo!</strong> Just add the below <strong>unique link</strong> and <strong>summary</strong> to somewhere visible on your website!
                    <br>${chosenProduct.shortDesc}. <a href="http://${link.shortUrl}" target="_blank" >Find out more</a>.
                    <br><br>Clicks so far: <strong>${link.clicks} clicks</strong>. Want to check back? No worries, just head to your dashboard!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`
            );
            let newLinkRef = linksRef.push();
            newLinkRef.set({
                productName: `${link.title}`,
                linkURL: `${link.shortUrl}`,
                linkID: `${link.linkId}`
            });
        }
    })

}

// Simple dashboard with total number of clicks so far and an estimate of revenue)

// $.ajax({
//     dataType: "json",
//     url: `https://api.rebrandly.com/v1/links/9687669`,
//     data: {
//         "apikey": "a8859dcabda44016962f282da9b40a96"
//     },
//     success: function (data) {
//         console.log(data);
//     }
// })

