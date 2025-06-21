export const initialStore=()=>{
  return{
    hoverCountryInfo: null // start empty
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_country_info':
      return {
        ...store,
        hoverCountryInfo: action.payload
      };

    default:
      throw Error('Unknown action.');
  }    
}
