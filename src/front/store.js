export const initialStore=()=>{
  return{
    hoverCountryInfo: null, // start empty
    message: null,
    token: null,
    isLoginSuccessful: false,
    loggedIn: false,
    isSignUpSuccessful: false,
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_country_info':
      return {
        ...store,
        hoverCountryInfo: action.payload
      };
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
