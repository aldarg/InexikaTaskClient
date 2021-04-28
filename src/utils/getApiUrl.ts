import { api } from "../components/settings";

export default (method: string, query = ""): string => {
  return [api, method].join("/") + query;
};
