// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) =>{
  e.preventDefault();
  const adminEmail = document.querySelector('admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});
 
//listen for auth status changes
auth.onAuthStateChanged(user =>{
//console.log(user)
if (user){

  //setting  up admin login functions on  
  user.getIdTokenResult().then(idTokenResult => {
    user.admin = idTokenResult.claims.admin;
    setupUI(user);
  })

//console.log('user logged in: ', user);
db.collection('guides').onSnapshot(snapshot => {
  setupGuides(snapshot.docs);  
}, err =>{
  console.log(err.message)
});
} else {
  //console.log('user logged out');
  setupUI();
  setupGuides([]);

}
});

  //create new guide 
  const createForm = document.querySelector('#create-form');
  createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // add new recollection to the db
    db.collection('guides').add({
      title: createForm['title'].value,
      content: createForm['content'].value,
      link: createForm['link'].value
    }).then(() => {
        //close the modal and reset form
        const modal = document.querySelector('modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    })
  })


// sign up
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  //sign up the user
  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    // console.log(cred.user);
    //setting up a bio doc
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });    
    
  }).then(() => {
    const modal = document.querySelector("modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  })
});

//logout a user

const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("user signed out");
  });
});

//login form

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('click', (e) =>{
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        console.log(cred.user)
        // close the login modal and reset the form

        const modal = document.querySelector('modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
     })
    })
