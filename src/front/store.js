export const initialStore = () => {
  return {
    message: null,
    token: null,
    isLoginSuccessful: false,
    loggedIn: false,
    isSignUpSuccessful: false,
    wishlist: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "fetchedToken": {
      const { message, token, isLoginSuccessful, loggedIn } = action.payload;

      return {
        ...store,
        message: message,
        token: token,
        isLoginSuccessful: isLoginSuccessful,
        loggedIn: loggedIn,
      };
    }

    case "successfulSignUp": {
      const { message, isSignUpSuccessful } = action.payload;

      return {
        ...store,
        message: message,
        isSignUpSuccessful: isSignUpSuccessful,
      };
    }

    case "loggedOut": {
      const { message, token, isLoginSuccessful, loggedIn } = action.payload;

      return {
        ...store,
        message: message,
        token: token,
        isLoginSuccessful: isLoginSuccessful,
        loggedIn: loggedIn,
      };
    }

    case "AddToWishlist": {
      const newLocation = action.payload;
      const isInWishList = store.wishlist.some(
        (item) => item.title === newLocation.title
      );
      return {
        ...store,
        wishlist: isInWishList
          ? store.wishlist
          : [...store.wishlist, newLocation],
      };
    }

    case "RemoveFromWishlist": {
      return {
        ...store,
        wishlist: store.wishlist.filter(
          (item) => item.title !== action.payload.title
        ),
      };
    }
    default:
      throw Error("Unknown action.");
  }
}
