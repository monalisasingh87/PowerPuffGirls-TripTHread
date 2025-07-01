export const initialStore=()=>{
  return{
    message: null,
    token: null,
    isLoginSuccessful: false,
    loggedIn: false,
    isSignUpSuccessful: false,
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'fetchedToken':
    {
      const {message, token, isLoginSuccessful, loggedIn} = action.payload;

      return {
        ...store,
        message: message,
        token: token,
        isLoginSuccessful: isLoginSuccessful,
        loggedIn: loggedIn,
      }
    }

    case 'successfulSignUp':
    {
      const {message, isSignUpSuccessful} = action.payload;

      return {
        ...store,
        message: message,
        isSignUpSuccessful: isSignUpSuccessful,
      }
    }

    case 'set_hello': {
      return {
        ...store,
        message: action.payload,
      };
    }


    case 'loggedOut':
    {
      const {message, token, isLoginSuccessful, loggedIn} = action.payload;
      
      return {
        ...store,
        message: message,
        token: token,
        isLoginSuccessful: isLoginSuccessful,
        loggedIn: loggedIn,
      }
    }

    default:
      throw Error('Unknown action.');
  }    
}
