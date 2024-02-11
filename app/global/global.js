let currentUser = null;

export default function change(action, user){
    if(action=='set'){
        currentUser = user;
    }
    else if(action=='get'){
        return currentUser;
    }
}