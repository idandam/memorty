import { NUMBER_LIST_REG_EXP } from "../constants/constants";
import { BASE } from "../constants/constants";

const buildURL = (path) => {
    let url = new URL(BASE);
    if (path) {
      if (NUMBER_LIST_REG_EXP.test(path)) {
        url.pathname = url.pathname.concat(path);
      } else if (path.includes("=")) {
        new URLSearchParams(path).forEach((value, key) => {
          url.searchParams.set(key, value);
        });
      }
    }
    return url;
  };

  export default buildURL;